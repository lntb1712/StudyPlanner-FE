<script setup lang="ts">
import { useAuthStore } from "../../application/stores/AuthStore";
import { useRouter, useRoute } from "vue-router";
import { Home, Users, LogOut, Menu } from "lucide-vue-next";
import { ref } from "vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref<boolean>(false);

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
  { name: "Dashboard", path: "/home/dashboard", icon: Home },
  { name: "Quản lý tài khoản", path: "/home/account-management", icon: Users },
];
</script>

<template>
  <div class="flex h-screen bg-gradient-to-br from-indigo-50 to-gray-100 font-sans text-sm">
    <!-- Sidebar -->
    <aside :class="[
      'fixed md:static inset-y-0 left-0 z-30 flex flex-col bg-white shadow-xl border-r border-gray-100 transform transition-transform duration-300',
      isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-20'
    ]">
      <!-- Logo + Toggle -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <div v-if="isSidebarOpen" class="flex items-center gap-3 text-2xl font-extrabold text-indigo-700">
          <img src="../../assets/logo.png" alt="Study Planner Logo" class="w-10 h-10" />
          <span class="tracking-tight">Study Planner</span>
        </div>
        <button @click="toggleSidebar"
          class="px-3 py-2 rounded-lg hover:bg-indigo-50 focus:outline-none transition-colors ">
          <Menu class="w-6 h-6 text-indigo-700" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-2">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200" :class="isActive(item.path)
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-900'">
          <component :is="item.icon" class="w-6 h-6 flex-shrink-0"
            :class="isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'" />
          <span class="truncate" :class="{
            'hidden md:inline': !isSidebarOpen,
            'inline': isSidebarOpen
          }">
            {{ item.name }}
          </span>

        </router-link>
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-gray-100">
        <button @click="handleLogout"
          class="flex items-center gap-4 w-full px-4 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-md transition-all">
          <LogOut class="w-6 h-6" />
          <span v-if="isSidebarOpen">
  Đăng xuất
</span>


        </button>
      </div>
    </aside>

    <!-- Overlay khi mobile mở sidebar -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden" @click="toggleSidebar"></div>

    <!-- Main Content -->
    <main class="flex flex-col flex-1 p-4 md:p-6 overflow-auto">
      <!-- Header -->
      <header class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Toggle button mobile -->
          <button @click="toggleSidebar" class="md:hidden p-2 rounded-lg hover:bg-indigo-50 transition">
            <Menu class="w-6 h-6 text-indigo-700" />
          </button>
          <img src="https://ui-avatars.com/api/?name=User&background=6366F1&color=fff" alt="avatar"
            class="w-10 h-10 rounded-full shadow-sm" />
          <div class="text-xl font-bold text-gray-900">
            Xin chào, <span class="text-indigo-700">{{ auth.username || "User" }}</span> 👋
          </div>
        </div>
        <div class="hidden sm:block text-sm text-gray-500">
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
      <div class="bg-white shadow-lg rounded-2xl p-6 min-h-[85vh] border border-gray-100 transition hover:shadow-xl">
        <router-view />
      </div>
    </main>
  </div>
</template>
