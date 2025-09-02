<script setup lang="ts">
import { useAuthStore } from "../../application/stores/AuthStore";
import { useRouter, useRoute } from "vue-router";
import { Home, Users, LogOut } from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const handleLogout = () => {
  auth.logout();
  router.push({ name: "Login" });
};

// Kiểm tra route active
const isActive = (path: string) => route.path.startsWith(path);
</script>

<template>
  <div class="flex h-screen bg-zinc-100 text-sm"> <!-- font-sm cho toàn layout -->
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-xl flex flex-col">
      <!-- Logo -->
      <div class="p-4 text-xl font-bold text-blue-600 border-b border-zinc-200">
        📚 Study Planner
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-1">
        <router-link
          to="/home/dashboard"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium',
            isActive('/home/dashboard')
              ? 'bg-blue-500 text-white shadow'
              : 'text-zinc-700 hover:bg-blue-100'
          ]"
        >
          <Home class="w-4 h-4" />
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/home/account-management"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium',
            isActive('/home/account-management')
              ? 'bg-blue-500 text-white shadow'
              : 'text-zinc-700 hover:bg-blue-100'
          ]"
        >
          <Users class="w-4 h-4" />
          <span>Quản lý tài khoản</span>
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-zinc-200">
        <button
          @click="handleLogout"
          class="flex items-center justify-center gap-2 w-full px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut class="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 p-6 overflow-auto">
      <div class="mb-4 text-lg font-semibold text-zinc-700">
        Xin chào, <span class="text-blue-600">{{ auth.username || "User" }}</span> 👋
      </div>

      <div class="bg-white shadow-lg rounded-xl p-4 min-h-[80vh] border border-zinc-200">
        <router-view />
      </div>
    </main>
  </div>
</template>
