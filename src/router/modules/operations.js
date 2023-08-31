export const components = {
  OperationsManage: () => import('@/layout'),
  Agreement: () => import('@/views/operationsManage/agreement'),
  EditCompliance: () => import('@/views/operationsManage/components/editCompliance'),
  Feedback: () => import('@/views/operationsManage/feedback'),
  AdManage: () => import('@/views/operationsManage/adManage'),
  VersionControl: () => import('@/views/operationsManage/versionControl'),
  SMSManage: () => import('@/components/ParentView'),
  SMSChannel: () => import('@/views/operationsManage/SMSManage/SMSChannel'),
  SMSTemplate: () => import('@/views/operationsManage/SMSManage/SMSTemplate'),
  SMSBlacklist: () => import('@/views/operationsManage/SMSManage/SMSBlacklist'),
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
    {
      path: 'feedback',
      name: 'Feedback',
      component: components.Feedback,
      meta: { title: '建议与反馈' },
    },
    {
      path: 'adManage',
      name: 'AdManage',
      component: components.AdManage,
      meta: { title: '广告管理' },
    },
    {
      path: 'versionControl',
      name: 'VersionControl',
      component: components.VersionControl,
      meta: { title: '版本管理' },
    },
    {
      path: 'SMSManage',
      component: components.SMSManage,
      name: 'SMSManage',
      meta: { title: '短信管理' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'SMSChannel',
          component: components.SMSChannel,
          name: 'SMSChannel',
          meta: { title: '短信通道' },
        },
        {
          path: 'SMSTemplate',
          component: components.SMSTemplate,
          name: 'SMSTemplate',
          meta: { title: '短信模板' },
        },
        {
          path: 'SMSBlacklist',
          component: components.SMSBlacklist,
          name: 'SMSBlacklist',
          meta: { title: '短信黑名单' },
        },
      ],
    },
  ],
}

export default operations
