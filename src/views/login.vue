<template>
  <div class="login login-container">
    <div class="login-main">
      <div class="main-left"></div>
      <div class="main-right">
        <div class="login-title">后台管理系统</div>
        <el-form ref="loginRef"  onsubmit="return false" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              type="text"
              size="large"
              autocomplete="on"
              :model="loginForm"
              onsubmit="return false"
              placeholder="账号"
              name="account"
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
            >
              <template #prefix>
                <svg-icon icon-class="password" class="el-input__icon input-icon" />
              </template>
            </el-input>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe"
            >记住密码
          </el-checkbox>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="large"
              native-type="submit"
              type="primary"
              style="width: 100%"
              @click.prevent="handleLogin"
            >
              <span v-show="!loading">登 录</span>
              <span v-show="loading">登 录 中...</span>
            </el-button>
          </el-form-item>
          <el-form-item class="login-dev" label="dev请求路径" v-if="MODE === 'development'">
            <el-select
              class="select"
              style="width: 210px"
              v-model="requestPath"
              placeholder="请选择"
              @change="changeRequestPath"
            >
              <el-option label="http://10.204.42.121:9090" value="http://10.204.42.121:9090"></el-option>
              <el-option label="http://10.204.42.157:9090" value="http://10.204.42.157:9090"></el-option>
              <el-option label="http://10.204.42.89:9090" value="http://10.204.42.89:9090"></el-option>
              <el-option label="http://10.204.42.156:9090" value="http://10.204.42.156:9090"></el-option>
              <el-option label="https://test.igbcl.com" value="https://test.igbcl.com"></el-option>
              <el-option label="https://www.igbcl.com/" value="https://www.igbcl.com/"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="el-login-footer">
      <span>深圳伊课科技有限公司 Copyright © 2022 伊课科技 版权所有 粤ICP备2022139807号-14</span>
    </div>
  </div>
</template>

<script setup>
import { getRequestPath, setRequestPath } from '@/utils/auth'
import cache from '@/plugins/cache'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter()
const { proxy } = getCurrentInstance()

const MODE = import.meta.env.MODE
const requestPath = ref('')
const loginForm = ref({
  account: '',
  password: '',
  rememberMe: false
})

const loginRules = {
  account: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }]
}

const loading = ref(false)
const redirect = ref(undefined)

function changeRequestPath(path) {
  setRequestPath(path)
}
function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        cache.local.set('account', loginForm.value.account)
        cache.local.set('password', encrypt(loginForm.value.password))
        cache.local.set('rememberMe', loginForm.value.rememberMe)
      } else {
        // 否则移除
        cache.local.remove('account')
        cache.local.remove('password')
        cache.local.remove('rememberMe')
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
  const account = cache.local.get('account')
  const password = cache.local.get('password')
  const rememberMe = cache.local.get('rememberMe')
  loginForm.value = {
    account: (account ?? '') === '' ? loginForm.value.account : account,
    password: (password ?? '') === '' ? loginForm.value.password : decrypt(password),
    rememberMe: (rememberMe ?? '') === '' ? false : Boolean(rememberMe)
  }
}

if (MODE === 'development') {
  requestPath.value = getRequestPath() ? getRequestPath() : 'http://10.204.42.121:9090'
  setRequestPath(requestPath.value)
}
getCookie()
</script>

<style lang="scss" scoped>
// .login {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   /*background-image: url('../assets/images/login-background.jpg');*/
//   /*background-size: cover;*/
//   background: #2d3a4b;
//   flex-direction: column;
// }
// .title {
//   margin: 0px auto 30px auto;
//   text-align: center;
//   color: #2c3e50;
//   font-weight: bold;
// }

// .login-form {
//   border-radius: 10px;
//   background: #ffffff;
//   width: 420px;
//   padding: 25px 25px 5px 25px;
//   // margin-top: -150px;
//   .el-input {
//     height: 50px;

//     input {
//       height: 50px;
//     }
//   }

//   .input-icon {
//     height: 39px;
//     width: 14px;
//     margin-left: 0px;
//   }
// }
// .login-tip {
//   font-size: 13px;
//   text-align: center;
//   color: #bfbfbf;
// }
// .login-code {
//   width: 33%;
//   height: 40px;
//   float: right;
//   img {
//     cursor: pointer;
//     vertical-align: middle;
//   }
// }
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
// .login-code-img {
//   height: 40px;
//   padding-left: 12px;
// }
.login-container{
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('../assets/images/logbg.png') center no-repeat;
  background-size: cover;
  .login-main{
    display: flex;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 840px;
    height: 440px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 2px 2px 11px rgba(0, 0, 0, .5);
    .main-left{
      flex: 1;
      background: url('../assets/images/log-box-img.png') center no-repeat;
      background-size: cover;
    }
    .main-right{
      padding: 60px 28px 28px;
      width: 360px;
      background: #fff;
      .login-title{
        font-size: 28px;
        font-weight: 600;
        color: #666;
        text-align: center;
      }
      :deep(.el-form){
        margin-top: 40px;
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
    }
  }
}
.login-dev{
  margin-bottom: 0;
  :deep(.el-form-item__label){
    line-height: 50px;
  }
}
</style>
