import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { AccountManagementRequestDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { AccountManagementRepository } from "../../infrastucture/repositories/AccountManagementRepository/AccountManagementRepository";


export class AccountManagementUseCase {
    private repository: AccountManagementRepository;

    constructor() {
        this.repository = new AccountManagementRepository();
    }

    async getAllAccounts(page: number = 1, pageSize: number = 10): Promise<PagedResponse<AccountManagementResponseDTO>> {
        return await this.repository.getAllAccounts(page, pageSize);
    }

    async getTotalAccounts(): Promise<number> {
        return await this.repository.getTotalAccounts();
    }

    async getUserInformation(username: string): Promise<AccountManagementResponseDTO> {
        return await this.repository.getUserInformation(username);
    }

    async addAccount(account: AccountManagementRequestDTO): Promise<boolean> {
        return await this.repository.addAccount(account);
    }

    async updateAccount(account: AccountManagementRequestDTO): Promise<boolean> {
        return await this.repository.updateAccount(account);
    }

    async deleteAccount(username: string): Promise<boolean> {
        return await this.repository.deleteAccount(username);
    }

    async getAllAccountByGroupId(groupId: string, page: number = 1, pageSize: number = 10): Promise<PagedResponse<AccountManagementResponseDTO>> {
        return await this.repository.getAllAccountByGroupId(groupId, page, pageSize);
    }

    async searchAccountByText(textToSearch: string, page: number = 1, pageSize: number = 10): Promise<PagedResponse<AccountManagementResponseDTO>> {
        return await this.repository.searchAccountByText(textToSearch, page, pageSize);
    }
}
