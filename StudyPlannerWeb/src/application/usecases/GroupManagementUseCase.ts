import type { GroupManagementRequestDTO } from "../../domain/entities/GroupManagementDTO/GroupManagementRequestDTO";
import type { GroupManagementResponseDTO } from "../../domain/entities/GroupManagementDTO/GroupManagementResponseDTO";
import type { FunctionResponseDTO } from "../../domain/entities/FunctionDTO/FunctionResponseDTO";
import type { GroupFunctionResponseDTO } from "../../domain/entities/GroupFunctionDTO/GroupFunctionResponseDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { GroupManagementRepository } from "../../infrastucture/repositories/GroupManagementRepository/GroupManagementRepository";

export class GroupManagementUseCase {
  private repository: GroupManagementRepository;

  constructor(repository: GroupManagementRepository = new GroupManagementRepository()) {
    this.repository = repository;
  }

  async addGroupManagement(group: GroupManagementRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.addGroupManagement(group);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to add group");
    }
  }

  async getAllGroupManagement(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<GroupManagementResponseDTO>>> {
    try {
      return await this.repository.getAllGroupManagement(page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch groups");
    }
  }

  async getAllFunctions(): Promise<ApiResponse<FunctionResponseDTO[]>> {
    try {
      return await this.repository.getAllFunctions();
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch functions");
    }
  }

  async getGroupFunctionWithGroupID(groupId: string): Promise<ApiResponse<GroupFunctionResponseDTO[]>> {
    try {
      return await this.repository.getGroupFunctionWithGroupID(groupId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch group functions");
    }
  }

  async deleteGroupManagement(groupId: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.deleteGroupManagement(groupId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to delete group");
    }
  }

  async updateGroupManagement(group: GroupManagementRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.updateGroupManagement(group);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to update group");
    }
  }

  async searchGroupInList(textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<GroupManagementResponseDTO>>> {
    try {
      return await this.repository.searchGroupInList(textToSearch, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to search groups");
    }
  }

  async getGroupManagementWithGroupId(groupId: string): Promise<ApiResponse<GroupManagementResponseDTO>> {
    try {
      return await this.repository.getGroupManagementWithGroupId(groupId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch group details");
    }
  }

  async getTotalUserInGroup(): Promise<ApiResponse<number>> {
    try {
      return await this.repository.getTotalUserInGroup();
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch total users in group");
    }
  }

  async getTotalGroupCount(): Promise<ApiResponse<number>> {
    try {
      return await this.repository.getTotalGroupCount();
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch total group count");
    }
  }
}
