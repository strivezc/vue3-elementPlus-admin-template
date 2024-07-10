import request from '@/utils/request'

export function queryAgreement() {
  return request({
    url: `/config/agree/queryAgreement`,
    method: 'get'
  })
}
export function queryAgreementOne(data) {
  return request({
    url: `/config/agree/queryAgreementOne`,
    method: 'post',
    data
  })
}
export function updateAgreement(data) {
  return request({
    url: `/config/agree/updateAgreement`,
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
export function queryChannel() {
  return request({
    url: `/config/smsConfig/queryChannel`,
    method: 'get'
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
export function feedbackTypes() {
  return request({
    url: `/user/setUp/feedbackTypes`,
    method: 'get'
  })
}
export function queryLoginRecord(data) {
  return request({
    url: `/config/record/queryLoginRecord`,
    method: 'post',
    data
  })
}
export function queryAccessLog(data) {
  return request({
    url: `/config/record/queryAccessLog`,
    method: 'post',
    data
  })
}
export function versionReview(data) {
  return request({
    url: `/config/version/versionReview`,
    method: 'post',
    data
  })
}
export function queryVersionReview(type) {
  return request({
    url: `/config/version/queryVersionReview/${type}`,
    method: 'get'
  })
}
export function addAppRecommend(data) {
  return request({
    url: `/config/appRecommend/addAppRecommend`,
    method: 'post',
    data
  })
}
export function queryAppRecommend(data) {
  return request({
    url: `/config/appRecommend/queryAppRecommend`,
    method: 'post',
    data
  })
}
export function updateAppRecommend(data) {
  return request({
    url: `/config/appRecommend/updateAppRecommend`,
    method: 'post',
    data
  })
}
export function updateAppRecommendStatus(data) {
  return request({
    url: `/config/appRecommend/updateAppRecommendStatus`,
    method: 'post',
    data
  })
}
export function addInfoContent(data) {
  return request({
    url: '/config/Info/addInfoContent',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function addSubject(data) {
  return request({
    url: '/config/Info/addSubject',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function addSubjectType(data) {
  return request({
    url: '/config/Info/addSubjectType',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function queryAllTypeDownList() {
  return request({
    url: '/config/Info/queryAllTypeDownList',
    method: 'get'
  })
}
export function queryInfo(data) {
  return request({
    url: '/config/Info/queryInfo',
    method: 'post',
    data: data
  })
}
export function queryInfoContent(data) {
  return request({
    url: '/config/Info/queryInfoContent',
    method: 'post',
    data: data
  })
}
export function updateInfoContent(data) {
  return request({
    url: '/config/Info/updateInfoContent',
    method: 'post',
    data: data
  })
}
export function updateInfoContentStatus(data) {
  return request({
    url: '/config/Info/updateInfoContentStatus',
    method: 'post',
    data: data
  })
}
export function updateInfoStatus(data) {
  return request({
    url: '/config/Info/updateInfoStatus',
    method: 'post',
    data: data
  })
}
export function updateSubject(data) {
  return request({
    url: '/config/Info/updateSubject',
    method: 'post',
    data: data
  })
}
export function updateSubjectType(data) {
  return request({
    url: '/config/Info/updateSubjectType',
    method: 'post',
    data: data
  })
}
export function queryOneInfoContent(id) {
  return request({
    url: `/config/Info/queryOneInfoContent/${id}`,
    method: 'get'
  })
}
export function querySubjectDownList() {
  return request({
    url: '/config/Info/querySubjectDownList',
    method: 'get'
  })
}
export function queryTypeDownList(id) {
  return request({
    url: `/config/Info/queryTypeDownList/${id}`,
    method: 'get'
  })
}
export function queryGradeList(data) {
  return request({
    url: '/user/grade/queryGradeList',
    method: 'post',
    data: data
  })
}
export function upGradeStatus(data) {
  return request({
    url: '/user/grade/upGradeStatus',
    method: 'post',
    data: data
  })
}
export function queryGradeById(data) {
  return request({
    url: '/user/grade/queryGradeById',
    method: 'post',
    data: data
  })
}
export function addOrUpGrade(data) {
  return request({
    url: '/user/grade/addOrUpGrade',
    method: 'post',
    data: data
  })
}