import type { TeacherClassRequestDTO } from "../../domain/entities/TeacherClassDTO/TeacherClassRequestDTO";
import type { TeacherClassResponseDTO } from "../../domain/entities/TeacherClassDTO/TeacherClassResponseDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { TeacherClassRepository } from "../../infrastucture/repositories/TeacherClassRepository/TeacherClassRepository";

export class TeacherClassUseCase {
  private repository: TeacherClassRepository;

  constructor(repository: TeacherClassRepository = new TeacherClassRepository()) {
    this.repository = repository;
  }

  async addTeacherClass(teacherClassDto: TeacherClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.addTeacherClass(teacherClassDto);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to add teacher class");
    }
  }

  async getAllTeacherClasses(classId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<TeacherClassResponseDTO>>> {
    try {
      return await this.repository.getAllTeacherClasses(classId, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch teacher classes");
    }
  }

  async deleteTeacherClass(classId: string, teacherId: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.deleteTeacherClass(classId, teacherId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to delete teacher class");
    }
  }

  async updateTeacherClass(teacherClassDto: TeacherClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.updateTeacherClass(teacherClassDto);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to update teacher class");
    }
  }

  async searchTeacherClassesInList(classId: string, textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<TeacherClassResponseDTO>>> {
    try {
      return await this.repository.searchTeacherClassesInList(classId, textToSearch, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to search teacher classes");
    }
  }

  async getTeacherClassWithIds(classId: string, teacherId: string): Promise<ApiResponse<TeacherClassResponseDTO>> {
    try {
      return await this.repository.getTeacherClassWithIds(classId, teacherId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch teacher class details");
    }
  }
}