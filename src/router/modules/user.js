export const components = {
  UserManage: () => import('@/layout'),
  Student: () => import('@/views/userManage/student')
}

const user = {
  path: '/userManage',
  component: components.UserManage,
  redirect: '/userManage/student',
  name: 'UserManage',
  alwaysShow: true,
  meta: {
    title: '用户管理',
    icon: 'user',
    menuId: '1'
  },
  children: [
    {
      path: 'student',
      name: 'Student',
      component: components.Student,
      meta: { title: '学员管理', menuId: '10' }
    }
  ]
}

export default user
