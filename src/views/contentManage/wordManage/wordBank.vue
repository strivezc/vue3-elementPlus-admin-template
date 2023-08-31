<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-form-item label="单词">
        <el-input v-model="formData.accountName" placeholder="单词" class="input" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="单词" prop="createTime"></el-table-column>
        <el-table-column align="center" label="英音" prop="createTime"></el-table-column>
        <el-table-column align="center" label="美音" prop="createTime"></el-table-column>
        <el-table-column align="center" label="释义" prop="createTime"></el-table-column>
        <el-table-column align="center" label="音频" prop="createTime"></el-table-column>
        <el-table-column align="center" label="单词搭配" prop="createTime"></el-table-column>
        <el-table-column align="center" label="例句" prop="createTime"></el-table-column>
        <el-table-column align="center" label="状态" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作" prop="createTime"></el-table-column>
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

<script setup name="WordBank">
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const data = reactive({
  formData: {},
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10,
  },
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
      ...listQuery.value,
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

<style scoped lang="scss"></style>
