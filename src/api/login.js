import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    url: '/user/login/adminLogin',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/login/logout',
    method: 'get'
  })
}

// 获取用户详细信息
export function getPermissionInfo() {
  return request({
    url: '/user/userPermission/permissionInfo',
    method: 'get'
  })
}
