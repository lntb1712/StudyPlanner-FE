<script setup lang="ts">
import { useAuthStore } from "../../application/stores/AuthStore";
import { useRouter, useRoute } from "vue-router";
import { Home, Users, LogOut, Menu } from "lucide-vue-next";
import { ref } from "vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref<boolean>(true);

const handleLogout = () => {
  auth.logout();
  router.push({ name: "Login" });
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const isActive = (path: string) => route.path.startsWith(path);

// Navigation items config
const navItems = [
  {
    name: "Dashboard",
    path: "/home/dashboard",
    icon: Home,
  },
  {
    name: "Quản lý tài khoản",
    path: "/home/account-management",
    icon: Users,
  },
];
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] h-screen bg-gradient-to-br from-indigo-50 to-gray-100 font-sans text-sm">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white shadow-xl border-r border-gray-100 transition-all duration-300 flex flex-col z-20',
        isSidebarOpen ? 'w-72' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <div v-if="isSidebarOpen" class="flex items-center gap-3 text-2xl font-extrabold text-indigo-700">
          <img src="../../assets/logo.png" alt="Study Planner Logo" class="w-10 h-10" />
          <span class="tracking-tight align-middle">Study Planner</span>
        </div>
        <button
          @click="toggleSidebar"
          class="px-4 py-3 rounded-lg hover:bg-indigo-50 focus:outline-none transition-colors"
        >
          <Menu class="w-6 h-6 text-indigo-700" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200"
          :class="isActive(item.path)
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-900'"
        >
          <component
            :is="item.icon"
            class="w-6 h-6 flex-shrink-0"
            :class="isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'"
          />
          <span v-if="isSidebarOpen" class="truncate">{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-gray-100">
        <button
          @click="handleLogout"
          class="flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-md transition-all"
        >
          <LogOut class="w-6 h-6" />
          <span v-if="isSidebarOpen">Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex flex-col p-6 overflow-auto">
      <!-- Header -->
      <header class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=User&background=6366F1&color=fff"
            alt="avatar"
            class="w-10 h-10 rounded-full shadow-sm"
          />
          <div class="text-xl font-bold text-gray-900">
            Xin chào, <span class="text-indigo-700">{{ auth.username || "User" }}</span> 👋
          </div>
        </div>
        <div class="text-sm text-gray-500">
          {{
            new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          }}
        </div>
      </header>

      <!-- Content Area -->
      <div class="bg-white shadow-lg rounded-2xl p-6 min-h-[90vh] border border-gray-100 transition hover:shadow-xl">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Smooth transitions for sidebar text */
.opacity-0 {
  transition: opacity 0.2s ease-in-out, width 0.2s ease-in-out;
}

/* Hover effect for navigation links */
a:hover {
  transform: translateX(6px);
}

/* Main content transition */
main {
  transition: margin-left 0.3s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  aside {
    width: 20px; /* Collapsed by default on small screens */
  }
  aside.w-72 {
    width: 20rem; /* Expanded width for small screens */
  }
  main {
    margin-left: 20px; /* Match collapsed sidebar width */
  }
}

/* Prevent layout shift during zoom */
html, body {
  overflow-x: hidden;
}
</style>