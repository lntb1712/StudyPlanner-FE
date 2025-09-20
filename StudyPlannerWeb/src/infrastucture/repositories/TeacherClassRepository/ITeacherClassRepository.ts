import type { TeacherClassRequestDTO } from "../../../domain/entities/TeacherClassDTO/TeacherClassRequestDTO";
import type { TeacherClassResponseDTO } from "../../../domain/entities/TeacherClassDTO/TeacherClassResponseDTO";
import type { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export interface ITeacherClassRepository {
  addTeacherClass(teacherClassDto: TeacherClassRequestDTO): Promise<ApiResponse<boolean>>;
  getAllTeacherClasses(classId:string,page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<TeacherClassResponseDTO>>>;
  deleteTeacherClass(classId: string, teacherId: string): Promise<ApiResponse<boolean>>;
  updateTeacherClass(teacherClassDto: TeacherClassRequestDTO): Promise<ApiResponse<boolean>>;
  searchTeacherClassesInList(classId:string,textToSearch: string, page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<TeacherClassResponseDTO>>>;
  getTeacherClassWithIds(classId: string, teacherId: string): Promise<ApiResponse<TeacherClassResponseDTO>>;
}