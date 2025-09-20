import { defineStore } from "pinia";
import { ref } from "vue";
import type { ClassResponseDTO } from "../../domain/entities/ClassDTO/ClassResponseDTO";
import type { ClassRequestDTO } from "../../domain/entities/ClassDTO/ClassRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { ClassUseCase } from "../usecases/ClassUseCase";

export const useClassStore = defineStore("classManagement", () => {
  const classes = ref<ClassResponseDTO[]>([]);
  const totalClasses = ref<number>(0);
  const selectedClass = ref<ClassResponseDTO | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const useCase = new ClassUseCase();

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

  // Fetch all classes (paged)
  const fetchClasses = (page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<ClassResponseDTO>>(
      () => useCase.getAllClasses(page, pageSize),
      (data) => {
        classes.value = data.data ?? [];
        totalClasses.value = data.totalItems ?? 0;
      }
    );

  // Fetch single class by ID
  const fetchClassById = (classId: string) =>
    handleApiCall<ClassResponseDTO>(
      () => useCase.getClassWithClassId(classId),
      (data) => {
        selectedClass.value = data;
      }
    );

  // CRUD classes
  const addClass = (classDto: ClassRequestDTO) =>
    handleApiCall<boolean>(() => useCase.addClass(classDto), () => fetchClasses());

  const updateClass = (classDto: ClassRequestDTO) =>
    handleApiCall<boolean>(() => useCase.updateClass(classDto), () => fetchClasses());

  const deleteClass = (classId: string) =>
    handleApiCall<boolean>(() => useCase.deleteClass(classId), () => fetchClasses());

  const searchClasses = (textToSearch: string, page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<ClassResponseDTO>>(
      () => useCase.searchClassesInList(textToSearch, page, pageSize),
      (data) => {
        classes.value = data.data ?? [];
        totalClasses.value = data.totalItems ?? 0;
      }
    );

  // Reset state
  const reset = () => {
    classes.value = [];
    totalClasses.value = 0;
    selectedClass.value = null;
    errorMessage.value = null;
    isLoading.value = false;
  };

  return {
    classes,
    totalClasses,
    selectedClass,
    isLoading,
    errorMessage,
    fetchClasses,
    fetchClassById,
    addClass,
    updateClass,
    deleteClass,
    searchClasses,
    reset,
  };
});