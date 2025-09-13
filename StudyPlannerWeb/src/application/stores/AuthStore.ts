import { defineStore } from "pinia";
import { ref } from "vue";
import { LoginUseCase } from "../usecases/LoginUseCase";
import { LoginRepository } from "../../infrastucture/repositories/LoginRepository/LoginRepository";
import { LoginRequestDTO } from "../../domain/entities/LoginDTO/LoginRequestDTO";
import { AccountManagementRepository } from "../../infrastucture/repositories/AccountManagementRepository/AccountManagementRepository";
import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";

// ---- helper decode jwt ----
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

function decodeJwt(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  } catch (e) {
    console.error("decodeJwt error", e);
    return null;
  }
}

function parsePermissions(raw: any): { id: string; ro: boolean }[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((p) => {
        if (typeof p === "string") {
          try {
            return JSON.parse(p);
          } catch {
            return null;
          }
        }
        if (typeof p === "object") return p;
        return null;
      })
      .filter(Boolean) as { id: string; ro: boolean }[];
  }
  return [];
}

// ---- khởi tạo LoginUseCase ----
const loginUseCase = new LoginUseCase(new LoginRepository());
const accountRepo = new AccountManagementRepository();

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const username = ref<string | null>(localStorage.getItem("username"));
  const fullName = ref<string | null>(null);
  const role = ref<string | null>(null);
  const permissions = ref<{ id: string; ro: boolean }[]>([]);
  const exp = ref<number>(0);
 const userInfo = ref<AccountManagementResponseDTO | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  async function login(usernameInput: string, passwordInput: string) {
    loading.value = true;
    error.value = null;

    const loginRequestDTO = new LoginRequestDTO({
      Username: usernameInput,
      Password: passwordInput,
    });

    try {
      const response = await loginUseCase.execute(loginRequestDTO);

      token.value = response.token;
      username.value = usernameInput;

      // decode payload
      const payload = decodeJwt(response.token);
      if (payload) {
        fullName.value = payload.unique_name || null;
        role.value = payload.role || null;
        permissions.value = parsePermissions(payload.Permission);
        exp.value = Number(payload.exp ?? 0);
      }

      // lưu localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", usernameInput);
      
      await fetchUserInfo();
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "Lỗi không xác định";
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserInfo() {
    if (!username.value) return;
    const res = await accountRepo.getUserInformation(username.value);
    if (res.success && res.data) {
      userInfo.value = res.data;
    }
  }
  function logout() {
    token.value = null;
    username.value = null;
    fullName.value = null;
    role.value = null;
    permissions.value = [];
    exp.value = 0;
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }

  function isAuthenticated() {
    return !!token.value && !isTokenExpired();
  }

  function hasPermission(id: string) {
    return permissions.value.some((p) => p.id === id);
  }

  function isReadOnly(id: string) {
    return permissions.value.find((p) => p.id === id)?.ro ?? false;
  }

  function isTokenExpired() {
    if (!exp.value) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp.value;
  }

  // load lại khi refresh
  function loadFromStorage() {
    const t = localStorage.getItem("token");
    if (t) {
      token.value = t;
      const payload = decodeJwt(t);
      if (payload) {
        username.value = payload.nameid || null;
        fullName.value = payload.unique_name || null;
        role.value = payload.role || null;
        permissions.value = parsePermissions(payload.Permission);
        exp.value = Number(payload.exp ?? 0);
      }
    }
  }

  return {
    // state
    token,
    username,
    fullName,
    role,
    permissions,
    exp,
    error,
    loading,
    userInfo,
    // actions
    login,
    logout,
    isAuthenticated,
    hasPermission,
    isReadOnly,
    isTokenExpired,
    loadFromStorage,
  };
});
