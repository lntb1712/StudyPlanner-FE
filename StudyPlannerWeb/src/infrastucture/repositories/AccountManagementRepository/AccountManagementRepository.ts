import { AccountManagementResponseDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import { AccountManagementRequestDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import { PagedResponse } from "../../../domain/value-objects/PagedResponse";
import { http } from "../../api/http";
import type { IAccountManagementRepository } from "./IAccountManagementRepository";

export class AccountManagementRepository implements IAccountManagementRepository {
  async getAllAccounts(
  page: number = 1,
  pageSize: number = 10
): Promise<PagedResponse<AccountManagementResponseDTO>> {
  try {
    
    const token = localStorage.getItem('token');
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await http.get(`/AccountManagement/GetAllAccount?page=${page}&pageSize=${pageSize}`);
    const apiResponse = ApiResponse.fromJson<PagedResponse<AccountManagementResponseDTO>>(response);

    if (!apiResponse.isSuccess()) {
      throw new Error(apiResponse.message || "Lấy danh sách tài khoản thất bại");
    }

    

    return PagedResponse.fromJson(
      apiResponse.data!,
      (item: any) => AccountManagementResponseDTO.fromJson(item)
    );
  } catch (error: any) {
    console.error("getAllAccounts error:", error);
    throw new Error(error.message || "Lỗi không xác định");
  }
}

    async getTotalAccounts(): Promise<number> {
        try {
            const response = await http.get(`/AccountManagement/GetTotalAccount`);
            const apiResponse = ApiResponse.fromJson(response.data);
            if (!apiResponse.isSuccess()) {
                throw new Error(apiResponse.message || "Không lấy được tổng số tài khoản");
            }
            return apiResponse.data as number;
        } catch (error: any) {
            throw new Error(error.message || "Lỗi không xác định");
        }
    }

    async getUserInformation(username: string): Promise<AccountManagementResponseDTO> {
        try {
            const response = await http.get(`/AccountManagement/GetUserInformation?username=${username}`);
            const apiResponse = ApiResponse.fromJson(response.data);
            if (!apiResponse.isSuccess()) {
                throw new Error(apiResponse.message || "Không lấy được thông tin người dùng");
            }
            return AccountManagementResponseDTO.fromJson(apiResponse.data);
        } catch (error: any) {
            throw new Error(error.message || "Lỗi không xác định");
        }
    }

    async addAccount(account: AccountManagementRequestDTO): Promise<boolean> {
        try {
            const response = await http.post(`/AccountManagement/AddAccountManagement`, account);
            const apiResponse = ApiResponse.fromJson(response.data);
            if (!apiResponse.isSuccess()) {
                throw new Error(apiResponse.message || "Thêm tài khoản thất bại");
            }
            return true;
        } catch (error: any) {
            throw new Error(error.message || "Lỗi không xác định");
        }
    }

    async updateAccount(account: AccountManagementRequestDTO): Promise<boolean> {
        try {
            const response = await http.put(`/AccountManagement/UpdateAccountManagement`, account);
            const apiResponse = ApiResponse.fromJson(response.data);
            if (!apiResponse.isSuccess()) {
                throw new Error(apiResponse.message || "Cập nhật tài khoản thất bại");
            }
            return true;
        } catch (error: any) {
            throw new Error(error.message || "Lỗi không xác định");
        }
    }

    async deleteAccount(username: string): Promise<boolean> {
        try {
            const response = await http.delete(`/AccountManagement/DeleteAccountManagement?username=${username}`);
            const apiResponse = ApiResponse.fromJson(response.data);
            if (!apiResponse.isSuccess()) {
                throw new Error(apiResponse.message || "Xóa tài khoản thất bại");
            }
            return true;
        } catch (error: any) {
            throw new Error(error.message || "Lỗi không xác định");
        }
    }

    async getAllAccountByGroupId(groupId: string, page: number = 1, pageSize: number = 10): Promise<PagedResponse<AccountManagementResponseDTO>> {
        try {
            const response = await http.get(`/AccountManagement/GetAllAccountByGroupId?groupId=${groupId}&page=${page}&pageSize=${pageSize}`);
            const apiResponse = ApiResponse.fromJson(response.data);
            if (!apiResponse.isSuccess()) {
                throw new Error(apiResponse.message || "Không lấy được danh sách tài khoản theo nhóm");
            }
            return PagedResponse.fromJson(
                apiResponse.data,
                (item: any) => AccountManagementResponseDTO.fromJson(item)
            );
        } catch (error: any) {
            throw new Error(error.message || "Lỗi không xác định");
        }
    }

    async searchAccountByText(textToSearch: string, page: number = 1, pageSize: number = 10): Promise<PagedResponse<AccountManagementResponseDTO>> {
        try {
            const response = await http.get(`/AccountManagement/SearchAccountByText?textToSearch=${textToSearch}&page=${page}&pageSize=${pageSize}`);
            const apiResponse = ApiResponse.fromJson(response.data);
            if (!apiResponse.isSuccess()) {
                throw new Error(apiResponse.message || "Không tìm thấy tài khoản");
            }
            return PagedResponse.fromJson(
                apiResponse.data,
                (item: any) => AccountManagementResponseDTO.fromJson(item)
            );
        } catch (error: any) {
            throw new Error(error.message || "Lỗi không xác định");
        }
    }
}
