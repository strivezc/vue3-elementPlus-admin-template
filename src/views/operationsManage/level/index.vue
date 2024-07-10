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
          <el-form-item label="等级名称">
            <el-input v-model="formData.gradeName" maxlength="50" placeholder="请输入等级名称" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态">
            <el-select
              class="select"
              v-model="formData.gradeStatus"
              clearable
              placeholder="请选择"
            >
              <el-option label="全部" value="" />
              <el-option label="启用" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="search" v-permission="'3600'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'3600'">清空选项</el-button>
            <el-button type="success" @click="add" v-permission="'3602'">新增等级</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="gradeId"></el-table-column>
        <el-table-column align="center" label="等级名称" prop="gradeName"></el-table-column>
        <el-table-column align="center" label="达成条件" prop="gradeIntegral"></el-table-column>
        <el-table-column align="center" label="等级说明">
          <template #default="{ row }">
            <div class="danhang" :title="row.gradeExplain">{{row.gradeExplain}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.gradeStatus === 0 ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改人/时间">
          <template #default="{ row }">
           {{row.updateUser}} ({{ row.updateTime }})
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="danger"
                v-permission="'3603'"
                plain
                size="small"
                v-if="row.gradeStatus === 0"
                @click="updateStatus(row.gradeId, 1)"
                >禁用
              </el-button>
              <el-button
                type="primary"
                v-permission="'3603'"
                plain
                size="small"
                v-else
                @click="updateStatus(row.gradeId, 0)"
                >启用</el-button
              >
              <el-button
                type="primary"
                plain
                size="small"
                @click="edit(row.gradeId)"
                v-permission="'3602'"
                >编辑</el-button
              >
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

<script setup name="Level">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    gradeStatus: '',
    gradeName: '',
  },
  tableDataLoading: false,
  tableData: [],
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
  listQuery
} = toRefs(state)

function add() {
  proxy.$router.push('/operationsManage/addlevel')
}
function edit(id) {
  proxy.$router.push('/operationsManage/editlevel/' + id)
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    gradeStatus: '',
    gradeName: ''
  }
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
    const { data, totalCount } = await proxy.$http.operation.queryGradeList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要启用吗？' : '确定要禁用吗？').then(async () => {
    await proxy.$http.operation.upGradeStatus({ gradeId: id })
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}

search()
</script>

<style scoped lang="scss"></style>
