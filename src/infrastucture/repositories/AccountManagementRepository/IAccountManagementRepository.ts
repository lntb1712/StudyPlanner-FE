import type { AccountManagementRequestDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import type { AccountManagementResponseDTO } from "../../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export interface IAccountManagementRepository {
    getAllAccounts(page?: number, pageSize?: number): Promise<PagedResponse<AccountManagementResponseDTO>>;
    getTotalAccounts(): Promise<number>;
    getUserInformation(username: string): Promise<AccountManagementResponseDTO>;
    addAccount(account: AccountManagementRequestDTO): Promise<boolean>;
    updateAccount(account: AccountManagementRequestDTO): Promise<boolean>;
    deleteAccount(username: string): Promise<boolean>;
    getAllAccountByGroupId(groupId: string, page?: number, pageSize?: number): Promise<PagedResponse<AccountManagementResponseDTO>>;
    searchAccountByText(textToSearch: string, page?: number, pageSize?: number): Promise<PagedResponse<AccountManagementResponseDTO>>;
}