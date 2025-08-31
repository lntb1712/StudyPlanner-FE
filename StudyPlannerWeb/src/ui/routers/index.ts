import { createRouter, createWebHistory, type RouteRecordRaw, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import Login from '../pages/LoginView.vue';
import Home from '../pages/HomeView.vue';
import { useAuthStore } from '../../application/stores/AuthStore';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const auth = useAuthStore();

  // Sử dụng auth.isAuthenticated() thay vì auth.isAuthenticated
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    return next({ name: 'Login' });
  }

  if (to.name === 'Login' && auth.isAuthenticated()) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;