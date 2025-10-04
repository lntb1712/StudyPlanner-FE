import { defineStore } from "pinia";
import { ref } from "vue";
import type { DashboardDTO } from "../../domain/entities/DashboardDTO/DashboardDTO";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { DashboardUseCase } from "../usecases/DashboardUseCase";

export const useDashboardStore = defineStore("dashboard", () => {
  const dashboard = ref<DashboardDTO | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const useCase = new DashboardUseCase();

  // Generic API handler
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
      errorMessage.value = error instanceof Error ? error.message : "Unknown error";
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = () =>
    handleApiCall<DashboardDTO>(
      () => useCase.getDashboardData(),
      (data) => {
        dashboard.value = data;
      }
    );

  // Reset state
  const reset = () => {
    dashboard.value = null;
    errorMessage.value = null;
    isLoading.value = false;
  };

  return {
    dashboard,
    isLoading,
    errorMessage,
    fetchDashboardData,
    reset,
  };
});