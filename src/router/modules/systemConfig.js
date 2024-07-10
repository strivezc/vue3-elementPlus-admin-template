export const components = {
  SystemConfig: () => import('@/layout'),
  BasicParams: () => import('@/views/systemConfig/basicParams'),
}

const systemConfig = {
  path: '/systemConfig',
  component: components.SystemConfig,
  redirect: 'noRedirect',
  name: 'SystemConfig',
  alwaysShow: true,
  meta: {
    title: '系统配置',
    icon: 'setUp',
    menuId: '6'
  },
  children: [
    {
      path: 'basicParams',
      name: 'BasicParams',
      component: components.BasicParams,
      meta: { title: '基础参数', menuId: '60'}
    },
  ]
}

export default systemConfig
