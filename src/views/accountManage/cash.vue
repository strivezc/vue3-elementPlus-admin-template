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
          <el-form-item label="状态" prop="status">
            <el-select class="select" clearable v-model="formData.status" placeholder="请选择">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="待审核" :value="0"></el-option>
              <el-option label="正常" :value="1"></el-option>
              <el-option label="已驳回" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="提交时间">
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
            <el-button type="primary" native-type="submit" @click="search" v-permission="'7000'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'7000'">清空选项</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="用户ID" prop="userId"></el-table-column>
        <el-table-column align="center" label="昵称" prop="userName"></el-table-column>
        <el-table-column align="center" label="手机号码">
          <template #default="{ row }">
            <span>{{ row.phone }}</span>
              <query-user-phone
                v-if="row.phone && showPermission1"
                permissionValue="7000"
                :userId="row.userId"
              ></query-user-phone>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提现金额" prop="extractMoney"></el-table-column>
        <el-table-column align="center" label="应缴税费" prop="taxesAmount"></el-table-column>
        <el-table-column align="center" label="实际到账" prop="receivedAmount"></el-table-column>
        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="到账时间" prop="receivedTime"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <span v-if="row.status === 0">待审核</span>
            <span v-if="row.status === 1">正常</span>
            <span v-if="row.status === 2">已驳回</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template #default="{ row }">
            <div class="duohang" :title="row.remark">{{ row.remarks }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="primary"
                plain
                size="small"
                v-if="row.status === 0"
                v-permission="'7003'"
                @click="audit(row)">
                审核
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'7002'"
                @click="real(row)">
                实名信息
              </el-button>
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
    <el-dialog
      title="提现审核"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="top"
      >
        <el-form-item label="用户实名认证">
          真实姓名：{{form.realName}}
          <br/>
          身份证号：{{form.idCard}}
        </el-form-item>
        <el-form-item label="审核意见" prop="result">
          <el-radio-group v-model="form.result">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注:" prop="remark">
          <el-input
            class="form-textarea"
            v-model="form.remark"
            type="textarea"
            maxlength="200"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="实名信息"
      draggable
      v-model="showDialog1"
      width="400px"
    >
      <div class="">用户实名认证</div>
      <el-form
        :model="form1"
        label-position="right"
        label-width="100px"
        class="realform"
      >
        <el-form-item label="真实姓名:">
          {{form1.realName}} 
          <el-button type="primary" v-copyText="form1.realName">复制</el-button>
        </el-form-item>
        <el-form-item label="身份号码:">
          {{form1.idCard}}
          <el-button type="primary" v-copyText="form1.idCard">复制</el-button>
        </el-form-item>
        <el-form-item label="手机号码:">
          {{form1.phone}}
          <el-button type="primary" v-copyText="form1.phone">复制</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="Cash">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    startDate: '',
    endDate: '',
    phone: '',
    keyword: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  showPermission1: false,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: false,
  showDialog1: false,
  form1: {}
})
const form = ref({
  result: '',
  taxesId: '',
  remark: ''
})
const formRules = ref({
  result: [{ required: true, message: '请选择状态！', trigger: 'change' }],
  remark: [{ required: false, message: '请填写审核备注！', trigger: 'blur' }],
})

const ruleFormRef = ref()
const { formData, tableDataLoading, tableData, total, showPermission1, listQuery, showDialog, showDialog1, form1 } = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}


const audit = async (row) => {
  form.value.taxesId = row.id
  try {
    const { data } = await proxy.$http.cash.queryUserRealNameInfo(row.userId)
    console.log(data, 'data')
    if (data) {
      form.value.realName = data.realName
      form.value.idCard = data.idCard
    }
    console.log(form.value, ' form.value')
    showDialog.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}

const real = async (row) => {
  try {
    const { data } = await proxy.$http.cash.queryUserRealNameInfo(row.userId)
    if (data) {
      form1.value = data
    }
    showDialog1.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    startDate: '',
    endDate: '',
    phone: '',
    keyword: ''
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
    const { data, totalCount, showPermission } = await proxy.$http.cash.queryUserTaxesList(params)
    tableData.value = data
    total.value = totalCount
    showPermission1.value = showPermission
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (form.value.result === 1 && form.value.remark === '') {
        proxy.$modal.msgError('请填写审核备注！')
        return false
      }
      await proxy.$http.cash.userTaxesAuditing(form.value)
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
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
</style>
