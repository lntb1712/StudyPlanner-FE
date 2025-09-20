import { http } from "../../api/http";
import type { IClassRepository } from "./IClassRepository";
import type { ClassRequestDTO } from "../../../domain/entities/ClassDTO/ClassRequestDTO";
import { ClassResponseDTO } from "../../../domain/entities/ClassDTO/ClassResponseDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export class ClassRepository implements IClassRepository {
  private setAuthorizationHeader(): void {
    const token = localStorage.getItem("token");
    if (token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  async addClass(classDto: ClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.post("/Class/AddClass", classDto);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("addClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getAllClasses(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<ClassResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/Class/GetClassListAsync", { params: { page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<ClassResponseDTO>>(
        res,
        (json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(ClassResponseDTO.fromJson)
            };
          }
          return json;
        }
      );
    } catch (error: any) {
      console.error("getAllClasses error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async deleteClass(classId: string): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.delete("/Class/DeleteClass", { params: { classId } });
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("deleteClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async updateClass(classDto: ClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.put("/Class/UpdateClass", classDto);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("updateClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async searchClassesInList(textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<ClassResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/Class/SearchClassListAsync", { params: { textToSearch, page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<ClassResponseDTO>>(res,(json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(ClassResponseDTO.fromJson)
            };
          }
          return json;
        });
    } catch (error: any) {
      console.error("searchClassesInList error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getClassWithClassId(classId: string): Promise<ApiResponse<ClassResponseDTO>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get("/Class/GetClassById", { params: { classId } });
      return ApiResponse.fromJson<ClassResponseDTO>(res, ClassResponseDTO.fromJson);
    } catch (error: any) {
      console.error("getClassWithClassId error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }
}