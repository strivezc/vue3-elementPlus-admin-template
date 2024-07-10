export const components = {
  OperationsManage: () => import('@/layout'),
  Agreement: () => import('@/views/operationsManage/agreement'),
  EditCompliance: () => import('@/views/operationsManage/components/editCompliance'),
  // Feedback: () => import('@/views/operationsManage/feedback'),
  AdManage: () => import('@/views/operationsManage/adManage'),
  SMSManage: () => import('@/components/ParentView'),
  SMSChannel: () => import('@/views/operationsManage/SMSManage/SMSChannel'),
  SMSTemplate: () => import('@/views/operationsManage/SMSManage/SMSTemplate'),
  SMSBlacklist: () => import('@/views/operationsManage/SMSManage/SMSBlacklist'),
  DictManage: () => import('@/components/ParentView'),
  Dict: () => import('@/views/operationsManage/dict'),
  DictData: () => import('@/views/operationsManage/components/dictData'),
  // Whitelist: () => import('@/views/operationsManage/whitelist'),
  // InfoManage: () => import('@/components/ParentView'),
  // TopicManage: () => import('@/views/operationsManage/infoManage/topicManage'),
  ArticleManage: () => import('@/views/operationsManage/infoManage/articleManage'),
  AddArticle: () => import('@/views/operationsManage/infoManage/components/addArticle'),
  EditArticle: () => import('@/views/operationsManage/infoManage/components/editArticle'),
  Level: () => import('@/views/operationsManage/level/index'),
  AddLevel: () => import('@/views/operationsManage/level/addLevel'),
  EditLevel: () => import('@/views/operationsManage/level/editLevel'),
}

const operations = {
  path: '/operationsManage',
  component: components.OperationsManage,
  redirect: 'noRedirect',
  name: 'OperationsManage',
  alwaysShow: true,
  meta: {
    title: '内容管理',
    icon: 'monitor',
    menuId: '3'
  },
  children: [
    {
      path: 'adManage',
      name: 'AdManage',
      component: components.AdManage,
      meta: { title: '广告管理', menuId: '32' }
    },
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
      path: 'articleManage',
      name: 'ArticleManage',
      component: components.ArticleManage,
      meta: { title: '资讯管理', menuId: '33'}
    },
    {
      path: 'addArticle',
      name: 'AddArticle',
      component: components.AddArticle,
      hidden: true,
      meta: { title: '新增资讯', activeMenu: '/operationsManage/articleManage' }
    },
    {
      path: 'editArticle/:id?',
      name: 'EditArticle',
      component: components.EditArticle,
      hidden: true,
      meta: { title: '编辑资讯', activeMenu: '/operationsManage/articleManage' }
    },
    {
      path: 'level',
      name: 'Level',
      component: components.Level,
      meta: { title: '用户等级设置', menuId: '36'}
    },
    {
      path: 'addLevel',
      name: 'AddLevel',
      component: components.AddLevel,
      hidden: true,
      meta: { title: '新增等级', activeMenu: '/operationsManage/level' }
    },
    {
      path: 'editlevel/:id?',
      name: 'EditLevel',
      component: components.EditLevel,
      hidden: true,
      meta: { title: '编辑等级', activeMenu: '/operationsManage/level' }
    },
    // {
    //   path: 'feedback',
    //   name: 'Feedback',
    //   component: components.Feedback,
    //   meta: { title: '建议与反馈', menuId: '31' }
    // },
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
    }
  ]
}

export default operations
