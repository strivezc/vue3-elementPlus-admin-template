import { createApp } from 'vue'

import '@/assets/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import http from './utils/http' // 模块化引入api
// 注册指令
import plugins from './plugins' // plugins

// svg图标
import 'virtual:svg-icons-register'
import elementIcons from '@/components/SvgIcon/svgicon'
import * as echarts from 'echarts' // 引入echarts
import './permission' // permission control

const app = createApp(App)
// 全局方法挂载
app.config.globalProperties.$http = http
app.config.globalProperties.$echarts = echarts
app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)

directive(app)

app.mount('#app')
