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
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="日期">
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
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="用户编号">
            <el-input v-model="formData.accountName" placeholder="用户编号" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="URL">
            <el-input v-model="formData.accountName" placeholder="URL" class="input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="时间">
            <el-time-picker
              v-model="formData.startTime"
              class="date-picker"
              placeholder="开始时间"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: `00:00:00 -${
                  formData.endTime ? formData.endTime + ':00' : '23:59:59'
                }`
              }"
            />
            <span class="date-line">-</span>
            <el-time-picker
              v-model="formData.endTime"
              class="date-picker"
              placeholder="结束时间"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: `${
                  formData.startTime ? formData.startTime + ':00' : '00:00:00'
                }-23:59:59`
              }"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="访问时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="用户编号" prop="createTime"></el-table-column>
        <el-table-column align="center" label="用户名" prop="createTime"></el-table-column>
        <el-table-column align="center" label="用户类型" prop="createTime"></el-table-column>
        <el-table-column align="center" label="ip" prop="createTime"></el-table-column>
        <el-table-column align="center" label="url" prop="createTime"></el-table-column>
        <el-table-column align="center" label="平台类型" prop="createTime"></el-table-column>
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

<script setup name="AccessLog">
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {},
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

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
    }
    const { data, totalCount } = await list(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
