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
              v-model="formData.startDate"
              value-format="YYYY-MM-DD"
              type="date"
              class="date"
              placeholder="开始日期"
            />
            <span class="date-line">-</span>
            <el-date-picker
              v-model="formData.endDate"
              value-format="YYYY-MM-DD"
              type="date"
              class="date"
              placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="用户编号">
            <el-input v-model="formData.userId" placeholder="用户编号" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="URL">
            <el-input v-model="formData.requestUrl" placeholder="URL" class="input" />
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
            <el-button type="primary" native-type="submit" @click="search" v-permission="'4000'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'4000'">清空选项</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="访问时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="用户编号" prop="userId"></el-table-column>
        <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
        <el-table-column align="center" label="用户类型">
          <template #default="{ row }">
            <span v-if="row.userType === -1">游客</span>
            <span v-else-if="row.userType === 0">管理员</span>
            <span v-else-if="row.userType === 1">用户</span>
            <span v-else-if="row.userType === 2">客户/品牌方</span>
            <span v-else-if="row.userType === 3">品牌方子账号</span>
            <span v-else-if="row.userType === 99">超级管理员</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="ip" prop="ip"></el-table-column>
        <el-table-column align="center" label="url" prop="requestUrl"></el-table-column>
        <el-table-column align="center" label="平台类型" prop="platformType"></el-table-column>
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
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    startDate:'',
    endDate:'',
    userId:'',
    requestUrl:'',
    startTime:'',
    endTime:'',
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
    startDate:'',
    endDate:'',
    userId:'',
    requestUrl:'',
    startTime:'',
    endTime:'',
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
    const { data, totalCount } = await proxy.$http.operation.queryAccessLog(params)
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
