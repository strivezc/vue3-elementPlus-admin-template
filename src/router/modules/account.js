export const components = {
  Account: () => import('@/layout'),
  EditPassword: () => import('@/views/account'),
}

const account = {
  path: '/account',
  component: components.Account,
  redirect: '/account/editPassword',
  name: 'Account',
  alwaysShow: true,
  meta: {
    title: '账户管理',
    icon: 'lock',
  },
  children: [
    {
      path: 'editPassword',
      name: 'EditPassword',
      component: components.EditPassword,
      meta: { title: '修改密码' },
    },
  ],
}

export default account
