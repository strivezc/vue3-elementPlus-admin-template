import request from '@/utils/request'

export function password(data) {
  return request({
    url: '/adminAccountPassword/password',
    method: 'put',
    data,
  })
}
