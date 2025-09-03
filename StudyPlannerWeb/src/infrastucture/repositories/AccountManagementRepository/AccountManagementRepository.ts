import type { AccountManagementRequestDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import { AccountManagementResponseDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";
import { http } from "../../api/http";
import type { IAccountManagementRepository } from "./IAccountManagementRepository";

export class AccountManagementRepository implements IAccountManagementRepository {
  private setAuthorizationHeader(): void {
    const token = localStorage.getItem("token");
    if (token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  async getAllAccounts(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/AccountManagement/GetAllAccount", {
        params: { page, pageSize },
      });
      return ApiResponse.fromJson<PagedResponse<AccountManagementResponseDTO>>(res);
    } catch (error: any) {
      console.error("getAllAccounts error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getTotalAccounts(): Promise<ApiResponse<number>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/AccountManagement/GetTotalAccount");
      return ApiResponse.fromJson<number>(res);
    } catch (error: any) {
      console.error("getTotalAccounts error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getUserInformation(username: string): Promise<ApiResponse<AccountManagementResponseDTO>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get(`/AccountManagement/GetUserInformation?username=${username}`);
      const apiRes = ApiResponse.fromJson<AccountManagementResponseDTO>(res);
      if (apiRes.isSuccess() && apiRes.data) {
        apiRes.data = AccountManagementResponseDTO.fromJson(apiRes.data);
      }
      return apiRes;
    } catch (error: any) {
      console.error("getUserInformation error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async addAccount(account: AccountManagementRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.post("/AccountManagement/AddAccountManagement", account);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("addAccount error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async updateAccount(account: AccountManagementRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.put("/AccountManagement/UpdateAccountManagement", account);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("updateAccount error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async deleteAccount(username: string): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.delete(`/AccountManagement/DeleteAccountManagement?username=${username}`);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("deleteAccount error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getAllAccountByGroupId(
    groupId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/AccountManagement/GetAllAccountByGroupId", {
        params: { groupId, page, pageSize },
      });
      return ApiResponse.fromJson<PagedResponse<AccountManagementResponseDTO>>(res);
    } catch (error: any) {
      console.error("getAllAccountByGroupId error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async searchAccountByText(
    textToSearch: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/AccountManagement/SearchAccountByText", {
        params: { textToSearch, page, pageSize },
      });
      return ApiResponse.fromJson<PagedResponse<AccountManagementResponseDTO>>(res);
    } catch (error: any) {
      console.error("searchAccountByText error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }
}