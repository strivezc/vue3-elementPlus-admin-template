export const components = {
  OperationsManage: () => import('@/layout'),
  Agreement: () => import('@/views/operationsManage/agreement'),
  EditCompliance: () => import('@/views/operationsManage/components/editCompliance'),
  Feedback: () => import('@/views/operationsManage/feedback'),
  AdManage: () => import('@/views/operationsManage/adManage'),
  VersionControl: () => import('@/views/operationsManage/versionControl'),
  AppRecommend: () => import('@/views/operationsManage/appRecommend'),
  SMSManage: () => import('@/components/ParentView'),
  SMSChannel: () => import('@/views/operationsManage/SMSManage/SMSChannel'),
  SMSTemplate: () => import('@/views/operationsManage/SMSManage/SMSTemplate'),
  SMSBlacklist: () => import('@/views/operationsManage/SMSManage/SMSBlacklist'),
  DictManage: () => import('@/components/ParentView'),
  Dict: () => import('@/views/operationsManage/dict'),
  DictData: () => import('@/views/operationsManage/components/dictData'),
  Whitelist: () => import('@/views/operationsManage/whitelist')
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
    menuId: '3'
  },
  children: [
    {
      path: 'agreement',
      name: 'Agreement',
      component: components.Agreement,
      meta: { title: '协议管理', menuId: '30' }
    },
    {
      path: 'editCompliance/:id?',
      name: 'EditCompliance',
      component: components.EditCompliance,
      hidden: true,
      meta: { title: '编辑协议', activeMenu: '/operationsManage/agreement' }
    },
    {
      path: 'feedback',
      name: 'Feedback',
      component: components.Feedback,
      meta: { title: '建议与反馈', menuId: '31' }
    },
    {
      path: 'adManage',
      name: 'AdManage',
      component: components.AdManage,
      meta: { title: '广告管理', menuId: '32' }
    },
    {
      path: 'versionControl',
      name: 'VersionControl',
      component: components.VersionControl,
      meta: { title: '版本管理', menuId: '33' }
    },
    {
      path: 'appRecommend',
      name: 'AppRecommend',
      component: components.AppRecommend,
      meta: { title: 'App推荐管理', menuId: '37' }
    },
    {
      path: 'SMSManage',
      component: components.SMSManage,
      name: 'SMSManage',
      meta: { title: '短信管理', menuId: '34' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'SMSChannel',
          component: components.SMSChannel,
          name: 'SMSChannel',
          meta: { title: '短信通道', menuId: '340' }
        },
        {
          path: 'SMSTemplate',
          component: components.SMSTemplate,
          name: 'SMSTemplate',
          meta: { title: '短信模板', menuId: '341' }
        },
        {
          path: 'SMSBlacklist',
          component: components.SMSBlacklist,
          name: 'SMSBlacklist',
          meta: { title: '短信黑名单', menuId: '342' }
        }
      ]
    },
    {
      path: 'dictManage',
      component: components.DictManage,
      name: 'DictManage',
      meta: { title: '数据字典', menuId: '35' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'dict',
          component: components.Dict,
          name: 'Dict',
          meta: { title: '字典详情', menuId: '350' }
        },
        {
          path: 'dictData/:id?',
          name: 'DictData',
          component: components.DictData,
          hidden: true,
          meta: { title: '字典列表', activeMenu: '/operationsManage/dictManage/dict' }
        }
      ]
    },
    {
      path: 'whitelist',
      name: 'Whitelist',
      component: components.Whitelist,
      meta: { title: '功能白名单', menuId: '36' }
    }
  ]
}

export default operations
