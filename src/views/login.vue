<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px"
        >记住密码
      </el-checkbox>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span v-show="!loading">登 录</span>
          <span v-show="loading">登 录 中...</span>
        </el-button>
      </el-form-item>
      <el-form-item label="dev请求路径" v-if="MODE === 'development'">
        <el-select
          class="select"
          style="width: 210px"
          v-model="requestPath"
          placeholder="请选择"
          @change="changeRequestPath"
        >
          <el-option
            label="http://10.204.42.157:9000"
            value="http://10.204.42.157:9000"
          ></el-option>
          <el-option label="http://10.204.42.89:9000" value="http://10.204.42.89:9000"></el-option>
          <el-option label="https://test.talk915.com" value="https://test.talk915.com"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="el-login-footer">
      <span>Copyright © 深圳青豆教育科技有限公司 粤ICP备 15077651 号</span>
    </div>
  </div>
</template>

<script setup>
import { getRequestPath, setRequestPath } from '@/utils/auth'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const MODE = import.meta.env.MODE
const requestPath = ref('')
const loginForm = ref({
  username: 'admin',
  password: '123456',
  rememberMe: false
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }]
}

const loading = ref(false)
const redirect = ref(undefined)

function changeRequestPath(path) {
  setRequestPath(path)
}
function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('username', loginForm.value.username, { expires: 30 })
        Cookies.set('password', encrypt(loginForm.value.password), { expires: 30 })
        Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
      } else {
        // 否则移除
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          router.push({ path: redirect.value || '/' })
        })
        .catch(() => {
          loading.value = false
        })
    }
  })
}

function getCookie() {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
  console.log(loginForm.value, 'loginForm.value')
}

if (MODE === 'development') {
  requestPath.value = getRequestPath() ? getRequestPath() : 'http://10.204.42.157:9091'
  setRequestPath(requestPath.value)
}
getCookie()
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /*background-image: url('../assets/images/login-background.jpg');*/
  /*background-size: cover;*/
  background: #2d3a4b;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #2c3e50;
  font-weight: bold;
}

.login-form {
  border-radius: 10px;
  background: #ffffff;
  width: 420px;
  padding: 25px 25px 5px 25px;
  margin-top: -150px;
  .el-input {
    height: 50px;

    input {
      height: 50px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
