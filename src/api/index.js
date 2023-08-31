import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/list',
    method: 'post',
    data: data,
    isRepeatSubmit: true,
  })
}
