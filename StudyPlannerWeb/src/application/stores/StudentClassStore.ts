import { defineStore } from "pinia";
import { ref } from "vue";
import type { StudentClassResponseDTO } from "../../domain/entities/StudentClassDTO/StudentClassResponseDTO";
import type { StudentClassRequestDTO } from "../../domain/entities/StudentClassDTO/StudentClassRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { StudentClassUseCase } from "../usecases/StudentClassUseCase";

export const useStudentClassStore = defineStore("studentClassManagement", () => {
  const studentClasses = ref<StudentClassResponseDTO[]>([]);
  const totalStudentClasses = ref<number>(0);
  const selectedStudentClass = ref<StudentClassResponseDTO | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const useCase = new StudentClassUseCase();

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

  // Fetch all student classes (paged)
  const fetchStudentClasses = (classId: string, page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<StudentClassResponseDTO>>(
      () => useCase.getAllStudentClasses(classId, page, pageSize),
      (data) => {
        studentClasses.value = data.data ?? [];
        totalStudentClasses.value = data.totalItems ?? 0;
      }
    );

  // Fetch single student class by IDs
  const fetchStudentClassByIds = (classId: string, studentId: string) =>
    handleApiCall<StudentClassResponseDTO>(
      () => useCase.getStudentClassWithIds(classId, studentId),
      (data) => {
        selectedStudentClass.value = data;
      }
    );

  // CRUD student classes
  const addStudentClass = (studentClassDto: StudentClassRequestDTO) =>
    handleApiCall<boolean>(() => useCase.addStudentClass(studentClassDto), () => fetchStudentClasses(studentClassDto.ClassId));

  const updateStudentClass = (studentClassDto: StudentClassRequestDTO) =>
    handleApiCall<boolean>(() => useCase.updateStudentClass(studentClassDto), () => fetchStudentClasses(studentClassDto.ClassId));

  const deleteStudentClass = (classId: string, studentId: string) =>
    handleApiCall<boolean>(() => useCase.deleteStudentClass(classId, studentId), () => fetchStudentClasses(classId));

  const searchStudentClasses = (classId: string, textToSearch: string, page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<StudentClassResponseDTO>>(
      () => useCase.searchStudentClassesInList(classId, textToSearch, page, pageSize),
      (data) => {
        studentClasses.value = data.data ?? [];
        totalStudentClasses.value = data.totalItems ?? 0;
      }
    );

  // Reset state
  const reset = () => {
    studentClasses.value = [];
    totalStudentClasses.value = 0;
    selectedStudentClass.value = null;
    errorMessage.value = null;
    isLoading.value = false;
  };

  return {
    studentClasses,
    totalStudentClasses,
    selectedStudentClass,
    isLoading,
    errorMessage,
    fetchStudentClasses,
    fetchStudentClassByIds,
    addStudentClass,
    updateStudentClass,
    deleteStudentClass,
    searchStudentClasses,
    reset,
  };
});
