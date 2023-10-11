import useUserStore from '@/store/modules/user'

export default {
  mounted(el, binding) {
    let { value } = binding
    const menuList = useUserStore().menuList
    if (value) {
      const hasPermission = menuList.includes(value)
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('need permission! Like v-permission="1000"')
    }
  }
}
