import request from '@/utils/request'

export function updatePassword(data) {
  return request({
    url: '/config/permission/updatePassword',
    method: 'post',
    data
  })
}
export function addRole(roleName) {
  return request({
    url: `/config/permission/addRole/${roleName}`,
    method: 'get'
  })
}
export function updateRoleStatus(data) {
  return request({
    url: `/config/permission/updateRoleStatus`,
    method: 'post',
    data
  })
}
export function updateRolePermission(data) {
  return request({
    url: `/config/permission/updateRolePermission`,
    method: 'post',
    data
  })
}
export function toRolePermission(roleId) {
  return request({
    url: `/config/permission/toRolePermission/${roleId}`,
    method: 'get'
  })
}
export function getAllRole() {
  return request({
    url: `/config/permission/getAllRole`,
    method: 'get'
  })
}
export function updateAdminUserStatus(data) {
  return request({
    url: `/config/permission/updateAdminUserStatus`,
    method: 'post',
    data
  })
}
export function adminUserManage(data) {
  return request({
    url: `/config/permission/adminUserManage`,
    method: 'post',
    data
  })
}
export function roleManage(data) {
  return request({
    url: `/config/permission/roleManage`,
    method: 'post',
    data
  })
}
export function flushDataPermissionCache() {
  return request({
    url: `/config/permission/flushDataPermissionCache`,
    method: 'get'
  })
}
export function toEditAdminUser(userId) {
  return request({
    url: `/config/permission/toEditAdminUser/${userId}`,
    method: 'get'
  })
}
export function editAdminUserSubmit(data) {
  return request({
    url: `/config/permission/editAdminUserSubmit`,
    method: 'post',
    data
  })
}
export function dataPermissionEdit(userId, type) {
  return request({
    url: `/config/permission/dataPermissionEdit/${userId}/${type}`,
    method: 'get'
  })
}
export function dataPermissionSubmit(data) {
  return request({
    url: `/config/permission/dataPermissionSubmit`,
    method: 'post',
    data
  })
}
export function addRobotConfig(data) {
  return request({
    url: `/user/userInfo/addRobotConfig`,
    method: 'post',
    data
  })
}
export function userList(data) {
  return request({
    url: `/user/userInfo/userList`,
    method: 'post',
    data
  })
}
export function addAdmin(data) {
  return request({
    url: `/config/permission/addAdmin`,
    method: 'post',
    data,
    isRepeatSubmit: true
  })
}
export function queryRobotConfig(userId) {
  return request({
    url: `/user/userInfo/queryRobotConfig/${userId}`,
    method: 'get'
  })
}
export function queryUserPhone(userId, permissionValue) {
  return request({
    url: `/user/userPermission/queryUserPhone/${userId}/${permissionValue}`,
    method: 'get'
  })
}
// 用户管理
export function queryCompanyInfoList(data) {
  return request({
    url: `/user/companyInfo/queryCompanyInfoList`,
    method: 'post',
    data
  })
}
export function resetPassword(data) {
  return request({
    url: `/user/companyInfo/resetPassword`,
    method: 'post',
    data
  })
}
export function setTaskReviewStatus(data) {
  return request({
    url: `/user/companyInfo/setTaskReviewStatus`,
    method: 'post',
    data
  })
}
export function queryCompanyDetail(userId) {
  return request({
    url: `/user/companyInfo/queryCompanyDetail/${userId}`,
    method: 'get'
  })
}
export function addCompanyInfo(data) {
  return request({
    url: `/user/companyInfo/addCompanyInfo`,
    method: 'post',
    data,
    isRepeatSubmit: true
  })
}
export function updateCompanyInfo(data) {
  return request({
    url: `/user/companyInfo/updateCompanyInfo`,
    method: 'post',
    data,
    isRepeatSubmit: true
  })
}
export function queryUserManageList(data) {
  return request({
    url: `/user/userInfo/queryUserManageList`,
    method: 'post',
    data
  })
}