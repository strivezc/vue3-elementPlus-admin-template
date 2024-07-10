import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import setupExtend from 'vite-plugin-vue-setup-extend'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
const os = require('os')
const pathSrc = path.resolve(__dirname, 'src')
function getIPAddress () {
  let interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
    var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.address.startsWith('10.')) {
        return alias.address
      }
    }
  }
}
const myHost = getIPAddress() || 'localhost'
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: '/admin/',
    plugins: [
      vue(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia'
        ],
        resolvers: [
          ElementPlusResolver(
            { importStyle: 'sass' }
          )
        ],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
        eslintrc: {
          enabled: false
        }
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          // 使用unplugin-vue-components按需加载样式，开发环境会导致项目异常卡顿
          // 导致原因：vite会预加载style，当首次启动 vite 服务时会对 style 进行依赖预构建，，因为element-plus的按需样式会导入大量style文件，导致页面会卡住直至style构建完成
          // https://github.com/antfu/unplugin-vue-components/issues/361
          //  这里开发环境不按需加载样式，生产环境才按需加载样式
          ElementPlusResolver(
            {
              importStyle: mode === 'development' ? false : 'sass'
            }
          )
        ],
        dts: path.resolve(pathSrc, 'components.d.ts')
      }),
      // 使用unplugin-vue-components按需加载样式，开发环境会导致项目异常卡顿
      // 导致原因：vite会预加载style，当首次启动 vite 服务时会对 style 进行依赖预构建，，因为element-plus的按需样式会导入大量style文件，导致页面会卡住直至style构建完成
      // https://github.com/antfu/unplugin-vue-components/issues/361
      // 这里自定义一个vite插件，更改src/main.js内容，开发环境全局引入样式
      {
        name: 'import-element-plus-style',
        transform(code, id) {
          if (/src\/main.js$/.test(id)) {
            if (mode === 'development') {
              return {
                code: `${code};import 'element-plus/dist/index.css';import '@/assets/styles/element-theme-dev.scss';`,
                map: null
              }
            } else {
              return {
                code: `${code};import 'element-plus/theme-chalk/src/message-box.scss';import 'element-plus/theme-chalk/src/message.scss';`,
                map: null
              }
            }
          }
        }
      },
      setupExtend(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: command === 'build'
      })
    ],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置别名
        '@': pathSrc
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 相关配置
    server: {
      port: 8085,
      host: myHost,
      open: true
      // proxy: {
      //   // https://cn.vitejs.dev/config/#server-proxy
      //   '/dev-api': {
      //     target: 'http://localhost:8080',
      //     changeOrigin: true,
      //     rewrite: (p) => p.replace(/^\/dev-api/, '')
      //   }
      // }
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      },
      preprocessorOptions: {
        scss: {
          // 自定义的element主题文件
          additionalData:mode === 'development' ? false : `@use "@/assets/styles/element-theme.scss" as *;`
        }
      }
    },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 1500 // chunk 大小警告的限制（以 kbs 为单位）
    },
    esbuild: {
      drop: VITE_APP_ENV === 'production' ? ['console', 'debugger'] : [] // 生产环境移除console
    }
  }
})
