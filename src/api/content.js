import request from '@/utils/request'

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
export function addSentence(data) {
  return request({
    url: '/config/content/addSentence',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function editSentence(data) {
  return request({
    url: '/config/content/editSentence',
    method: 'post',
    data: data
  })
}
export function dailySentenceList(data) {
  return request({
    url: '/config/content/dailySentenceList',
    method: 'post',
    data: data
  })
}
export function updateSentenceStatus(id) {
  return request({
    url: `/config/content/updateStatus/${id}`,
    method: 'get'
  })
}
export function bookList(data) {
  return request({
    url: '/config/wordBook/bookList',
    method: 'post',
    data: data
  })
}
export function importBook(data) {
  return request({
    url: '/config/wordBook/importBook',
    method: 'post',
    data: data
  })
}
export function editSubmit(data) {
  return request({
    url: '/config/wordBook/editSubmit',
    method: 'post',
    data: data
  })
}
export function updateRecommend(data) {
  return request({
    url: '/config/wordBook/updateRecommend',
    method: 'post',
    data: data
  })
}
export function updateBookStatus(data) {
  return request({
    url: '/config/wordBook/updateStatus',
    method: 'post',
    data: data
  })
}
export function wordList(data) {
  return request({
    url: '/config/word/list',
    method: 'post',
    data: data
  })
}
export function wordEditSubmit(data) {
  return request({
    url: '/config/word/editSubmit',
    method: 'post',
    data: data
  })
}
export function wordView(data) {
  return request({
    url: '/config/word/view',
    method: 'post',
    data: data
  })
}
export function addExpand(data) {
  return request({
    url: '/config/word/addExpand',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function updateWordStatus(id) {
  return request({
    url: `/config/word/updateStatus/${id}`,
    method: 'get'
  })
}
export function addAiType(data) {
  return request({
    url: '/config/ai/addAiType',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function updateAiType(data) {
  return request({
    url: '/config/ai/updateAiType',
    method: 'post',
    data: data
  })
}
export function queryAiType(data) {
  return request({
    url: '/config/ai/queryAiType',
    method: 'post',
    data: data
  })
}
export function updateAiTypeStatus(data) {
  return request({
    url: '/config/ai/updateAiTypeStatus',
    method: 'post',
    data: data
  })
}
export function queryAiTypeDownList() {
  return request({
    url: '/config/ai/queryAiTypeDownList',
    method: 'get'
  })
}
export function queryRobot(data) {
  return request({
    url: '/config/ai/queryRobot',
    method: 'post',
    data: data
  })
}
export function addRobot(data) {
  return request({
    url: '/config/ai/addRobot',
    method: 'post',
    data: data,
    isRepeatSubmit: true
  })
}
export function updateRobot(data) {
  return request({
    url: '/config/ai/updateRobot',
    method: 'post',
    data: data
  })
}
export function updateRobotStatus(data) {
  return request({
    url: '/config/ai/updateRobotStatus',
    method: 'post',
    data: data
  })
}
export function createReview(data) {
  return request({
    url: '/config/wordBook/createReview',
    method: 'post',
    data: data
  })
}
export function queryRobotOne(id) {
  return request({
    url: `/config/ai/queryRobotOne/${id}`,
    method: 'get'
  })
}
export function typeList(id) {
  return request({
    url: `/study/wordCollect/typeList`,
    method: 'get'
  })
}

export function queryWordBookDownList() {
  return request({
    url: `/config/wordBook/queryWordBookDownList`,
    method: 'get'
  })
}
