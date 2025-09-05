import { defineStore } from "pinia";
import { ref } from "vue";
import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { AccountManagementRequestDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { AccountManagementUseCase } from "../usecases/AccountManagementUseCase";

export const useAccountManagementStore = defineStore("accountManagement", () => {
  const accounts = ref<AccountManagementResponseDTO[]>([]);
  const totalAccounts = ref<number>(0);
  const selectedAccount = ref<AccountManagementResponseDTO | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const useCase = new AccountManagementUseCase();

  // Generic helper to handle API calls with ApiResponse
 const handleApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  onSuccess?: (data: T) => void
) => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const response = await apiCall();
    if (response.isSuccess() && response.data != null) {
      onSuccess?.(response.data);
    } else {
      errorMessage.value = response.message || "No data returned from the server";
    }
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unknown error";
  } finally {
    isLoading.value = false;
  }
};

  // Fetch all accounts with pagination
  const fetchAccounts = (page = 1, pageSize = 10) =>
  handleApiCall<PagedResponse<AccountManagementResponseDTO>>(
    () => useCase.getAllAccounts(page, pageSize),
    (data) => {
      accounts.value = data.data ?? [];
      totalAccounts.value = data.totalItems ?? 0;
    }
  );
  // Fetch total number of accounts
  const fetchTotalAccounts = () =>
    handleApiCall<number>(() => useCase.getTotalAccounts(), (data) => {
      totalAccounts.value = data ?? 0;
    });

  // Fetch user information by username
  const fetchUserInformation = (username: string) =>
    handleApiCall<AccountManagementResponseDTO>(
      () => useCase.getUserInformation(username),
      (data) => {
        selectedAccount.value = data;
      }
    );

  // Add a new account
  const addAccount = (account: AccountManagementRequestDTO) =>
    handleApiCall<boolean>(() => useCase.addAccount(account), () =>
      fetchAccounts()
    );

  // Update an existing account
  const updateAccount = (account: AccountManagementRequestDTO) =>
    handleApiCall<boolean>(() => useCase.updateAccount(account), () =>
      fetchAccounts()
    );

  // Delete an account by username
  const deleteAccount = (username: string) =>
    handleApiCall<boolean>(() => useCase.deleteAccount(username), () =>
      fetchAccounts()
    );

  // Search accounts by text with pagination
  const searchAccounts = (textToSearch: string, page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<AccountManagementResponseDTO>>(
      () => useCase.searchAccountByText(textToSearch, page, pageSize),
      (data) => {
        accounts.value = data.data ?? [];
        totalAccounts.value = data.totalItems ?? 0;
      }
    );

  // Reset store state
  const reset = () => {
    accounts.value = [];
    totalAccounts.value = 0;
    selectedAccount.value = null;
    errorMessage.value = null;
    isLoading.value = false;
  };

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
    reset,
  };
});