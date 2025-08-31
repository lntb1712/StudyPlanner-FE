<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../application/stores/AuthStore';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const router = useRouter();
const errorMessage = ref(''); // Use local ref for better control, fallback to store error

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Vui lòng nhập tên đăng nhập và mật khẩu';
    return;
  }

  errorMessage.value = ''; // Clear previous errors
  try {
    await authStore.login(username.value, password.value);
    if (authStore.isAuthenticated()) { // Added () to call it as a function, assuming it's a method or getter that needs to be invoked
      if (rememberMe.value) {
        localStorage.setItem('username', username.value);
      }
      router.push({ name: 'Home' });
    } else {
      // If authentication fails without error, set a default message
      errorMessage.value = authStore.error || 'Đăng nhập thất bại. Vui lòng thử lại!';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại!';
    // If error is from undefined property, this catch will handle it
  }
};

// Load remembered username
onMounted(() => {
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    username.value = storedUsername;
    rememberMe.value = true;
  }
});
</script>
<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left -->
      <div class="login-left">
        <h1 class="app-title">Study Planner 🎓 </h1>
        <p class="app-desc">Ứng dụng giúp bạn quản lý lịch học một cách khoa học, sắp xếp thời gian hiệu quả và nhắc nhở bài tập thông minh. Nhờ đó, bạn luôn chủ động trong việc học, tránh quên lịch, hoàn thành nhiệm vụ đúng hạn và xây dựng thói quen học tập hiện đại, tiện lợi hơn.</p>
        <img class="illustration" src="../../assets/study_illustration.jpg" alt="Study Illustration" />
      </div>

      <!-- Right -->
      <div class="login-right">
        <div class="login-card">
          <h2>Đăng Nhập</h2>
          <form @submit.prevent="handleLogin">
            <!-- Username -->
            <div class="input-wrapper">
              <input
                v-model="username"
                placeholder="Tên đăng nhập"
                autocomplete="username"
                :class="{ 'input-error': errorMessage }"
                required
              />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                     1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                     0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>

            <!-- Password -->
            <div class="input-wrapper">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 17a2 2 0 1 0 0-4 2 2 0 
                     0 0 0 4zm6-7h-1V7a5 5 0 0 
                     0-10 0v3H6c-1.1 0-2 .9-2 
                     2v8c0 1.1.9 2 2 
                     2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-3 
                     0H9V7a3 3 0 0 1 6 0v3z"
                />
              </svg>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Mật khẩu"
                autocomplete="current-password"
                :class="{ 'input-error': errorMessage }"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>

            <!-- Extras -->
            <div class="extras">
              <label>
                <input type="checkbox" v-model="rememberMe" />
                Ghi nhớ tôi
              </label>
              <a href="/forgot-password">Quên mật khẩu?</a>
            </div>

            <!-- Button -->
            <button type="submit" :disabled="authStore.loading">
              <span v-if="authStore.loading" class="spinner"></span>
              {{ authStore.loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>

            <!-- Error -->
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../../assets/background_login.jpg') no-repeat center center;
  background-size: cover;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Container gom left + right */
.login-container {
  display: flex;
  width: 900px;
  max-width: 95%;
  height: 600px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  animation: fadeIn 0.8s ease;
}

/* Left side */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #89aee6, #4facfe);
  padding: 50px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-left .app-title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  align-content: center;
  align-self: center;
}

.login-left .app-desc {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.5;
  max-width: 350px;
}

.illustration {
  margin-top: 30px;
  width: 100%;
  border-radius: 20px;
  animation: float 4s ease-in-out infinite;
}

/* Right side */
.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* Login card */
.login-card {
  width: 100%;
  text-align: center;
  color: #fff;
}


/* Floating animation for illustration */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}


/* Input wrapper */
.input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 44px; /* chừa 40px cho icon */
  border: none;
  border-radius: 10px;
  outline: none;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.9); /* sáng hơn dễ nhìn */
  color: #333;
  box-sizing: border-box; /* QUAN TRỌNG */
  transition: 0.3s;
}

.input-wrapper svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  fill: #999;
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

/* Extras */
.extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0 20px;
  font-size: 14px;
  color: #ddd;
}

.extras a {
  color: #4facfe;
  text-decoration: none;
}

.extras a:hover {
  text-decoration: underline;
}

/* Button */
button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 242, 254, 0.3);
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

/* Error message */
.error {
  margin-top: 15px;
  font-size: 14px;
  color: #ff6b6b;
}

/* Loading overlay */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Responsive cho tablet và mobile */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column; /* từ ngang → dọc */
    height: auto;
    width: 100%;
    max-width: 600px;
  }

  .login-left {
    padding: 30px 20px;
    text-align: center;
    align-items: center;
  }

  .login-left .app-title {
    font-size: 28px;
  }

  .login-left .app-desc {
    font-size: 14px;
    max-width: 100%;
  }

  .illustration {
    display: none; /* ẩn hình để tiết kiệm không gian */
  }

  .login-right {
    padding: 10px 0px 10px 0px;
    width: 100%;
  }

  .login-card {
    background: rgba(0,0,0,0.4);
    padding: 20px;
    border-radius: 15px;
  }
}

@media (max-width: 576px) {
  .login-left {
    padding: 20px 15px;
  }

  .login-left .app-title {
    font-size: 22px;
    
  }
 

 .login-container {
    flex-direction: column; /* từ ngang → dọc */
    height: auto;
    width: 100%;
    max-width: 400px;
  }

  .login-card{
       max-width: 320px;

  }
  .login-left .app-desc {
    font-size: 12px;
    line-height: 1.4;
  }

  .input-wrapper input {
    font-size: 14px;
    padding: 10px 40px;
  }

  button[type="submit"] {
    font-size: 14px;
    padding: 10px;
  }
}

/* Input error state */
.input-error {
  box-shadow: 0 0 0 2px #ff6b6b !important;
}
</style>