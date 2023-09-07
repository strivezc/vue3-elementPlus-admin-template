import request from '@/utils/request'

export function queryAgreement() {
  return request({
    url: `/config/operation/queryAgreement`,
    method: 'get'
  })
}
export function queryAgreementOne(data) {
  return request({
    url: `/config/operation/queryAgreementOne`,
    method: 'post',
    data
  })
}
export function updateAgreement(data) {
  return request({
    url: `/config/operation/updateAgreement`,
    method: 'post',
    data
  })
}
export function queryFeedback(data) {
  return request({
    url: `/config/feedback/queryFeedback`,
    method: 'post',
    data
  })
}
export function handleFeedback(data) {
  return request({
    url: `/config/feedback/handleFeedback`,
    method: 'post',
    data
  })
}
export function queryFeedbackContent(id) {
  return request({
    url: `/config/feedback/queryFeedbackContent/${id}`,
    method: 'get'
  })
}
export function queryAdManageList(data) {
  return request({
    url: `/config/adv/queryAdManageList`,
    method: 'post',
    data
  })
}
export function addAdv(data) {
  return request({
    url: `/config/adv/addAdv`,
    method: 'post',
    data,
    isRepeatSubmit: true
  })
}
export function updateWebAdvStatus(data) {
  return request({
    url: `/config/adv/updateWebAdvStatus`,
    method: 'post',
    data
  })
}
export function versionList(data) {
  return request({
    url: `/config/version/versionList`,
    method: 'post',
    data
  })
}
export function addVersion(data) {
  return request({
    url: `/config/version/addVersion`,
    method: 'post',
    data,
    isRepeatSubmit: true
  })
}
export function editVersion(data) {
  return request({
    url: `/config/version/editVersion`,
    method: 'post',
    data
  })
}
export function queryVersion(type) {
  return request({
    url: `/config/version/queryVersion/${type}`,
    method: 'get'
  })
}
export function updateStatus(id) {
  return request({
    url: `/config/version/updateStatus/${id}`,
    method: 'get'
  })
}
export function channelList(data) {
  return request({
    url: `/config/smsConfig/channelList`,
    method: 'post',
    data
  })
}
export function useChannel(id) {
  return request({
    url: `/config/smsConfig/useChannel/${id}`,
    method: 'get'
  })
}
export function updateSmsBlack(id) {
  return request({
    url: `/config/smsConfig/updateSmsBlack/${id}`,
    method: 'get'
  })
}
export function addSmsBlack(phone) {
  return request({
    url: `/config/smsConfig/addSmsBlack/${phone}`,
    method: 'get',
    isRepeatSubmit: true
  })
}
export function smsBlack(data) {
  return request({
    url: `/config/smsConfig/smsBlack`,
    method: 'post',
    data
  })
}
export function contentList(data) {
  return request({
    url: `/config/smsConfig/contentList`,
    method: 'post',
    data
  })
}
export function queryChannel(data) {
  return request({
    url: `/config/smsConfig/queryChannel`,
    method: 'post',
    data
  })
}
export function updateContentChannel(data) {
  return request({
    url: `/config/smsConfig/updateContentChannel`,
    method: 'post',
    data
  })
}
export function updateContent(data) {
  return request({
    url: `/config/smsConfig/updateContent`,
    method: 'post',
    data
  })
}
export function sendMsg(data) {
  return request({
    url: `/config/smsConfig/sendMsg`,
    method: 'post',
    data
  })
}
export function updateLimitNum(id, num) {
  return request({
    url: `/config/smsConfig/updateLimitNum/${id}/${num}`,
    method: 'get'
  })
}
export function smsType() {
  return request({
    url: `/config/smsConfig/smsType`,
    method: 'get'
  })
}
export function smsRecord(data) {
  return request({
    url: `/config/smsConfig/smsRecord`,
    method: 'post',
    data
  })
}
export function dictList(data) {
  return request({
    url: `/config/data/list`,
    method: 'post',
    data
  })
}
export function dictaAdd(data) {
  return request({
    url: `/config/data/add`,
    method: 'post',
    data,
    isRepeatSubmit: true
  })
}
export function dictEdit(data) {
  return request({
    url: `/config/data/edit`,
    method: 'post',
    data
  })
}
export function editInfo(data) {
  return request({
    url: `/config/data/editInfo`,
    method: 'post',
    data
  })
}
export function addInfo(data) {
  return request({
    url: `/config/data/addInfo`,
    method: 'post',
    data,
    isRepeatSubmit: true
  })
}
export function dataInfoList(id) {
  return request({
    url: `/config/data/dataInfoList/${id}`,
    method: 'get'
  })
}
export function typeList() {
  return request({
    url: `/config/userTest/typeList`,
    method: 'get'
  })
}
export function whitelist(data) {
  return request({
    url: `/config/userTest/list`,
    method: 'post',
    data
  })
}
export function editTestUser(data) {
  return request({
    url: `/config/userTest/editTestUser`,
    method: 'post',
    data
  })
}
export function addTestUser(data) {
  return request({
    url: `/config/userTest/addTestUser`,
    method: 'post',
    data
  })
}
