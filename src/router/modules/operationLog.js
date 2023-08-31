export const components = {
  OperationLog: () => import('@/layout'),
  Log: () => import('@/components/ParentView'),
  AccessLog: () => import('@/views/operationLog/log/accessLog'),
  LoginLog: () => import('@/views/operationLog/log/loginLog'),
  SMSRecord: () => import('@/views/operationLog/log/SMSRecord'),
}

const operationLog = {
  path: '/operationLog',
  component: components.OperationLog,
  redirect: 'noRedirect',
  name: 'OperationLog',
  alwaysShow: true,
  meta: {
    title: '操作记录',
    icon: 'log',
  },
  children: [
    {
      path: 'log',
      component: components.Log,
      name: 'Log',
      meta: { title: '日志' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'accessLog',
          component: components.AccessLog,
          name: 'AccessLog',
          meta: { title: '访问日志' },
        },
        {
          path: 'loginLog',
          component: components.LoginLog,
          name: 'LoginLog',
          meta: { title: '登录日志' },
        },
        {
          path: 'SMSRecord',
          component: components.SMSRecord,
          name: 'SMSRecord',
          meta: { title: '短信记录' },
        },
      ],
    },
  ],
}

export default operationLog
