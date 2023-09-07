import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'

const { sideTheme, tagsView, fixedHeader, dynamicTitle } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '',
    theme: storageSetting.theme || '#409EFF',
    sideTheme: storageSetting.sideTheme || sideTheme,
    tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
    fixedHeader:
      storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
    dynamicTitle:
      storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
  }),
  actions: {
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = value
      }
    },
    // 设置网页标题
    setTitle(title) {
      this.title = title
      useDynamicTitle()
    }
  }
})

export default useSettingsStore
