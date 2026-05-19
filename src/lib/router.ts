import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/booru'
    },
    {
      path: '/booru',
      component: () => import('@/views/HomePage.vue'),
      meta: { module: 'booru' }
    },
    {
      path: '/booru/image/:id',
      component: () => import('@/views/ImagePage.vue'),
      meta: { module: 'booru' }
    },
    {
      path: '/booru/settings',
      component: () => import('@/views/SettingsPage.vue'),
      meta: { module: 'booru' }
    },
    // {
    //   path: '/booru/account',
    //   component: () => import('@/views/AccountPage.vue'),
    //   meta: { module: 'booru' }
    // },
    {
      path: '/booru/popular-tags',
      component: () => import('@/views/PopularTagsPage.vue'),
      meta: { module: 'booru' }
    },
    {
      path: '/settings/wallpaper',
      component: () => import('@/views/WallpaperPage.vue')
    },
    {
      path: '/settings/lockscreen',
      component: () => import('@/views/LockscreenPage.vue')
    },
    {
      path: '/settings/about',
      component: () => import('@/views/AboutPage.vue')
    }
  ]
})

export default router
