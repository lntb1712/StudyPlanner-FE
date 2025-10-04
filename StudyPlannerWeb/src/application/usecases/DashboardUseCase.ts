import { DashboardDTO } from "../../domain/entities/DashboardDTO/DashboardDTO";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { DashboardRepository } from "../../infrastucture/repositories/DashboardRepository/DashboardRepository";

export class DashboardUseCase {
  private repository: DashboardRepository;

  constructor(repository: DashboardRepository = new DashboardRepository()) {
    this.repository = repository;
  }

  async getDashboardData(): Promise<ApiResponse<DashboardDTO>> {
    try {
      return await this.repository.getDashboardData();
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch dashboard data");
    }
  }
}