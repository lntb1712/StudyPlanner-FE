import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { AccountManagementRequestDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { AccountManagementRepository } from "../../infrastucture/repositories/AccountManagementRepository/AccountManagementRepository";

export class AccountManagementUseCase {
  private repository: AccountManagementRepository;

  constructor(repository: AccountManagementRepository = new AccountManagementRepository()) {
    this.repository = repository;
  }

  async getAllAccounts(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>> {
    try {
      return await this.repository.getAllAccounts(page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch accounts");
    }
  }

  async getTotalAccounts(): Promise<ApiResponse<number>> {
    try {
      return await this.repository.getTotalAccounts();
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch total accounts");
    }
  }

  async getUserInformation(username: string): Promise<ApiResponse<AccountManagementResponseDTO>> {
    try {
      return await this.repository.getUserInformation(username);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch user information");
    }
  }

  async addAccount(account: AccountManagementRequestDTO): Promise<ApiResponse<boolean>> {
  try {
    const success = await this.repository.addAccount(account);
    return success;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Failed to add account");
  }
}

async updateAccount(account: AccountManagementRequestDTO): Promise<ApiResponse<boolean>> {
  try {
    const success = await this.repository.updateAccount(account);
    return success;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Failed to update account");
  }
}

async deleteAccount(username: string): Promise<ApiResponse<boolean>> {
  try {
    const success = await this.repository.deleteAccount(username);
    return success;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete account");
  }
}

  async getAllAccountByGroupId(groupId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>> {
    try {
      return await this.repository.getAllAccountByGroupId(groupId, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch accounts by group ID");
    }
  }

  async searchAccountByText(textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<AccountManagementResponseDTO>>> {
    try {
      return await this.repository.searchAccountByText(textToSearch, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to search accounts");
    }
  }
}