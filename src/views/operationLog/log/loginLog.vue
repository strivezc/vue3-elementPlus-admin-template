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
            v-model="formData.date1"
            value-format="yyyy-MM-dd"
            type="date"
            class="date"
            placeholder="选择日期"
        />
        <span class="date-line">-</span>
        <el-date-picker
            v-model="formData.date2"
            value-format="yyyy-MM-dd"
            type="date"
            class="date"
            placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="用户编号">
        <el-input v-model="formData.accountName" placeholder="用户编号" class="input"/>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="formData.status">
          <el-radio label="">全部</el-radio>
          <el-radio :label="0">登录</el-radio>
          <el-radio :label="1">退出</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="用户id" prop="createTime"></el-table-column>
        <el-table-column align="center" label="用户名" prop="createTime"></el-table-column>
        <el-table-column align="center" label="类型" prop="createTime"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="ip" prop="createTime"></el-table-column>
        <el-table-column align="center" label="地点" prop="createTime"></el-table-column>
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
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const data = reactive({
  formData: {},
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  }
})
const { formData, tableDataLoading, tableData, total, listQuery } = toRefs(data)

function search() {
  listQuery.value.currPage = 0
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
    }
    const { resultData, totalCount } = await list(params)
    tableData.value = resultData
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
</script>

<style scoped lang="scss">

</style>
