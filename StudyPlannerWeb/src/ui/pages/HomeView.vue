<script setup lang="ts">
import { useAuthStore } from "../../application/stores/AuthStore";
import { useRouter, useRoute } from "vue-router";
import { Home, Users, Menu, Shield, BookOpen } from "lucide-vue-next";
import { ref, computed } from "vue";

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

// Config tất cả menu (chưa filter)
const navItems = [
  { name: "Dashboard", path: "/home/dashboard", icon: Home },
  { name: "Quản lý tài khoản", path: "/home/account-management", icon: Users, perm: "ucAccountManagement" },
  { name: "Quản lý vai trò", path: "/home/group-management", icon: Shield, perm: "ucGroupManagement" },
   { name: "Quản lý lớp học", path: "/home/class-management", icon: BookOpen, perm: "ucClassManagement" }, // Added ClassManagement
];

// Chỉ lấy menu mà user có quyền
const filteredNavItems = computed(() => {
  return navItems.filter(item => {
    if (!item.perm) return true; // menu public (Dashboard)
    return auth.hasPermission(item.perm); // check quyền
  });
});

const isProfileMenuOpen = ref(false);



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
          class="px-3 py-2 rounded-lg hover:bg-indigo-50 focus:outline-none transition-colors">
          <Menu class="w-6 h-6 text-indigo-700" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-2">
        <router-link v-for="item in filteredNavItems" :key="item.path" :to="item.path"
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


    </aside>

    <!-- Overlay khi mobile mở sidebar -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden" @click="toggleSidebar"></div>

    <!-- Main Content -->
    <main class="flex flex-col flex-1 p-4 md:p-6 overflow-auto">
      <!-- Header -->
      <header class="mb-6 flex items-center justify-between">
        <!-- Bên trái: toggle + ngày tháng -->
        <div class="flex items-center gap-3">
          <button @click="toggleSidebar" class="md:hidden p-2 rounded-lg hover:bg-indigo-50 transition">
            <Menu class="w-6 h-6 text-indigo-700" />
          </button>
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
        </div>

        <!-- Bên phải: avatar + username + dropdown -->
        <div class="relative" @click="isProfileMenuOpen = !isProfileMenuOpen">
          <div
            class="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-full hover:bg-gray-100 transition">
            <img
              :src="`https://ui-avatars.com/api/?name=${auth.userInfo?.FullName || 'User'}&background=6366F1&color=fff`"
              alt="avatar" class="w-9 h-9 rounded-full shadow-sm" />
            <span class="hidden sm:inline font-medium text-gray-800">
              {{ auth.userInfo?.FullName || auth.username || "User" }}
            </span>
          </div>


          <!-- Dropdown -->
          <div v-if="isProfileMenuOpen"
            class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 transform transition-all duration-200 ease-out origin-top-right scale-100 opacity-100"
            @click.away="isProfileMenuOpen = false">
            <!-- User Info Section -->
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center space-x-3">
                <!-- User Icon (thay vì avatar) -->
                <div class="relative flex-shrink-0">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <!-- User Details -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">
                    {{ auth.userInfo?.FullName }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">{{ auth.userInfo?.Email }}</p>
                  <!-- Phần Vai trò với SVG mới (badge-check) -->
                  <p class="text-xs text-gray-500 flex items-center mt-1">
                    <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vai trò: {{ auth.userInfo?.GroupName }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-100"></div>

            <!-- Logout Button -->
            <button @click="handleLogout"
              class="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 rounded-bl-2xl rounded-br-2xl">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>


      <!-- Content Area -->
      <div class="bg-white shadow-lg rounded-2xl p-6 min-h-[85vh] border border-gray-100 transition hover:shadow-xl">
        <router-view />
      </div>
    </main>
  </div>
</template>
