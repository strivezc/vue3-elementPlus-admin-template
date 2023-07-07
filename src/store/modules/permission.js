import router, { constantRoutes, asyncRoutes } from '@/router'
import { deepClone } from '@/utils';
import { getFlatRoutes } from '@/utils/getFlatRoutes';
import mergeComponents from '@/router/mergeComponents';

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      menuList: [],
      permissionFlag: false,
    }),
    actions: {
      setRoutes(routes) {
        this.routes = constantRoutes.concat(routes)
      },
      generateRoutes(roles) {
        return new Promise(resolve => {
          // 向后端请求路由数据
          // getRouters().then(res => {
          this.menuList = ['1', '10', '100', '101', '102', '103', '104', '105', '106', '1000','2','20','200'];
          let accessedRoutes = filterAsyncRoutes(asyncRoutes, this.menuList);
          this.setRoutes(accessedRoutes);
          this.permissionFlag=true;
          // 降级后的路由
          const flatRoutes = getFlatRoutes(deepClone(accessedRoutes, ['component']));
          // 指向对应的路由component
          flatRoutes.forEach(item => {
            item.component = mergeComponents[item.name];
            if (item.children && item.children.length > 0) {
              item.children.forEach(child => {
                child.component = mergeComponents[child.name];
              });
            }
          });
          resolve(flatRoutes);
            // const sdata = JSON.parse(JSON.stringify(res.data))
            // const rdata = JSON.parse(JSON.stringify(res.data))
            // const defaultData = JSON.parse(JSON.stringify(res.data))
            // const sidebarRoutes = filterAsyncRouter(sdata)
            // const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            // const defaultRoutes = filterAsyncRouter(defaultData)
            // const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
            // asyncRoutes.forEach(route => { router.addRoute(route) })
            // this.setRoutes(rewriteRoutes)
            // this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
            // this.setDefaultRoutes(sidebarRoutes)
            // this.setTopbarRoutes(defaultRoutes)
            // resolve(rewriteRoutes)
          // })
        })
      }
    }
  })

function hasPermission(menuList, route) {
  if (route.meta && route.meta.menuId) {
    return menuList.includes(route.meta.menuId);
  } else {
    return true;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes
 * @param menuList
 */
function filterAsyncRoutes(routes, menuList) {
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(menuList, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menuList);
      }
      res.push(tmp);
    }
  });
  return res;
}

export default usePermissionStore
