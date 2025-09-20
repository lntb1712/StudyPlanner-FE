import type { StudentClassRequestDTO } from "../../../domain/entities/StudentClassDTO/StudentClassRequestDTO";
import type { StudentClassResponseDTO } from "../../../domain/entities/StudentClassDTO/StudentClassResponseDTO";
import type { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export interface IStudentClassRepository {
  addStudentClass(studentClassDto: StudentClassRequestDTO): Promise<ApiResponse<boolean>>;
  getAllStudentClasses(classId:string, page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<StudentClassResponseDTO>>>;
  deleteStudentClass(classId: string, studentId: string): Promise<ApiResponse<boolean>>;
  updateStudentClass(studentClassDto: StudentClassRequestDTO): Promise<ApiResponse<boolean>>;
  searchStudentClassesInList(classId:string,textToSearch: string, page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<StudentClassResponseDTO>>>;
  getStudentClassWithIds(classId: string, studentId: string): Promise<ApiResponse<StudentClassResponseDTO>>;
}