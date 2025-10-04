import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import { DashboardDTO } from "../../../domain/entities/DashboardDTO/DashboardDTO";

export interface IDashboardRepository {
  getDashboardData(): Promise<ApiResponse<DashboardDTO>>;
}