import { http } from "../../api/http";
import type { IGroupManagementRepository } from "./IGroupManagementRepository";
import type { GroupManagementRequestDTO } from "../../../domain/entities/GroupManagementDTO/GroupManagementRequestDTO";
import { GroupManagementResponseDTO } from "../../../domain/entities/GroupManagementDTO/GroupManagementResponseDTO";
import { FunctionResponseDTO } from "../../../domain/entities/FunctionDTO/FunctionResponseDTO";
import { GroupFunctionResponseDTO } from "../../../domain/entities/GroupFunctionDTO/GroupFunctionResponseDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export class GroupManagementRepository implements IGroupManagementRepository {
  private setAuthorizationHeader(): void {
    const token = localStorage.getItem("token");
    if (token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  async addGroupManagement(group: GroupManagementRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.post("/GroupManagement/AddGroupManagement", group);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("addGroupManagement error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getAllGroupManagement(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<GroupManagementResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/GroupManagement/GetAllGroupManagement", { params: { page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<GroupManagementResponseDTO>>(
        res,
        (json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(GroupManagementResponseDTO.fromJson)
            };
          }
          return json;
        }
      );
    } catch (error: any) {
      console.error("getAllGroupManagement error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getAllFunctions(): Promise<ApiResponse<FunctionResponseDTO[]>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/GroupManagement/GetAllFunctions");
      return ApiResponse.fromJson<FunctionResponseDTO[]>(res,(json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(FunctionResponseDTO.fromJson)
            };
          }
          return json;
        });
    } catch (error: any) {
      console.error("getAllFunctions error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getGroupFunctionWithGroupID(groupId: string): Promise<ApiResponse<GroupFunctionResponseDTO[]>> {
  try {
    this.setAuthorizationHeader();

    // Call API with groupId as query param
    const res = await http.get("/GroupManagement/GetGroupFunctionWithGroupID", { 
      params: { groupId } 
    });

    // Parse response into ApiResponse<GroupFunctionResponseDTO[]>
    return ApiResponse.fromJson<GroupFunctionResponseDTO[]>(res, (json: any) => {
      if (json && Array.isArray(json.data)) {
        return {
          ...json,
          data: json.data.map(GroupFunctionResponseDTO.fromJson) // map each raw item → DTO
        };
      }
      return json;
    });

  } catch (error: any) {
    console.error("getGroupFunctionWithGroupID error:", error);
    return ApiResponse.error(error.message || "Lỗi không xác định");
  }
}


  async deleteGroupManagement(groupId: string): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.delete("/GroupManagement/DeleteGroupManagement", { params: { groupId } });
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("deleteGroupManagement error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async updateGroupManagement(group: GroupManagementRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.put("/GroupManagement/UpdateGroupManagement", group);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("updateGroupManagement error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async searchGroupInList(textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<GroupManagementResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/GroupManagement/SearchGroupInList", { params: { textToSearch, page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<GroupManagementResponseDTO>>(res,(json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(GroupManagementResponseDTO.fromJson)
            };
          }
          return json;
        });
    } catch (error: any) {
      console.error("searchGroupInList error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getGroupManagementWithGroupId(groupId: string): Promise<ApiResponse<GroupManagementResponseDTO>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/GroupManagement/GetGroupManagemetWithGroupId", { params: { groupId } });
      return ApiResponse.fromJson<GroupManagementResponseDTO>(res, GroupManagementResponseDTO.fromJson);
    } catch (error: any) {
      console.error("getGroupManagementWithGroupId error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getTotalUserInGroup(): Promise<ApiResponse<number>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/GroupManagement/GetTotalUserInGroup");
      return ApiResponse.fromJson<number>(res);
    } catch (error: any) {
      console.error("getTotalUserInGroup error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getTotalGroupCount(): Promise<ApiResponse<number>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/GroupManagement/GetTotalGroupCount");
      return ApiResponse.fromJson<number>(res);
    } catch (error: any) {
      console.error("getTotalGroupCount error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }
}
