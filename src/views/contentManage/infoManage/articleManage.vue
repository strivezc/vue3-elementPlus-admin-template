<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="标题">
            <el-input v-model="formData.title" maxlength="50" placeholder="标题" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="专题名">
            <el-select
              class="select"
              v-model="formData.id"
              clearable
              placeholder="请选择"
              @change="changeSubject"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in subjectDownList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="分类">
            <el-select class="select" clearable v-model="formData.typeId" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option
                v-for="item in typeDownList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
            <el-button type="success" @click="add">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="标题" prop="title"></el-table-column>
        <el-table-column align="center" label="所属专题" prop="subjectName"></el-table-column>
        <el-table-column align="center" label="所属分类" prop="typeName"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="排序" prop="sortIndex"></el-table-column>
        <el-table-column align="center" label="浏览量" prop="viewNum"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="danger"
                plain
                size="small"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >下架
              </el-button>
              <el-button type="primary" plain size="small" v-else @click="updateStatus(row.id, 0)"
                >上架</el-button
              >
              <el-button type="primary" plain size="small" @click="edit(row.id)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.currPage"
        v-model:limit="listQuery.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script setup name="ArticleManage">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    id: '',
    status: '',
    title: '',
    typeId: ''
  },
  tableDataLoading: false,
  tableData: [],
  subjectDownList: [],
  allTypeDownList: [],
  typeDownList: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  }
})
const {
  formData,
  tableDataLoading,
  tableData,
  total,
  listQuery,
  subjectDownList,
  typeDownList,
  allTypeDownList
} = toRefs(state)

function add() {
  proxy.$router.push('/contentManage/infoManage/addArticle')
}
function edit(id) {
  proxy.$router.push('/contentManage/infoManage/editArticle/' + id)
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
    }
    const { data, totalCount } = await proxy.$http.content.queryInfoContent(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const getSubjectDownList = async () => {
  try {
    const { data } = await proxy.$http.content.querySubjectDownList()
    subjectDownList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
const getTypeDownList = async () => {
  try {
    const { data } = await proxy.$http.content.queryTypeDownList(formData.value.id)
    typeDownList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
function changeSubject(val) {
  formData.value.typeId = ''
  getTypeDownList()
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.content.updateInfoContentStatus({ id, status })
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}

// getSubjectDownList()
</script>

<style scoped lang="scss"></style>
