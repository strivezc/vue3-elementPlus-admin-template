import Cookies from 'js-cookie'

const TokenKey = 'token'
const RequestPath = 'requestPath'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setRequestPath(requestPath) {
  return Cookies.set(RequestPath, requestPath)
}
export function getRequestPath() {
  return Cookies.get(RequestPath)
}
