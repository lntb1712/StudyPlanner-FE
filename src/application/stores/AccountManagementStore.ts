import { defineStore } from "pinia";
import { ref } from "vue";
import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { AccountManagementRequestDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { AccountManagementUseCase } from "../usecases/AccountManagementUseCase";

export const useAccountManagementStore = defineStore("accountManagement", () => {
    const accounts = ref<AccountManagementResponseDTO[]>([]);
    const totalAccounts = ref<number>(0);
    const selectedAccount = ref<AccountManagementResponseDTO | null>(null);

    const isLoading = ref(false);
    const errorMessage = ref<string | null>(null);

    const useCase = new AccountManagementUseCase();

    async function fetchAccounts(page: number = 1, pageSize: number = 10) {
        try {
            isLoading.value = true;
            errorMessage.value = null;
            const response: PagedResponse<AccountManagementResponseDTO> = await useCase.getAllAccounts(page, pageSize);
            accounts.value = response.data;
            totalAccounts.value = response.totalItems;
        } catch (error: any) {
            errorMessage.value = error.message || "Không thể tải danh sách tài khoản";
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchTotalAccounts() {
        try {
            totalAccounts.value = await useCase.getTotalAccounts();
        } catch (error: any) {
            errorMessage.value = error.message || "Không thể lấy tổng số tài khoản";
        }
    }

    async function fetchUserInformation(username: string) {
        try {
            selectedAccount.value = await useCase.getUserInformation(username);
        } catch (error: any) {
            errorMessage.value = error.message || "Không thể lấy thông tin người dùng";
        }
    }

    async function addAccount(account: AccountManagementRequestDTO) {
        try {
            await useCase.addAccount(account);
            await fetchAccounts(); // refresh danh sách
        } catch (error: any) {
            errorMessage.value = error.message || "Thêm tài khoản thất bại";
        }
    }

    async function updateAccount(account: AccountManagementRequestDTO) {
        try {
            await useCase.updateAccount(account);
            await fetchAccounts();
        } catch (error: any) {
            errorMessage.value = error.message || "Cập nhật tài khoản thất bại";
        }
    }

    async function deleteAccount(username: string) {
        try {
            await useCase.deleteAccount(username);
            await fetchAccounts();
        } catch (error: any) {
            errorMessage.value = error.message || "Xóa tài khoản thất bại";
        }
    }

    async function searchAccounts(textToSearch: string, page: number = 1, pageSize: number = 10) {
        try {
            isLoading.value = true;
            const response = await useCase.searchAccountByText(textToSearch, page, pageSize);
            accounts.value = response.data;
            totalAccounts.value = response.totalItems;
        } catch (error: any) {
            errorMessage.value = error.message || "Không tìm thấy tài khoản";
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
