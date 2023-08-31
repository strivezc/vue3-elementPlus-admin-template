import permission from './permission'
import copyText from './common/copyText'

export default function directive(app) {
  app.directive('permission', permission)
  app.directive('copyText', copyText)
}
