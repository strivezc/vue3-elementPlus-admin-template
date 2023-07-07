export const components = {
  System: () => import('@/layout'),
  User: () => import('@/views/system/user/index'),
  Log: () => import('@/components/ParentView'),
  Operlog: () => import('@/views/monitor/operlog/index'),
  Logininfor: () => import('@/views/monitor/logininfor/index'),
};

const system=  {
  path: '/system',
  component: components.System,
  redirect: '/system/user',
  name: 'System',
  alwaysShow: true,
  meta: {
    title: '系统管理',
    icon: 'drag',
    menuId: '1',
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: components.User,
      meta: {title: '用户管理', menuId: '2'},
    },
    {
      path: 'log',
      component: components.Log,
      name: 'Log',
      meta: {title: '日志管理', menuId: '10',noCache: false},
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'operlog',
          component: components.Operlog,
          name: 'Operlog',
          meta: {title: '操作日志', menuId: '100', noCache:false},
        },
        {
          path: 'logininfor',
          component: components.Logininfor,
          name: 'Logininfor',
          meta: {title: '登录日志', menuId: '101', noCache:false},
        },
      ]
    }
  ],
}

export default system;
