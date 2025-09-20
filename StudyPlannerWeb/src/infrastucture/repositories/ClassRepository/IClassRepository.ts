import type { ClassRequestDTO } from "../../../domain/entities/ClassDTO/ClassRequestDTO";
import type { ClassResponseDTO } from "../../../domain/entities/ClassDTO/ClassResponseDTO";
import type { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import type { PagedResponse } from "../../../domain/value-objects/PagedResponse";

export interface IClassRepository {
  addClass(classDto: ClassRequestDTO): Promise<ApiResponse<boolean>>;
  getAllClasses(page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<ClassResponseDTO>>>;
  deleteClass(classId: string): Promise<ApiResponse<boolean>>;
  updateClass(classDto: ClassRequestDTO): Promise<ApiResponse<boolean>>;
  searchClassesInList(textToSearch: string, page?: number, pageSize?: number): Promise<ApiResponse<PagedResponse<ClassResponseDTO>>>;
  getClassWithClassId(classId: string): Promise<ApiResponse<ClassResponseDTO>>;
}