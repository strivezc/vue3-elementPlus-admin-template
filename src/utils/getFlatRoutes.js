import path from 'path-browserify'

/**
 *@desc 多级路由缓存问题处理
 *克隆原路由数组（克隆时将component字段除外）
 对克隆后的路由数组进行降级处理，动态添加到router中，原路由数组可用来做侧边栏菜单的展示（菜单和路由分离）
 路由降级后，会对面包屑菜单产生影响（展示时中间少了一些层级），可以手动处理还原展示*
 *@author zzc
 *@date 2020/12/04
 */
// 二级以上的菜单降级成二级菜单
function formatRouter(routes, basePath = '/', list = [], parent) {
  routes.map(item => {
    item.path = path.resolve(basePath, item.path);
    const meta = item.meta || {};
    if (!meta.parent && parent) {
      meta.parent = parent.path;
      item.meta = meta;
    }
    if (item.redirect) item.redirect = path.resolve(basePath, item.redirect);
    if (item.children && item.children.length > 0) {
      const arr = formatRouter(item.children, item.path, list, item);
      delete item.children;
      list.concat(arr);
    }
    list.push(item);
  });
  return list;
}

// 菜单降级
export function getFlatRoutes(routes) {
  return routes.map(child => {
    if (child.children && child.children.length > 0) {
      child.children = formatRouter(child.children, child.path, [], child);
    }
    return child;
  });
}
