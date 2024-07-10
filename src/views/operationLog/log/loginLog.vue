<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-form-item label="操作日期">
        <el-date-picker
          v-model="formData.createStartTime"
          value-format="YYYY-MM-DD"
          type="date"
          class="date"
          placeholder="开始日期"
        />
        <span class="date-line">-</span>
        <el-date-picker
          v-model="formData.createEndTime"
          value-format="YYYY-MM-DD"
          type="date"
          class="date"
          placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="用户编号">
        <el-input v-model="formData.userId" placeholder="用户编号" class="input" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="formData.type">
          <el-radio label="">全部</el-radio>
          <el-radio :label="1">登录</el-radio>
          <el-radio :label="2">退出</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="search" v-permission="'4010'"
          >查询</el-button
        >
        <el-button @click="clear" v-permission="'4010'">清空选项</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="用户id" prop="userId"></el-table-column>
        <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
        <el-table-column align="center" label="类型">
          <template #default="{ row }">
            {{ row.type == 1 ? '登录' : '退出' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="ip" prop="ip"></el-table-column>
        <!--        <el-table-column align="center" label="地点" prop="createTime"></el-table-column>-->
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

<script setup name="LoginLog">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    createStartTime:'',
    createEndTime:'',
    userId:'',
    type:'',
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  }
})
const { formData, tableDataLoading, tableData, total, listQuery } = toRefs(state)

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    createStartTime:'',
    createEndTime:'',
    userId:'',
    type:'',
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
    const { data, totalCount } = await proxy.$http.operation.queryLoginRecord(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
search()
</script>

<style scoped lang="scss"></style>
