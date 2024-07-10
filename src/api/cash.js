import request from '@/utils/request'

export function queryUserTaxesList(data) {
  return request({
    url: '/user/userTaxes/queryUserTaxesList',
    method: 'post',
    data
  })
}
export function queryUserRealNameInfo(id) {
  return request({
    url: `/user/userTaxes/queryUserRealNameInfo/${id}`,
    method: 'get'
  })
}
export function userTaxesAuditing(data) {
  return request({
    url: '/payment/withdrawal/userTaxesAuditing',
    method: 'post',
    data
  })
}
export function queryCompanyList() {
  return request({
    url: `/payment/recharge/queryCompanyList`,
    method: 'get'
  })
}
export function rechargeSubmit(data) {
  return request({
    url: '/payment/recharge/rechargeSubmit',
    method: 'post',
    data
  })
}
export function getAdminComAccountDetails(data) {
  return request({
    url: '/user/companyInfo/getAdminComAccountDetails',
    method: 'post',
    data
  })
}
