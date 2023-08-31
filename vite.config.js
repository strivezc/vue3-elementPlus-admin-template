import vue from '@vitejs/plugin-vue'
import {defineConfig, loadEnv} from 'vite'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import setupExtend from 'vite-plugin-vue-setup-extend'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd())
  const {VITE_APP_ENV} = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia'
        ],
        resolvers: [
          ElementPlusResolver(
            {  importStyle: 'sass'}
          ),
        ],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(
            {
              importStyle: 'sass',
            }
          ),
        ],
        dts: path.resolve(pathSrc, 'components.d.ts'),
      }),
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
      host: '10.204.42.199',
      open: true,
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
                  atRule.remove();
                }
              }
            }
          }
        ]
      },
      preprocessorOptions: {
        scss: {
          //自定义的element主题文件
          additionalData: `@use "@/assets/styles/element-theme.scss" as *;`,
        },
      },
    },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 1500, // chunk 大小警告的限制（以 kbs 为单位）
    },
    esbuild: {
      drop: VITE_APP_ENV === 'production' ? ['console', 'debugger'] : [], // 生产环境移除console
    },
  }
})
