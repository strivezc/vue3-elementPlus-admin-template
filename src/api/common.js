import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/config/file/uploadImgFile',
    method: 'post',
    data: data
  })
}
export function uploadAudio(data) {
  return request({
    url: '/config/upload/uploadAudio',
    method: 'post',
    data: data
  })
}
export function uploadVideo(data) {
  return request({
    url: '/config/file/uploadVideoFile',
    method: 'post',
    data: data
  })
}