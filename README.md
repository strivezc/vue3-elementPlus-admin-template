# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

```bash
# 克隆项目
git clone http://code.talk915.com/chindle-team/web-admin.git

# 进入项目目录
cd web-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:test

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fotmat
```

## 项目结构

```bash
|- web-admin
    |- src
    	|- api：接口请求
    	|- assets：图片,icon图标,公共样式
    	|- components：通用组件
    	|- directive：自定义指令
    	|- layout：布局组件
    	|- router：路由配置
    	|- store：状态管理
    	|- utils：通用工具方法
    	    |- auth.js：token 存取
    	    |- permission.js：权限检查
    	    |- request.js：axios 请求封装
    	    |- index.js：工具方法
    	    |- http.js：模块化http请求
    	|- views：页面
    	|- permission.js：登录认证和路由跳转
    	|- main.js：全局入口文件
    	|- App.vue：全局入口组件
    |- dist：build打包文件
    |- public：存放静态文件
```
