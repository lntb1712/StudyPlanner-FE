import type { AccountManagementRequestDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import type { AccountManagementResponseDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";


export interface IAccountManagementRepository {
  getAllAccounts(page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>>;
  getTotalAccounts(): Promise<ApiResponse<number>>;
  getUserInformation(username: string): Promise<ApiResponse<AccountManagementResponseDTO>>;
  addAccount(account: AccountManagementRequestDTO): Promise<ApiResponse<boolean>>;
  updateAccount(account: AccountManagementRequestDTO): Promise<ApiResponse<boolean>>;
  deleteAccount(username: string): Promise<ApiResponse<boolean>>;
  getAllAccountByGroupId(groupId: string, page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>>;
  searchAccountByText(textToSearch: string, page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>>;
}
