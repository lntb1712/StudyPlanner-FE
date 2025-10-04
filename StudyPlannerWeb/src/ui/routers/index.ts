import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../pages/LoginView.vue'
import Home from '../pages/HomeView.vue'
import AccountManagement from '../pages/AccountManagementView.vue'
import GroupManagement from '../pages/GroupManagementView.vue'
import { useAuthStore } from '../../application/stores/AuthStore'
import ClassManagement from '../pages/ClassManagementView.vue'
import Dashboard from '../pages/DashboardView.vue' // Added import for Dashboard

// Khai báo routes với meta title
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { title: 'Đăng nhập' } },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true, title: 'Trang chủ' },
    children: [
      {
        path: 'account-management',
        name: 'AccountManagement',
        component: AccountManagement,
        meta: { requiresAuth: true, title: 'Quản lý tài khoản' },
      },
      {
        path: 'group-management',
        name: 'GroupManagement',
        component: GroupManagement,
        meta: { requiresAuth: true, title: 'Quản lý nhóm' }, // Thêm route mới
      },
      {
        path: 'class-management',
        name: 'ClassManagement',
        component: ClassManagement,
        meta: { requiresAuth: true, title: 'Quản lý lớp học' }, // Added ClassManagement route
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: false, title: 'Dashboard' }, // Added Dashboard route
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

// Tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // Nếu route cần đăng nhập nhưng chưa login
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    return next({ name: 'Login' })
  }

  // Nếu đã login mà vẫn cố vào trang login → redirect về home
  if (to.name === 'Login' && authStore.isAuthenticated()) {
    return next({ name: 'Home' })
  }

  return next()
})

const DEFAULT_TITLE = 'Study Planner 🎓' // Tên phần mềm của bạn

// Sau khi mỗi lần chuyển route → đổi title
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE
})

export default router