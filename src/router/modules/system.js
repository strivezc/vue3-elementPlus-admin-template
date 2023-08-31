export const components = {
  System: () => import('@/layout'),
  RoleLimit: () => import('@/views/system/components/roleLimit'),
}

const system = {
  path: '/system',
  component: components.System,
  redirect: 'noRedirect',
  name: 'System',
  alwaysShow: true,
  meta: {
    title: '权限管理',
    icon: 'tree-table',
  },
  children: [
    {
      path: 'roleLimit',
      name: 'RoleLimit',
      component: components.RoleLimit,
      meta: { title: '权限管理' },
    },
  ],
}

export default system
