import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LoginUseCase } from '../usecases/LoginUseCase';
import { LoginRepository } from '../../infrastucture/repositories/LoginRepository/LoginRepository';
import { LoginRequestDTO } from '../../domain/entities/LoginDTO/LoginRequestDTO';

// Khởi tạo LoginUseCase
const loginUseCase = new LoginUseCase(new LoginRepository());

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const username = ref<string | null>(localStorage.getItem('username'));
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  async function login(usernameInput: string, passwordInput: string) {
    loading.value = true;
    error.value = null;

    const loginRequestDTO = new LoginRequestDTO({ Username: usernameInput, Password: passwordInput });

    try {
      const response = await loginUseCase.execute(loginRequestDTO);
      token.value = response.token;
      username.value = usernameInput;
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', usernameInput);
    } catch (err: unknown) {
      // Xử lý lỗi với kiểu unknown thay vì any
      error.value = err instanceof Error ? err.message : 'Lỗi không xác định';
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    username.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  function isAuthenticated() {
    return !!token.value;
  }

  return {
    token,
    username,
    error,
    loading,
    login,
    logout,
    isAuthenticated,
  };
});