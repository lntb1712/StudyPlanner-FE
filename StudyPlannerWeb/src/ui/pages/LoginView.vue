<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../application/stores/AuthStore';
import bgLogin from '../../assets/background_login.jpg';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const router = useRouter();
const errorMessage = ref('');

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Vui lòng nhập tên đăng nhập và mật khẩu';
    return;
  }

  errorMessage.value = '';
  try {
    await authStore.login(username.value, password.value);
    if (authStore.isAuthenticated()) {
      if (rememberMe.value) localStorage.setItem('username', username.value);
      router.push({ name: 'Home' });
    } else {
      errorMessage.value = authStore.error || 'Đăng nhập thất bại.';
    }
  } catch (error) {
    errorMessage.value = 'Đã xảy ra lỗi trong quá trình đăng nhập.';
  }
};

onMounted(() => {
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    username.value = storedUsername;
    rememberMe.value = true;
  }
});
</script>

<template>
<div 
  class="min-h-screen flex items-center justify-center bg-cover bg-center" 
  :style="{ backgroundImage: `url(${bgLogin})` }"
>

    <div class="flex flex-col md:flex-row w-full max-w-5xl bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
      
      <!-- Left -->
      <div class="flex-1 flex flex-col justify-center p-12 md:p-16 bg-gradient-to-br from-blue-300 to-blue-500 text-white">
        <h1 class="text-4xl md:text-5xl font-bold text-center md:text-left mb-4">Study Planner 🎓</h1>
        <p class="text-sm md:text-base opacity-90 max-w-md text-center md:text-left">
          Ứng dụng giúp bạn quản lý lịch học một cách khoa học, sắp xếp thời gian hiệu quả và nhắc nhở bài tập thông minh. Chủ động trong việc học, tránh quên lịch, hoàn thành nhiệm vụ đúng hạn.
        </p>
        <img src="../../assets/study_illustration.jpg" alt="Study Illustration" class="mt-8 rounded-xl animate-bounce-slow hidden md:block"/>
      </div>

      <!-- Right -->
      <div class="flex-1 flex justify-center items-center p-8 md:p-12">
        <div class="w-full max-w-md bg-black/40 p-8 rounded-xl text-white">
          <h2 class="text-2xl font-semibold mb-6 text-center">Đăng Nhập</h2>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Username -->
            <div class="relative">
              <input 
                v-model="username"
                placeholder="Tên đăng nhập"
                autocomplete="username"
                :class="errorMessage ? 'ring-2 ring-red-500' : ''"
                required
                class="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            <!-- Password -->
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Mật khẩu"
                autocomplete="current-password"
                :class="errorMessage ? 'ring-2 ring-red-500' : ''"
                required
                class="w-full pl-10 pr-10 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V7a5 5 0 0 0-10 0v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-3 0H9V7a3 3 0 0 1 6 0v3z"/>
              </svg>
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>

            <!-- Extras -->
            <div class="flex justify-between text-sm text-gray-200">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="rememberMe" class="accent-blue-400"/>
                Ghi nhớ tôi
              </label>
              <a href="/forgot-password" class="text-blue-300 hover:underline">Quên mật khẩu?</a>
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="authStore.loading" class="w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg font-semibold text-white hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              <span v-if="authStore.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ authStore.loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>

            <!-- Error -->
            <p v-if="errorMessage" class="text-red-500 text-sm mt-2 text-center">{{ errorMessage }}</p>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
/* Animation cho illustration */
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}
</style>
