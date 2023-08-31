import usePermissionStore from '@/store/modules/permission'

export default {
  mounted(el, binding, vnode) {
    let { value } = binding
    value = value && value.toString()
    const menuList = usePermissionStore().menuList
    if (value) {
      const hasPermission = menuList.includes(value)
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('need permission! Like v-permission="1000"')
    }
  },
}
