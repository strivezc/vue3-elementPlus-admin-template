export const components = {
  ContentManage: () => import('@/layout'),
  DailyShare: () => import('@/components/ParentView'),
  DailySentence: () => import('@/views/contentManage/dailyShare/dailySentence'),
  InfoManage: () => import('@/components/ParentView'),
  TopicManage: () => import('@/views/contentManage/infoManage/topicManage'),
  ArticleManage: () => import('@/views/contentManage/infoManage/articleManage'),
  AddArticle: () => import('@/views/contentManage/infoManage/components/addArticle'),
  EditArticle: () => import('@/views/contentManage/infoManage/components/editArticle'),
  WordManage: () => import('@/components/ParentView'),
  Vocabulary: () => import('@/views/contentManage/wordManage/vocabulary'),
  WordBank: () => import('@/views/contentManage/wordManage/wordBank'),
  AIManage: () => import('@/components/ParentView'),
  Classify: () => import('@/views/contentManage/AIManage/classify'),
  Robot: () => import('@/views/contentManage/AIManage/robot')
}

const content = {
  path: '/contentManage',
  component: components.ContentManage,
  redirect: 'noRedirect',
  name: 'ContentManage',
  alwaysShow: true,
  meta: {
    title: '内容管理',
    icon: 'folder',
    menuId: '2'
  },
  children: [
    {
      path: 'dailyShare',
      component: components.DailyShare,
      name: 'DailyShare',
      meta: { title: '日常分享', menuId: '20' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'dailySentence',
          component: components.DailySentence,
          name: 'DailySentence',
          meta: { title: '每日一句', menuId: '200' }
        }
      ]
    },
    {
      path: 'infoManage',
      component: components.InfoManage,
      name: 'InfoManage',
      meta: { title: '资讯管理', menuId: '21' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'topicManage',
          component: components.TopicManage,
          name: 'TopicManage',
          meta: { title: '专题管理', menuId: '210' }
        },
        {
          path: 'articleManage',
          component: components.ArticleManage,
          name: 'ArticleManage',
          meta: { title: '文章管理', menuId: '211' }
        },
        {
          path: 'addArticle',
          component: components.AddArticle,
          name: 'AddArticle',
          hidden: true,
          meta: { title: '新增文章', activeMenu: '/contentManage/infoManage/articleManage' }
        },
        {
          path: 'editArticle/:id?',
          component: components.EditArticle,
          name: 'EditArticle',
          hidden: true,
          meta: { title: '编辑文章', activeMenu: '/contentManage/infoManage/articleManage' }
        }
      ]
    },
    {
      path: 'wordManage',
      component: components.WordManage,
      name: 'WordManage',
      meta: { title: '单词管理', menuId: '22' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'vocabulary',
          component: components.Vocabulary,
          name: 'Vocabulary',
          meta: { title: '单词本管理', menuId: '220' }
        },
        {
          path: 'wordBank',
          component: components.WordBank,
          name: 'WordBank',
          meta: { title: '单词库', menuId: '221' }
        }
      ]
    },
    {
      path: 'AIManage',
      component: components.AIManage,
      name: 'AIManage',
      meta: { title: 'AI管理', menuId: '23' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'classify',
          component: components.Classify,
          name: 'Classify',
          meta: { title: 'AI分类管理', menuId: '230' }
        },
        {
          path: 'robot',
          component: components.Robot,
          name: 'Robot',
          meta: { title: 'AI机器人管理', menuId: '231' }
        }
      ]
    }
  ]
}

export default content
