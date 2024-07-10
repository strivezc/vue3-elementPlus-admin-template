export const components = {
  AccountManage: () => import('@/layout'),
  Cash: () => import('@/views/accountManage/cash'),
  Platform: () => import('@/views/accountManage/platform'),
  Recharge: () => import('@/views/accountManage/recharge'),
}

const accountManage = {
  path: '/accountManage',
  component: components.AccountManage,
  redirect: 'noRedirect',
  name: 'AccountManage',
  alwaysShow: true,
  meta: {
    title: '账目管理',
    icon: 'tickets',
    menuId: '7'
  },
  children: [
    {
      path: 'cash',
      name: 'Cash',
      component: components.Cash,
      meta: { title: '提现管理', menuId: '70'}
    },
    {
      path: 'platform',
      name: 'Platform',
      component: components.Platform,
      meta: { title: '平台充值', menuId: '72'}
    },
    {
      path: 'recharge',
      name: 'Recharge',
      component: components.Recharge,
      hidden: true,
      meta: { title: '新增充值', activeMenu: '/accountManage/platform' }
    }
  ]
}

export default accountManage
