import type { GroupManagementRequestDTO } from "../../../domain/entities/GroupManagementDTO/GroupManagementRequestDTO";
import type { GroupManagementResponseDTO } from "../../../domain/entities/GroupManagementDTO/GroupManagementResponseDTO";
import type { FunctionResponseDTO } from "../../../domain/entities/FunctionDTO/FunctionResponseDTO";
import type { GroupFunctionResponseDTO } from "../../../domain/entities/GroupFunctionDTO/GroupFunctionResponseDTO";
import type { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export interface IGroupManagementRepository {
  addGroupManagement(group: GroupManagementRequestDTO): Promise<ApiResponse<boolean>>;
  getAllGroupManagement(page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<GroupManagementResponseDTO>>>;
  getAllFunctions(): Promise<ApiResponse<FunctionResponseDTO[]>>;
  getGroupFunctionWithGroupID(groupId: string): Promise<ApiResponse<GroupFunctionResponseDTO[]>>;
  deleteGroupManagement(groupId: string): Promise<ApiResponse<boolean>>;
  updateGroupManagement(group: GroupManagementRequestDTO): Promise<ApiResponse<boolean>>;
  searchGroupInList(textToSearch: string, page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<GroupManagementResponseDTO>>>;
  getGroupManagementWithGroupId(groupId: string): Promise<ApiResponse<GroupManagementResponseDTO>>;
  getTotalUserInGroup(): Promise<ApiResponse<number>>;
  getTotalGroupCount(): Promise<ApiResponse<number>>;
}
