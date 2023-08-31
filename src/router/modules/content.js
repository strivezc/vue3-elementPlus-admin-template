export const components = {
  ContentManage: () => import('@/layout'),
  DailyShare: () => import('@/components/ParentView'),
  DailySentence: () => import('@/views/contentManage/dailyShare/dailySentence'),
  InfoManage: () => import('@/components/ParentView'),
  TopicManage: () => import('@/views/contentManage/infoManage/topicManage'),
  ArticleManage: () => import('@/views/contentManage/infoManage/articleManage'),
  AddArticle: () => import('@/views/contentManage/infoManage/components/addArticle'),
  WordManage: () => import('@/components/ParentView'),
  Vocabulary: () => import('@/views/contentManage/wordManage/vocabulary'),
  WordBank: () => import('@/views/contentManage/wordManage/wordBank'),
  AIManage: () => import('@/components/ParentView'),
  Classify: () => import('@/views/contentManage/AIManage/classify'),
  Robot: () => import('@/views/contentManage/AIManage/robot'),
}

const content = {
  path: '/contentManage',
  component: components.ContentManage,
  redirect: 'noRedirect',
  name: 'ContentManage',
  alwaysShow: true,
  meta: {
    title: '内容管理',
    icon: 'tool',
  },
  children: [
    {
      path: 'dailyShare',
      component: components.DailyShare,
      name: 'DailyShare',
      meta: { title: '日常分享' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'dailySentence',
          component: components.DailySentence,
          name: 'DailySentence',
          meta: { title: '每日一句' },
        },
      ],
    },
    {
      path: 'infoManage',
      component: components.InfoManage,
      name: 'InfoManage',
      meta: { title: '资讯管理' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'topicManage',
          component: components.TopicManage,
          name: 'TopicManage',
          meta: { title: '专题管理' },
        },
        {
          path: 'articleManage',
          component: components.ArticleManage,
          name: 'ArticleManage',
          meta: { title: '文章管理' },
        },
        {
          path: 'addArticle',
          component: components.AddArticle,
          name: 'AddArticle',
          hidden: true,
          meta: { title: '新增文章', activeMenu: '/contentManage/infoManage/articleManage' },
        },
      ],
    },
    {
      path: 'wordManage',
      component: components.WordManage,
      name: 'WordManage',
      meta: { title: '单词管理' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'vocabulary',
          component: components.Vocabulary,
          name: 'Vocabulary',
          meta: { title: '单词本管理' },
        },
        {
          path: 'wordBank',
          component: components.WordBank,
          name: 'WordBank',
          meta: { title: '单词库' },
        },
      ],
    },
    {
      path: 'AIManage',
      component: components.AIManage,
      name: 'AIManage',
      meta: { title: 'AI管理' },
      redirect: 'noRedirect',
      alwaysShow: true,
      children: [
        {
          path: 'classify',
          component: components.Classify,
          name: 'Classify',
          meta: { title: 'AI分类管理' },
        },
        {
          path: 'robot',
          component: components.Robot,
          name: 'Robot',
          meta: { title: 'AI机器人管理' },
        },
      ],
    },
  ],
}

export default content