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
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="查找用户" prop="keyword">
            <el-input
              v-model="formData.keyword"
              placeholder="请输入用户ID/手机号"
              name="userInfo"
              class="input"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="状态" prop="accountStatus">
            <el-select class="select" clearable v-model="formData.accountStatus" placeholder="请选择">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="正常" :value="0"></el-option>
              <el-option label="封禁" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="注册时间">
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
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="search" v-permission="'1100'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'1100'">清空选项</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
        <el-table-column align="center" label="手机号码">
          <template #default="{ row }">
            <span>{{ row.phone }}</span>
              <query-user-phone
                v-if="row.phone && showPermission1"
                permissionValue="1100"
                :userId="row.id"
              ></query-user-phone>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间" prop="registerTime"></el-table-column>
        <el-table-column align="center" label="完成任务" prop="completeTaskNum"></el-table-column>
        <el-table-column align="center" label="账户余额(元)" prop="balance"></el-table-column>
        <el-table-column align="center" label="已提现总额(元)" prop="withdrawalTotalAmount"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.accountStatus === 0 ? '正常' : '封禁' }}
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

<script setup name="UserList">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    startDate: '',
    endDate: '',
    accountStatus: '',
    keyword: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  showPermission1: false,
  listQuery: {
    currPage: 1,
    pageSize: 10
  }
})

const { formData, tableDataLoading, tableData, total, showPermission1, listQuery } = toRefs(state)

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    startDate: '',
    endDate: '',
    accountStatus: '',
    keyword: ''
  }
  listQuery.value.currPage = 1
  getList()
}

function geTel(tel){
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return tel.replace(reg, "$1****$2")
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
    }
    const { data, totalCount, showPermission } = await proxy.$http.user.queryUserManageList(params)
    tableData.value = data
    total.value = totalCount
    showPermission1.value = showPermission
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
search()
</script>

<style scoped lang="scss">
</style>
