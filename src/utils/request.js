import axios from 'axios'
import router from '../router'
import {ElNotification, ElMessageBox, ElMessage, ElLoading} from 'element-plus'
import {getToken} from '@/utils/auth'
// import errorCode from '@/utils/errorCode'
// import { tansParams, blobValidate } from '@/utils/ruoyi'
import cache from '@/plugins/cache'
// import { saveAs } from 'file-saver'
import useUserStore from '@/store/modules/user'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  if (useUserStore().token) {
    config.headers['token'] = getToken();
  }
  if (config['Content-Type']) {
    config.headers['Content-Type'] = config['Content-Type'];
  }

  // 是否需要防止数据重复提交
  const isRepeatSubmit = config['isRepeatSubmit'] || false;
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
      const s_url = sessionObj.url;                // 请求地址
      const s_data = sessionObj.data;              // 请求数据
      const s_time = sessionObj.time;              // 请求时间
      const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
    const res = response.data;
    // if the custom code is not 200, it is judged as an error.
    if (res.resultCode !== 0) {
      if (res.resultCode === 3 || res.resultCode === -5) {
        // hideMessage 是否隐藏错误提示
        if (response.config.hideMessage) {
          return Promise.reject(res || 'Error');
        } else {
          ElMessage.error(res.resultMessage);
        }
      } else if (res.resultCode === -4) {
        ElMessageBox.confirm(res.resultMessage, '提示', {
          confirmButtonText: '确认',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning',
        }).then(() => {
          store.dispatch('user/refreshMenu').then(() => {
          });
        });
      } else {
        if (res.resultCode === -1) {
          // to re-login
          ElMessageBox.confirm('登录失效，请重新登录！', '提示', {
            confirmButtonText: '确认',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: 'warning',
          }).then(() => {
            useUserStore().resetToken().then(() => {
              // window.location.href = import.meta.env.VITE_APP_DOMAIN;
              router.push('/login');
            })
          });
        } else {
          ElMessage.error(`操作异常，请联系管理员(${res.resultCode})!`);
        }
      }
      return Promise.reject(res || 'Error');
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({message: message, type: 'error', duration: 5 * 1000})
    return Promise.reject(error)
  }
)
// 通用下载方法
// export function download(url, params, filename, config) {
//   downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
//   return service.post(url, params, {
//     transformRequest: [(params) => { return tansParams(params) }],
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     responseType: 'blob',
//     ...config
//   }).then(async (data) => {
//     const isBlob = blobValidate(data);
//     if (isBlob) {
//       const blob = new Blob([data])
//       saveAs(blob, filename)
//     } else {
//       const resText = await data.text();
//       const rspObj = JSON.parse(resText);
//       const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
//       ElMessage.error(errMsg);
//     }
//     downloadLoadingInstance.close();
//   }).catch((r) => {
//     console.error(r)
//     ElMessage.error('下载文件出现错误，请联系管理员！')
//     downloadLoadingInstance.close();
//   })
// }

export default service
