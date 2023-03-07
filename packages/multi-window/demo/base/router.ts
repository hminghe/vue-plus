import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./pages/index.vue'),
    meta: {
      multiWindow: true,
      name: 'Home'
    }
  },
  {
    path: '/detail',
    component: () => import('./pages/detail.vue'),
    meta: {
      multiWindow: true,
      name: 'Detail'
    }
  },
]

const router = createRouter({
  history: createWebHashHistory('/src/demo/base/'),
  routes,
})

export default router
