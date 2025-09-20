import { http } from "../../api/http";
import type { ITeacherClassRepository } from "./ITeacherClassRepository";
import type { TeacherClassRequestDTO } from "../../../domain/entities/TeacherClassDTO/TeacherClassRequestDTO";
import { TeacherClassResponseDTO } from "../../../domain/entities/TeacherClassDTO/TeacherClassResponseDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export class TeacherClassRepository implements ITeacherClassRepository {
  private setAuthorizationHeader(): void {
    const token = localStorage.getItem("token");
    if (token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  async addTeacherClass(teacherClassDto: TeacherClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.post(`/Class/${teacherClassDto.ClassId}/TeacherClass/AddTeacherClass`, teacherClassDto);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("addTeacherClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getAllTeacherClasses(classId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<TeacherClassResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get(`/Class/${classId}/TeacherClass/GetTeacherClassListAsync`, { params: { page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<TeacherClassResponseDTO>>(
        res,
        (json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(TeacherClassResponseDTO.fromJson)
            };
          }
          return json;
        }
      );
    } catch (error: any) {
      console.error("getAllTeacherClasses error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async deleteTeacherClass(classId: string, teacherId: string): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.delete(`/Class/${classId}/TeacherClass/DeleteTeacherClass`, { params: { classId, teacherId } });
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("deleteTeacherClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async updateTeacherClass(teacherClassDto: TeacherClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.put(`/Class/${teacherClassDto.ClassId}/TeacherClass/UpdateTeacherClass`, teacherClassDto);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("updateTeacherClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async searchTeacherClassesInList(classId: string, textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<TeacherClassResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get(`/Class/${classId}/TeacherClass/SearchTeacherClassListAsync`, { params: { textToSearch, page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<TeacherClassResponseDTO>>(
        res,
        (json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(TeacherClassResponseDTO.fromJson)
            };
          }
          return json;
        }
      );
    } catch (error: any) {
      console.error("searchTeacherClassesInList error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getTeacherClassWithIds(classId: string, teacherId: string): Promise<ApiResponse<TeacherClassResponseDTO>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get(`/Class/${classId}/TeacherClass/GetTeacherClassByID`, { params: { classId, teacherId } });
      return ApiResponse.fromJson<TeacherClassResponseDTO>(res, TeacherClassResponseDTO.fromJson);
    } catch (error: any) {
      console.error("getTeacherClassWithIds error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }
}
