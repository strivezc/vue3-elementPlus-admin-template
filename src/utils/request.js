import axios from 'axios'
import router from '../router'
// import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken, getRequestPath } from '@/utils/auth'
import cache from '@/plugins/cache'
import useUserStore from '@/store/modules/user'

let MODE=import.meta.env.MODE
function getBaseURL() {
  let baseURL = ''
  if (MODE === 'development') {
    const devRequestPath = getRequestPath()
    baseURL = devRequestPath ? devRequestPath : 'http://10.204.42.157:9090'
  } else {
    baseURL = import.meta.env.VITE_APP_BASE_API
  }
  return baseURL
}
// 创建axios实例
const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60000
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseURL()
    if (useUserStore().token) {
      config.headers['token'] = getToken()
    }
    if (config['Content-Type']) {
      config.headers['Content-Type'] = config['Content-Type']
    }

    // 是否需要防止数据重复提交
    const isRepeatSubmit = config['isRepeatSubmit'] || false
    if (isRepeatSubmit && config.method === 'post') {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url // 请求地址
        const s_data = sessionObj.data // 请求数据
        const s_time = sessionObj.time // 请求时间
        const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
        if (
          s_data === requestObj.data &&
          requestObj.time - s_time < interval &&
          s_url === requestObj.url
        ) {
          const message = '数据正在处理，请勿重复提交'
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject({ message })
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 0) {
      if (res.code === 3 || res.code === -5) {
        // hideMessage 是否隐藏错误提示
        if (response.config.hideMessage) {
          return Promise.reject(res || 'Error')
        } else {
          ElMessage.error(res.msg)
        }
      } else if (res.code === -4) {
        ElMessageBox.confirm(res.msg, '提示', {
          confirmButtonText: '确认',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/refreshMenu').then(() => {})
        })
      } else {
        if (res.code === -1) {
          // to re-login
          useUserStore()
            .resetToken()
            .then(() => {
              //
            })
          ElMessageBox.confirm('登录失效，请重新登录！', '提示', {
            confirmButtonText: '确认',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: 'warning'
          }).then(() => {
            location.href = '/admin/login'
          })
        } else {
          ElMessage.error(`操作异常，请联系管理员(${res.code})!`)
        }
      }
      return Promise.reject(res || 'Error')
    } else {
      return res
    }
  },
  (err) => {
    let { message } = err
    if (message === 'Network Error') {
      message = '系统接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    } else if (message.includes('请勿重复提交')) {
      message = '数据正在处理，请勿重复提交'
    } else {
      message = '服务繁忙'
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(err)
  }
)

export default service
