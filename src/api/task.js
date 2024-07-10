import request from '@/utils/request'

export function queryTaskType(data) {
  return request({
    url: '/task/task/queryTaskType',
    method: 'post',
    data
  })
}
export function addTaskType(data) {
  return request({
    url: `/task/task/addTaskType`,
    method: 'post',
    data
  })
}
export function updateTaskType(data) {
  return request({
    url: '/task/task/updateTaskType',
    method: 'post',
    data
  })
}
export function updateTaskTypeSortIndex(data) {
  return request({
    url: '/task/task/updateTaskTypeSortIndex',
    method: 'post',
    data
  })
}
export function updateTaskTypeStatus(data) {
  return request({
    url: '/task/task/updateTaskTypeStatus',
    method: 'post',
    data
  })
}
export function userQueryTaskType() {
  return request({
    url: `/task/task/userQueryTaskType`,
    method: 'get'
  })
}
export function queryAdminTaskList(data) {
  return request({
    url: '/task/admTask/queryAdminTaskList',
    method: 'post',
    data
  })
}
export function queryAdminTaskInfo(data) {
  return request({
    url: '/task/admTask/queryAdminTaskInfo',
    method: 'post',
    data
  })
}
export function auditTask(data) {
  return request({
    url: '/task/admTask/auditTask',
    method: 'post',
    data
  })
}
export function upRecommendTask(data) {
  return request({
    url: '/task/admTask/upRecommendTask',
    method: 'post',
    data
  })
}