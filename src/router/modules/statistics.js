export const components = {
  Statistics: () => import('@/layout'),
  StatisticsTask: () => import('@/views/statistics/task'),
  StatisticsUser: () => import('@/views/statistics/user'),
  StatisticsCustomer: () => import('@/views/statistics/customer'),
}
const statistics = {
  path: '/statistics',
  component: components.Statistics,
  redirect: 'noRedirect',
  name: 'Statistics',
  alwaysShow: true,
  meta: {
    title: '统计中心',
    icon: 'dataLine',
    menuId: '9'
  },
  children: [
    {
      path: 'task',
      name: 'StatisticsTask',
      component: components.StatisticsTask,
      meta: { title: '任务统计', menuId: '90' }
    },
    {
      path: 'user',
      name: 'StatisticsUser',
      component: components.StatisticsUser,
      meta: { title: '用户统计', menuId: '91' }
    },
    {
      path: 'customer',
      name: 'StatisticsCustomer',
      component: components.StatisticsCustomer,
      meta: { title: '客户统计', menuId: '92' }
    }
  ]
}

export default statistics
