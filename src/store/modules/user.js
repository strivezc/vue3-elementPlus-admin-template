import { login, logout, getPermissionInfo } from '@/api/login'
import { getToken, setToken, removeToken, setTalkId, removeTalkId } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    talkId: '',
    avatar: defAva,
    menuList: [],
    permissionFlag: false
  }),
  actions: {
    // 登录
    login(userInfo) {
      const account = userInfo.account.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        login({ account, password })
          .then((res) => {
            const token = res.data.token
            setToken(token)
            this.token = token
            this.talkId = res.data.talkId
            setTalkId(res.data.talkId)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    getPermission() {
      return new Promise((resolve, reject) => {
        getPermissionInfo()
          .then((res) => {
            this.menuList = res.data
            this.permissionFlag = true
            resolve(res.data)
          })
          .catch((error) => {
            this.permissionFlag = false
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.resetToken()
            this.menuList = []
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    resetToken() {
      return new Promise((resolve) => {
        this.token = ''
        removeToken()
        removeTalkId()
        resolve()
      })
    }
  }
})

export default useUserStore
