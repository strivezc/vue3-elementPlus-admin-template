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
          <el-form-item label="客户ID/名称">
            <el-input
              v-model="formData.companyIdOrName"
              placeholder="请输入客户ID/名称"
              name="userInfo"
              class="input"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="支付方式">
            <el-select class="select" clearable v-model="formData.extendType" placeholder="请选择">
              <el-option label="全部" :value="''"></el-option>
              <el-option v-for="(item, i) in payList" :label="item" :value="i + 1" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="支付时间">
            <el-date-picker
              v-model="formData.startTime"
              value-format="YYYY-MM-DD"
              type="date"
              class="date"
              placeholder="开始日期"
            />
            <span class="date-line">-</span>
            <el-date-picker
              v-model="formData.endTime"
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
            <el-button type="primary" native-type="submit" @click="search" v-permission="'7200'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'7200'">清空选项</el-button>
            <el-button type="success" @click="add" v-permission="'7100'">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <div class="plat-all">金额总计(元)：{{ totalAmount }}</div>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="充值客户">
          <template #default="{ row }">
            <span>【{{ row.companyId }}】{{ row.companyName }} - {{row.brandName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template #default="{ row }">
            <span v-if="row.changeType === 4">平台充值</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）" prop="changeAmount"></el-table-column>
        <el-table-column align="center" label="支付方式">
          <template #default="{ row }">
            <span>{{ payList[row.extendType - 1] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="信息备注">
          <template #default="{ row }">
            <div class="danhang" :title="row.remark">{{ row.remark || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人/支付时间">
          <template #default="{ row }">
            {{ row.createUser }} / {{ row.payTime }}
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

<script setup name="Platform">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    startTime: '',
    endTime: '',
    extendType: '',
    companyIdOrName: '',
    orderNo: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  totalAmount: '',
  payList: ['内部结算', '对公转账', '微信支付', '支付宝支付']
})

const { formData, tableDataLoading, tableData, total, listQuery, totalAmount, payList } = toRefs(state)

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    startTime: '',
    endTime: '',
    extendType: '',
    companyIdOrName: '',
    orderNo: ''
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
    const { data } = await proxy.$http.cash.getAdminComAccountDetails(params)
    tableData.value = data.accountDetail.records
    total.value = data.accountDetail.total
    totalAmount.value = data.totalAmount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
function add() {
  proxy.$router.push('/accountManage/recharge')
}
search()
</script>

<style scoped lang="scss">
.form-textarea{
  width: 100% !important;
}
.realform{
  :deep(.el-form-item__content) {
    justify-content: space-between;
  }
}
.plat-all{
  margin: 10px 0;
}
</style>
