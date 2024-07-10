export const components = {
  UserManage: () => import('@/layout'),
  UserList: () => import('@/views/userManage/user'),
  Customer: () => import('@/views/userManage/customer'),
  AddCustomer: () => import('@/views/userManage/addCustomer'),
  EditCustomer: () => import('@/views/userManage/editCustomer')
}

const user = {
  path: '/userManage',
  component: components.UserManage,
  redirect: 'noRedirect',
  name: 'UserManage',
  alwaysShow: true,
  meta: {
    title: '用户管理',
    icon: 'user',
    menuId: '1'
  },
  children: [
    {
      path: 'customer',
      name: 'Customer',
      component: components.Customer,
      meta: { title: '客户管理', menuId: '10' }
    },
    {
      path: 'user',
      name: 'UserList',
      component: components.UserList,
      meta: { title: '用户管理', menuId: '11' }
    },
    {
      path: 'addcustomer',
      name: 'AddCustomer',
      component: components.AddCustomer,
      hidden: true,
      meta: { title: '新增客户', activeMenu: '/userManage/customer' }
    },
    {
      path: 'editcustomer/:id?',
      name: 'EditCustomer',
      component: components.EditCustomer,
      hidden: true,
      meta: { title: '编辑客户', activeMenu: '/userManage/customer' }
    }
  ]
}

export default user
