import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/list',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function getAdminTaskStatistics(data) {
  return request({
    url: '/task/admTask/getAdminTaskStatistics',
    method: 'post',
    data
  })
}
export function getTaskWaitAudit(data) {
  return request({
    url: '/task/admTask/getTaskWaitAudit',
    method: 'post',
    data
  })
}
export function getNewTaskStatistics(data) {
  return request({
    url: '/task/admTask/getNewTaskStatistics',
    method: 'post',
    data
  })
}
export function getNewUserStatistics(data) {
  return request({
    url: '/user/userInfo/getNewUserStatistics',
    method: 'post',
    data
  })
}
export function getNewCustomerStatistics(data) {
  return request({
    url: '/user/companyInfo/getNewCustomerStatistics',
    method: 'post',
    data
  })
}
