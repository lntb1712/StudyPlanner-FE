import { defineStore } from "pinia";
import { ref } from "vue";
import type { GroupManagementResponseDTO } from "../../domain/entities/GroupManagementDTO/GroupManagementResponseDTO";
import type { GroupManagementRequestDTO } from "../../domain/entities/GroupManagementDTO/GroupManagementRequestDTO";
import type { FunctionResponseDTO } from "../../domain/entities/FunctionDTO/FunctionResponseDTO";
import type { GroupFunctionResponseDTO } from "../../domain/entities/GroupFunctionDTO/GroupFunctionResponseDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { GroupManagementUseCase } from "../usecases/GroupManagementUseCase";

export const useGroupManagementStore = defineStore("groupManagement", () => {
  const groups = ref<GroupManagementResponseDTO[]>([]);
  const totalGroups = ref<number>(0);
  const totalUsersInGroups = ref<number>(0);
  const selectedGroup = ref<GroupManagementResponseDTO | null>(null);
  const functions = ref<FunctionResponseDTO[]>([]);
  const groupFunctions = ref<GroupFunctionResponseDTO[]>([]);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const useCase = new GroupManagementUseCase();

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

  // Fetch all groups (paged)
  const fetchGroups = (page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<GroupManagementResponseDTO>>(
      () => useCase.getAllGroupManagement(page, pageSize),
      (data) => {
        groups.value = data.data ?? [];
        totalGroups.value = data.totalItems ?? 0;
      }
    );

  // Fetch all functions
  const fetchFunctions = () =>
    handleApiCall<FunctionResponseDTO[]>(
      () => useCase.getAllFunctions(),
      (data) => {
        functions.value = data ?? [];
      }
    );

  // Fetch group functions

  const fetchGroupFunctions = (groupId: string) =>
    handleApiCall<GroupFunctionResponseDTO[]>(
      () => useCase.getGroupFunctionWithGroupID(groupId),
      async (data) => {
        if (data && data.length > 0) {
          // ✅ Nhóm đã có quyền → hiển thị đúng danh sách
          groupFunctions.value = data;
        } else {
          // ❌ Nhóm chưa có quyền → load toàn bộ function để gán
          await fetchFunctions();
          groupFunctions.value = functions.value.map((f) => ({
            FunctionId: f.FunctionId,
            FunctionName: f.FunctionName,
            GroupId: groupId,
            IsEnable: false,
            IsReadOnly: false,
          }));
        }
      }
    );

  // Fetch single group by ID
  const fetchGroupById = (groupId: string) =>
    handleApiCall<GroupManagementResponseDTO>(
      () => useCase.getGroupManagementWithGroupId(groupId),
      (data) => {
        selectedGroup.value = data;
      }
    );

  // CRUD groups
  const addGroup = (group: GroupManagementRequestDTO) =>
    handleApiCall<boolean>(() => useCase.addGroupManagement(group), () => fetchGroups());

  const updateGroup = (group: GroupManagementRequestDTO) =>
    handleApiCall<boolean>(() => useCase.updateGroupManagement(group), () => fetchGroups());

  const deleteGroup = (groupId: string) =>
    handleApiCall<boolean>(() => useCase.deleteGroupManagement(groupId), () => fetchGroups());

  const searchGroups = (textToSearch: string, page = 1, pageSize = 10) =>
    handleApiCall<PagedResponse<GroupManagementResponseDTO>>(
      () => useCase.searchGroupInList(textToSearch, page, pageSize),
      (data) => {
        groups.value = data.data ?? [];
        totalGroups.value = data.totalItems ?? 0;
      }
    );

  // Other APIs
  const fetchTotalUsersInGroups = () =>
    handleApiCall<number>(() => useCase.getTotalUserInGroup(), (data) => {
      totalUsersInGroups.value = data ?? 0;
    });

  const fetchTotalGroupCount = () =>
    handleApiCall<number>(() => useCase.getTotalGroupCount(), (data) => {
      totalGroups.value = data ?? 0;
    });

  // Reset state
  const reset = () => {
    groups.value = [];
    totalGroups.value = 0;
    totalUsersInGroups.value = 0;
    selectedGroup.value = null;
    functions.value = [];
    groupFunctions.value = [];
    errorMessage.value = null;
    isLoading.value = false;
  };

  return {
    groups,
    totalGroups,
    totalUsersInGroups,
    selectedGroup,
    functions,
    groupFunctions,
    isLoading,
    errorMessage,
    fetchGroups,
    fetchFunctions,
    fetchGroupFunctions,
    fetchGroupById,
    addGroup,
    updateGroup,
    deleteGroup,
    searchGroups,
    fetchTotalUsersInGroups,
    fetchTotalGroupCount,
    reset,
  };
});
