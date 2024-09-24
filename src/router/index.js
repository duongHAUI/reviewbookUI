import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: () => import('@/views/home/TheHome.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/TheHome.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/user/MInfoUser.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/book/SearchType.vue')
    },
    {
      path: '/sign_in',
      name: 'sign_in',
      component: () => import('../views/account/SignIn.vue'),
      meta: { hideHeaderFooter: true, removePadding: true } // Hiển thị header/footer
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/account/MRegister.vue'),
      meta: { hideHeaderFooter: true, removePadding: true } // Hiển thị header/footer
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/account/MLogin.vue'),
      meta: { hideHeaderFooter: true, removePadding: true } // Hiển thị header/footer
    },
    {
      path: '/mybook',
      name: 'mybook',
      component: () => import('../views/book/MyBook.vue')
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('../views/book/MBook.vue')
    }
  ]
})
export default router
