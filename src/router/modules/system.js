export const components = {
  System: () => import('@/layout'),
  RoleLimit: () => import('@/views/system/components/roleLimit'),
  UserLimit: () => import('@/views/system/components/userLimit'),
  EditUser: () => import('@/views/system/components/editUser'),
  Role: () => import('@/views/system/role'),
  User: () => import('@/views/system/user')
}

const system = {
  path: '/system',
  component: components.System,
  redirect: 'noRedirect',
  name: 'System',
  alwaysShow: true,
  meta: {
    title: '权限管理',
    icon: 'menu',
    menuId: 'c'
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: components.User,
      meta: { title: '用户管理', menuId: 'c0' }
    },
    {
      path: 'role',
      name: 'Role',
      component: components.Role,
      meta: { title: '角色管理', menuId: 'c1' }
    },
    {
      path: 'roleLimit',
      name: 'RoleLimit',
      component: components.RoleLimit,
      hidden: true,
      meta: { title: '编辑角色', noCache: true, activeMenu: '/system/role' }
    },
    {
      path: 'userLimit',
      name: 'UserLimit',
      component: components.UserLimit,
      hidden: true,
      meta: { title: '用户管理', noCache: true, activeMenu: '/system/user' }
    },
    {
      path: 'editUser',
      name: 'EditUser',
      component: components.EditUser,
      hidden: true,
      meta: { title: '编辑用户', noCache: true, activeMenu: '/system/user' }
    }
  ]
}

export default system
