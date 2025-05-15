import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import NewArrivalsView from '../views/NewArrivalsView.vue'
import AboutView from '../views/AboutView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Velo - Главная' }
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('../views/ShopView.vue'),
    meta: { title: 'Velo - Каталог' }
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: { title: 'Velo - Товар' }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { title: 'Velo - Корзина' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true, title: 'Velo - Вход' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true, title: 'Velo - Регистрация' }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/AccountView.vue'),
    meta: { requiresAuth: true, title: 'Velo - Личный кабинет' }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true, title: 'Velo - Оформление заказа' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Velo - Админ-панель' }
  },
  {
    path: '/new',
    name: 'new-arrivals',
    component: NewArrivalsView,
    meta: {
      title: 'Новинки - Velo'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: 'О нас - Velo'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Страница не найдена - Velo'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isAuthenticated']
  const isAdmin = store.getters['auth/isAdmin']
  
  // Update document title
  document.title = to.meta.title || 'Velo - Интернет-магазин'
  
  // Check auth requirements
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Check admin requirements
    if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
      next({ path: '/' })
      return
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isLoggedIn) {
      next({ path: '/' })
      return
    }
  }
  
  next()
})

export default router
