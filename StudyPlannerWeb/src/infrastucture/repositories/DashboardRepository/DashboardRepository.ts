import { http } from "../../api/http";
import { DashboardDTO } from "../../../domain/entities/DashboardDTO/DashboardDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";

export class DashboardRepository {
  async getDashboardData(): Promise<ApiResponse<DashboardDTO>> {
    try {
      const res = await http.get("/Dashboard/GetDashboardDataAsync");
      return ApiResponse.fromJson<DashboardDTO>(res, (json: any) => {
  if (json && json.Data) {
    return {
      ...json,
      Data: DashboardDTO.fromJson(json.Data)
    };
  }
  return json;
});
    } catch (error: any) {
      console.error("getDashboardData error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }
}