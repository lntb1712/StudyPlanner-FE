import { defineStore } from "pinia";
import { ref } from "vue";
import type { TeacherClassResponseDTO } from "../../domain/entities/TeacherClassDTO/TeacherClassResponseDTO";
import type { TeacherClassRequestDTO } from "../../domain/entities/TeacherClassDTO/TeacherClassRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { TeacherClassUseCase } from "../usecases/TeacherClassUseCase";

export const useTeacherClassStore = defineStore("teacherClassManagement", () => {
  const teacherClasses = ref<TeacherClassResponseDTO[]>([]);
  const totalTeacherClasses = ref<number>(0);
  const selectedTeacherClass = ref<TeacherClassResponseDTO | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const useCase = new TeacherClassUseCase();

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

  // Fetch all teacher classes (paged)
  const fetchTeacherClasses = (classId: string, page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<TeacherClassResponseDTO>>(
      () => useCase.getAllTeacherClasses(classId, page, pageSize),
      (data) => {
        teacherClasses.value = data.data ?? [];
        totalTeacherClasses.value = data.totalItems ?? 0;
      }
    );

  // Fetch single teacher class by IDs
  const fetchTeacherClassByIds = (classId: string, teacherId: string) =>
    handleApiCall<TeacherClassResponseDTO>(
      () => useCase.getTeacherClassWithIds(classId, teacherId),
      (data) => {
        selectedTeacherClass.value = data;
      }
    );

  // CRUD teacher classes
  const addTeacherClass = (teacherClassDto: TeacherClassRequestDTO) =>
    handleApiCall<boolean>(() => useCase.addTeacherClass(teacherClassDto), () => fetchTeacherClasses(teacherClassDto.ClassId));

  const updateTeacherClass = (teacherClassDto: TeacherClassRequestDTO) =>
    handleApiCall<boolean>(() => useCase.updateTeacherClass(teacherClassDto), () => fetchTeacherClasses(teacherClassDto.ClassId));

  const deleteTeacherClass = (classId: string, teacherId: string) =>
    handleApiCall<boolean>(() => useCase.deleteTeacherClass(classId, teacherId), () => fetchTeacherClasses(classId));

  const searchTeacherClasses = (classId: string, textToSearch: string, page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<TeacherClassResponseDTO>>(
      () => useCase.searchTeacherClassesInList(classId, textToSearch, page, pageSize),
      (data) => {
        teacherClasses.value = data.data ?? [];
        totalTeacherClasses.value = data.totalItems ?? 0;
      }
    );

  // Reset state
  const reset = () => {
    teacherClasses.value = [];
    totalTeacherClasses.value = 0;
    selectedTeacherClass.value = null;
    errorMessage.value = null;
    isLoading.value = false;
  };

  return {
    teacherClasses,
    totalTeacherClasses,
    selectedTeacherClass,
    isLoading,
    errorMessage,
    fetchTeacherClasses,
    fetchTeacherClassByIds,
    addTeacherClass,
    updateTeacherClass,
    deleteTeacherClass,
    searchTeacherClasses,
    reset,
  };
});
