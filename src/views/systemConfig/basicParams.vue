<template>
  <div class="app-container">
    <el-form
        ref="ruleFormRef"
        :model="form"
        :inline="true"
        :rules="formRules"
        label-position="right"
        label-width="110px"
        v-permission="'6000'"
    >
      <div class="form-title">用户提现参数</div>
      <el-form-item prop="rangeSmall" label="可提现范围：">
        <el-input
          v-model="form.rangeSmall"
          class="cash-input"
          oninput="value=value.replace(/\s+/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
        <span class="cash-span">至</span>
        <el-input
          v-model="form.rangeBig"
          class="cash-input"
          oninput="value=value.replace(/\s+/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <br />
      <el-form-item prop="count" label="可提现次数：">
        <el-select
          v-model="form.count"
          placeholder="请选择"
          class="cash-select"
        >
          <el-option label="不限制" :value="1"></el-option>
          <el-option label="每月1次" :value="2"></el-option>
          <el-option label="每日1次" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item prop="timeSmall" label="可提现时间：">
        <el-select
          v-model="form.timeSmall"
          placeholder="请选择"
          class="cash-input"
        >
          <!-- <el-option label="1号" :value="1"></el-option>
          <el-option label="2号" :value="2"></el-option> -->
          <el-option :label="item +'号'" :value="item" v-for="item in 31" :key="item"></el-option>
        </el-select>
        <span class="cash-span">至</span>
        <el-select
          v-model="form.timeBig"
          placeholder="请选择"
          class="cash-input"
        >
          <el-option :label="item +'号'" :value="item" v-for="item in 31" :key="item"></el-option>
          <!-- <el-option label="1号" :value="1"></el-option>
          <el-option label="2号" :value="2"></el-option>
          <el-option label="24号" :value="24"></el-option>
          <el-option label="25号" :value="25"></el-option> -->
        </el-select>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button type="primary" @click="submit" v-permission="'6002'">提交</el-button>
      </el-form-item>
    </el-form>
    <el-form
        ref="ruleFormRef1"
        :model="form1"
        :inline="true"
        :rules="formRules1"
        label-position="left"
        label-width="260px"
        v-permission="'6003'"
    >
      <div class="form-title">经验值奖励配置</div>
      <el-form-item prop="oneClaimAward" label="达成1次任务可得经验值：">
        <el-input
          v-model="form1.oneClaimAward"
          oninput="value=value.replace(/\s+/g,'')"
        >
        </el-input>
      </el-form-item>
      <br />
      <el-form-item prop="bountyMultipleAward" class="exp" label="额外根据赏金的倍数值获得经验奖励，设置倍数值：">
        <el-input
          v-model="form1.bountyMultipleAward"
          oninput="value=value.replace(/\s+/g,'')"
        >
        </el-input>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button type="primary" @click="submit1" v-permission="'6004'">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="BasicParams">

const { proxy } = getCurrentInstance()
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const form = ref({
  rangeSmall: '',
  rangeBig: '',
  count: '',
  timeSmall: '',
  timeBig: ''
})
const form1 = ref({
  oneClaimAward: '50',
  bountyMultipleAward: '10'
})
const positive = /^(?:[1-9]\d{0,3}(?:\.\d{1,2})?|0\.(?:[1-9]\d?|0[1-9]\d?)\d?)$/
const num = /^(?![0]+$)[1-9]\d{0,3}$/
const num1 = /^(?![0]+$)[1-9]\d{0,1}$/
const validateRang = (rule, value, callback) => {
  if (!(form.value.rangeSmall && form.value.rangeBig)) {
    callback(new Error('请输入可提现范围!'))
  } else if (!(positive.test(form.value.rangeSmall) && positive.test(form.value.rangeBig))) {
    callback(new Error('请输入0.01-9999.99的数值，仅限两位小数!'))
  } else if (form.value.rangeSmall * 1 >= form.value.rangeBig * 1) {
    callback(new Error('前边界值不可大于或等于后边界值!'))
  } else {
    callback()
  }
}
const validateTime = (rule, value, callback) => {
  if (!(form.value.timeSmall && form.value.timeBig)) {
    callback(new Error('请选择可提现时间!'))
  } else if (form.value.timeSmall * 1 > form.value.timeBig * 1) {
    callback(new Error('前边界值不可大于后边界值!'))
  } else {
    callback()
  }
}
const valiNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入可得经验值!'))
  } else if (!num.test(value)) {
    callback(new Error('请输入1-9999正整数!'))
  } else {
    callback()
  }
}
const valiNum1 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入设置倍数值!'))
  } else if (!num1.test(value)) {
    callback(new Error('请输入1-99正整数!'))
  } else {
    callback()
  }
}
const formRules = ref({
  rangeSmall: [{ required: true, trigger: 'blur', validator: validateRang }],
  count: [{ required: true, trigger: 'change', message: '请选择可提现次数!' }],
  timeSmall: [{ required: true, trigger: 'blur', validator: validateTime }],
})
const ruleFormRef = ref()
const formRules1 = ref({
  oneClaimAward: [{ required: true, trigger: 'blur', validator: valiNum }],
  bountyMultipleAward: [{ required: true, trigger: 'blur', validator: valiNum1 }],
})
const ruleFormRef1 = ref()
const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await proxy.$http.systemConfig.updateBasisData(form.value)
        proxy.$modal.msgSuccess('操作成功!')
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const submit1 = async () => {
  await ruleFormRef1.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await proxy.$http.systemConfig.addOrUpTaskRewardRule(form1.value)
        proxy.$modal.msgSuccess('操作成功!')
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const getDetail = async () => {
  try {
    const { data } = await proxy.$http.systemConfig.queryBasisData()
    if (data) {
      form.value = data
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
const getDetail1 = async () => {
  try {
    const { data } = await proxy.$http.systemConfig.getTaskRewardRule({})
    if (data) {
      form1.value = data
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
if (userStore.menuList.includes('6000')) {
  getDetail()
}
if (userStore.menuList.includes('6003')) {
  getDetail1()
}
</script>
<style scoped lang="scss">
.cash-input{
  width: 150px;
}
:deep(.el-input-group__prepend){
  padding: 0 10px;
}
.cash-span{
  margin: 0 10px;
}
.cash-select{
  width: 335px;
}
.form-title{
  font-size: 16px;
  color: #606266;
  font-weight: 600;
  margin-bottom: 10px;
}
.exp{
  :deep(.el-form-item__label){
    height: auto;
  }
}
</style>