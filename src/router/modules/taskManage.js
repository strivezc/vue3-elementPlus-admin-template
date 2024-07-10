export const components = {
  TaskManage: () => import('@/layout'),
  Task: () => import('@/views/taskManage/task'),
  TaskType: () => import('@/views/taskManage/taskType')
}

const taskManage = {
  path: '/taskManage',
  component: components.TaskManage,
  redirect: 'noRedirect',
  name: 'TaskManage',
  alwaysShow: true,
  meta: {
    title: '任务管理',
    icon: 'reading',
    menuId: '2'
  },
  children: [
    {
      path: 'task',
      name: 'Task',
      component: components.Task,
      meta: { title: '任务管理', menuId: '21'}
    },
    {
      path: 'taskType',
      name: 'TaskType',
      component: components.TaskType,
      meta: { title: '任务类型', menuId: '20' }
    }
  ]
}

export default taskManage
