<template>
  <div class="app-container">
    <el-form
        ref="ruleFormRef"
        :model="form"
        :inline="true"
        :rules="formRules"
        label-position="top"
        label-width="110px"
    >
      <el-form-item prop="companyId" label="请选择充值客户：">
        <el-select
          v-model="form.companyId"
          placeholder="请选择"
          filterable
          clearable
          class="recharge-input"
        >
          <el-option v-for="(item, i) in companyList" :key="i" :label="'【'+ item.id +'】' + item.companyName + '-' + item.brandName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="rechargeMoney" label="请输入金额：">
        <el-input
          v-model="form.rechargeMoney"
          placeholder="请输入充值金额"
          oninput="value=value.replace(/\s+/g,'')"
          class="recharge-input"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="payType" label="请选择支付方式：">
        <el-radio-group v-model="form.payType">
          <el-radio :label="1">内部结算</el-radio>
          <el-radio :label="2">对公转账</el-radio>
          <el-radio :label="3">微信支付</el-radio>
          <el-radio :label="4">支付宝支付</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="信息备注：" prop="remark">
        <el-input
          class="recharge-input"
          v-model="form.remark"
          type="textarea"
          maxlength="200"
          :autosize="{ minRows: 4, maxRows: 6 }"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <template #label>
          客户账户实际到账：<span class="red">￥{{form.rechargeMoney}}</span>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" v-permission="'7100'">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="recharge">

const { proxy } = getCurrentInstance()
const companyList = ref([])
const form = ref({
  companyId: '',
  rechargeMoney: '',
  remark: ''
})
// const positive = /^(?:[1-9]\d{0,5}|0(?:\.\d{1,2}|[1-9]\d{0,5}))(?:\.\d{1,2})?$/
const positive = /^(?:[1-9]\d{0,5}(?:\.\d{1,2})?|0\.(?:[1-9]\d?|0[1-9]\d?)\d?)$/
const validatePrice = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入充值金额!'))
  } else if (!positive.test(value)) {
    callback(new Error('请输入0.01-999999.99的数值，仅限两位小数'))
  } else {
    callback()
  }
}
const formRules = ref({
  rechargeMoney: [{ required: true, trigger: 'blur', validator: validatePrice }],
  companyId: [{ required: true, trigger: 'change', message: '请选择充值客户!' }],
  payType: [{ required: true, message: '请选择支付方式！', trigger: 'change' }]
})
const ruleFormRef = ref()

const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        proxy.$modal.confirm('您确定要给该客户充值吗？', '提示').then(async() => {
          await proxy.$http.cash.rechargeSubmit(form.value)
          proxy.$modal.setTimeBox('充值已完成！', 2)
          ruleFormRef.value.resetFields()
        })
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const getCompanyList = async () => {
  try {
    const { data } = await proxy.$http.cash.queryCompanyList()
    companyList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
getCompanyList()
</script>
<style scoped lang="scss">
:deep(.el-input-group__prepend){
  padding: 0 10px;
}
.el-form{
  width: 500px;
  .el-form-item{
    width: 100%;
  }
}
.recharge-input{
  width: 400px;
}
.red {
  color: #ff574e;
  font-size: 20px;
}
</style>