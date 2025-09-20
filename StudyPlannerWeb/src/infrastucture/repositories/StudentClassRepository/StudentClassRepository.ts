
import { http } from "../../api/http";
import type { IStudentClassRepository } from "./IStudentClassRepository";
import type { StudentClassRequestDTO } from "../../../domain/entities/StudentClassDTO/StudentClassRequestDTO";
import { StudentClassResponseDTO } from "../../../domain/entities/StudentClassDTO/StudentClassResponseDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export class StudentClassRepository implements IStudentClassRepository {
  private setAuthorizationHeader(): void {
    const token = localStorage.getItem("token");
    if (token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  async addStudentClass(studentClassDto: StudentClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.post(`/Class/${studentClassDto.ClassId}/StudentClass/AddStudentClass`, studentClassDto);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("addStudentClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getAllStudentClasses(classId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<StudentClassResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get(`/Class/${classId}/StudentClass/GetStudentClassListAsync`, { params: { page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<StudentClassResponseDTO>>(
        res,
        (json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(StudentClassResponseDTO.fromJson)
            };
          }
          return json;
        }
      );
    } catch (error: any) {
      console.error("getAllStudentClasses error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async deleteStudentClass(classId: string, studentId: string): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.delete(`/Class/${classId}/StudentClass/DeleteStudentClass`, { params: { classId, studentId } });
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("deleteStudentClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async updateStudentClass(studentClassDto: StudentClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.put(`/Class/${studentClassDto.ClassId}/StudentClass/UpdateStudentClass`, studentClassDto);
      return ApiResponse.fromJson<boolean>(res);
    } catch (error: any) {
      console.error("updateStudentClass error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async searchStudentClassesInList(classId: string, textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<StudentClassResponseDTO>>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get(`/Class/${classId}/StudentClass/SearchStudentClassListAsync`, { params: { textToSearch, page, pageSize } });
      return ApiResponse.fromJson<PagedResponse<StudentClassResponseDTO>>(
        res,
        (json: any) => {
          if (json && Array.isArray(json.data)) {
            return {
              ...json,
              data: json.data.map(StudentClassResponseDTO.fromJson)
            };
          }
          return json;
        }
      );
    } catch (error: any) {
      console.error("searchStudentClassesInList error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }

  async getStudentClassWithIds(classId: string, studentId: string): Promise<ApiResponse<StudentClassResponseDTO>> {
    try {
      this.setAuthorizationHeader();
      const res = await http.get(`/Class/${classId}/StudentClass/GetStudentClassById`, { params: { classId, studentId } });
      return ApiResponse.fromJson<StudentClassResponseDTO>(res, StudentClassResponseDTO.fromJson);
    } catch (error: any) {
      console.error("getStudentClassWithIds error:", error);
      return ApiResponse.error(error.message || "Lỗi không xác định");
    }
  }
}
