import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/async/fileServer/uploadFile',
    method: 'post',
    data: data,
  })
}
