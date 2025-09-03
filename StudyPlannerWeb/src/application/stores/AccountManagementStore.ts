import { defineStore } from "pinia";
import { ref } from "vue";
import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { AccountManagementRequestDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import type { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { AccountManagementUseCase } from "../usecases/AccountManagementUseCase";

export const useAccountManagementStore = defineStore("accountManagement", () => {
  const accounts = ref<AccountManagementResponseDTO[]>([]);
  const totalAccounts = ref<number>(0);
  const selectedAccount = ref<AccountManagementResponseDTO | null>(null);
  const isLoading = ref<boolean>(false);
  const errorMessage = ref<string | null>(null);

  const useCase = new AccountManagementUseCase();

  async function fetchAccounts(page: number = 1, pageSize: number = 10) {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response: ApiResponse<PagedResponse<AccountManagementResponseDTO>> = await useCase.getAllAccounts(page, pageSize);
      
      if (response.isSuccess() && response.data) {
        accounts.value = response.data.Data || [];
        totalAccounts.value = response.data.TotalItems || 0;
      } else {
        errorMessage.value = response.message || "Không thể tải danh sách tài khoản";
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Lỗi không xác định khi tải danh sách tài khoản";
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTotalAccounts() {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response: ApiResponse<number> = await useCase.getTotalAccounts();
      
      if (response.isSuccess() && response.data !== null) {
        totalAccounts.value = response.data;
      } else {
        errorMessage.value = response.message || "Không thể lấy tổng số tài khoản";
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Lỗi không xác định khi lấy tổng số tài khoản";
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserInformation(username: string) {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response: ApiResponse<AccountManagementResponseDTO> = await useCase.getUserInformation(username);
      
      if (response.isSuccess() && response.data) {
        selectedAccount.value = response.data;
      } else {
        errorMessage.value = response.message || "Không thể lấy thông tin người dùng";
        selectedAccount.value = null;
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Lỗi không xác định khi lấy thông tin người dùng";
      selectedAccount.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function addAccount(account: AccountManagementRequestDTO) {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response: ApiResponse<boolean> = await useCase.addAccount(account);
      
      if (response.isSuccess()) {
        await fetchAccounts(); // Refresh the account list
      } else {
        errorMessage.value = response.message || "Thêm tài khoản thất bại";
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Lỗi không xác định khi thêm tài khoản";
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAccount(account: AccountManagementRequestDTO) {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response: ApiResponse<boolean> = await useCase.updateAccount(account);
      
      if (response.isSuccess()) {
        await fetchAccounts(); // Refresh the account list
      } else {
        errorMessage.value = response.message || "Cập nhật tài khoản thất bại";
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Lỗi không xác định khi cập nhật tài khoản";
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAccount(username: string) {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response: ApiResponse<boolean> = await useCase.deleteAccount(username);
      
      if (response.isSuccess()) {
        await fetchAccounts(); // Refresh the account list
      } else {
        errorMessage.value = response.message || "Xóa tài khoản thất bại";
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Lỗi không xác định khi xóa tài khoản";
    } finally {
      isLoading.value = false;
    }
  }

  async function searchAccounts(textToSearch: string, page: number = 1, pageSize: number = 10) {
    try {
      isLoading.value = true;
      errorMessage.value = null;
      const response: ApiResponse<PagedResponse<AccountManagementResponseDTO>> = await useCase.searchAccountByText(textToSearch, page, pageSize);
      
      if (response.isSuccess() && response.data) {
        accounts.value = response.data.Data || [];
        totalAccounts.value = response.data.TotalItems || 0;
      } else {
        errorMessage.value = response.message || "Không tìm thấy tài khoản";
        accounts.value = [];
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Lỗi không xác định khi tìm kiếm tài khoản";
      accounts.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    accounts,
    totalAccounts,
    selectedAccount,
    isLoading,
    errorMessage,
    fetchAccounts,
    fetchTotalAccounts,
    fetchUserInformation,
    addAccount,
    updateAccount,
    deleteAccount,
    searchAccounts,
  };
});