export const components = {
  OperationsManage: () => import('@/layout'),
  Agreement: () => import('@/views/operationsManage/agreement'),
  EditCompliance: () => import('@/views/operationsManage/components/editCompliance'),
}

const operations = {
  path: '/operationsManage',
  component: components.OperationsManage,
  redirect: 'noRedirect',
  name: 'OperationsManage',
  alwaysShow: true,
  meta: {
    title: '运营管理',
    icon: 'monitor',
  },
  children: [
    {
      path: 'agreement',
      name: 'Agreement',
      component: components.Agreement,
      meta: { title: '协议管理' },
    },
    {
      path: 'editCompliance/:id?',
      name: 'EditCompliance',
      component: components.EditCompliance,
      hidden:true,
      meta: { title: '编辑协议', activeMenu: '/operationsManage/agreement' },
    },
    // {
    //   path: 'AIManage',
    //   component: components.AIManage,
    //   name: 'AIManage',
    //   meta: { title: 'AI管理' },
    //   redirect: 'noRedirect',
    //   alwaysShow: true,
    //   children: [
    //     {
    //       path: 'classify',
    //       component: components.Classify,
    //       name: 'Classify',
    //       meta: { title: 'AI分类管理' },
    //     },
    //     {
    //       path: 'robot',
    //       component: components.Robot,
    //       name: 'Robot',
    //       meta: { title: 'AI机器人管理' },
    //     },
    //   ],
    // },
  ],
}

export default operations
