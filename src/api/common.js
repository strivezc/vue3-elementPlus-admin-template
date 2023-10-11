import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/config/upload/uploadImage',
    method: 'post',
    data: data
  })
}
