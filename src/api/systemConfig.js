import request from '@/utils/request'

export function updateBasisData(data) {
  return request({
    url: '/config/agree/updateBasisData',
    method: 'post',
    data
  })
}
export function queryBasisData() {
  return request({
    url: `/config/agree/queryBasisData`,
    method: 'get'
  })
}
export function getTaskRewardRule(data) {
  return request({
    url: '/task/admTask/getTaskRewardRule',
    method: 'post',
    data
  })
}
export function addOrUpTaskRewardRule(data) {
  return request({
    url: '/task/admTask/addOrUpTaskRewardRule',
    method: 'post',
    data
  })
}