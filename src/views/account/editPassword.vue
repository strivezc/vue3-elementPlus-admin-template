<template>
  <div class="app-container">
    <el-form
        ref="ruleFormRef"
        :model="form"
        :inline="true"
        :rules="formRules"
        label-position="right"
        label-width="110px"
    >
      <el-form-item prop="oldPassword" label="旧密码：">
        <el-input
            v-model="form.oldPassword"
            class="large-input"
            placeholder="请输入当前密码"
            type="password"
            maxlength="20"
            oninput="value=value.replace(/\s+/g,'')"
        />
      </el-form-item>
      <br />
      <el-form-item prop="newPassword" label="新密码：">
        <el-input
            v-model="form.newPassword"
            class="large-input"
            maxlength="20"
            placeholder="8-20位需包含大小写字母、数字或特殊字符"
            type="password"
            oninput="value=value.replace(/\s+/g,'')"
        />
      </el-form-item>
      <br />
      <el-form-item prop="confirmPassword" label="确认新密码：">
        <el-input
            v-model="form.confirmPassword"
            class="large-input"
            maxlength="20"
            placeholder="8-20位需包含大小写字母、数字或特殊字符"
            type="password"
            oninput="value=value.replace(/\s+/g,'')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" v-permission="'5000'">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="EditPassword">
import useUserStore from '@/store/modules/user'

const router = useRouter()
const { proxy } = getCurrentInstance()
const userStore = useUserStore()

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const reg = /(((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,20}$)/
const validateNewPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入新密码!'))
  } else if (value.length < 8) {
    callback(new Error('密码长度是8到20位!'))
  } else if (!reg.test(value)) {
    callback(new Error('密码只能由8到20位的字母、数字、@#$%^&*()等特殊字符组成!'))
  } else {
    callback()
  }
}
const validateConfirmPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请确认新密码!'))
  } else if (value.length < 8) {
    callback(new Error('密码长度是8到20位!'))
  } else if (!reg.test(value)) {
    callback(new Error('密码只能由8到20位的字母、数字、@#$%^&*()等特殊字符组成!'))
  } else if (value !== form.value.newPassword) {
    callback(new Error('两次输入不一样!'))
  } else {
    callback()
  }
}
const formRules = ref({
  oldPassword: [{ required: true, trigger: 'blur', message: '请输入当前密码!' }],
  newPassword: [{ required: true, trigger: 'blur', validator: validateNewPwd }],
  confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPwd }]
})
const ruleFormRef = ref()

const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await proxy.$http.user.updatePassword(form.value)
        ruleFormRef.value.resetFields()
        ElMessageBox.confirm('修改密码成功，请重新登录！', '提示', {
          confirmButtonText: '确定',
          autofocus: false,
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'success'
        }).then(() => {
          userStore.resetToken().then(() => {
            // router.push('/login')
            location.href = '/admin/login'
          })
        })
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
