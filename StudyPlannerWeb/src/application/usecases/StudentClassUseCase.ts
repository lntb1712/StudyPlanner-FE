
import type { StudentClassRequestDTO } from "../../domain/entities/StudentClassDTO/StudentClassRequestDTO";
import type { StudentClassResponseDTO } from "../../domain/entities/StudentClassDTO/StudentClassResponseDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { StudentClassRepository } from "../../infrastucture/repositories/StudentClassRepository/StudentClassRepository";

export class StudentClassUseCase {
  private repository: StudentClassRepository;

  constructor(repository: StudentClassRepository = new StudentClassRepository()) {
    this.repository = repository;
  }

  async addStudentClass(studentClassDto: StudentClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.addStudentClass(studentClassDto);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to add student class");
    }
  }

  async getAllStudentClasses(classId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<StudentClassResponseDTO>>> {
    try {
      return await this.repository.getAllStudentClasses(classId, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch student classes");
    }
  }

  async deleteStudentClass(classId: string, studentId: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.deleteStudentClass(classId, studentId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to delete student class");
    }
  }

  async updateStudentClass(studentClassDto: StudentClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.updateStudentClass(studentClassDto);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to update student class");
    }
  }

  async searchStudentClassesInList(classId: string, textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<StudentClassResponseDTO>>> {
    try {
      return await this.repository.searchStudentClassesInList(classId, textToSearch, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to search student classes");
    }
  }

  async getStudentClassWithIds(classId: string, studentId: string): Promise<ApiResponse<StudentClassResponseDTO>> {
    try {
      return await this.repository.getStudentClassWithIds(classId, studentId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch student class details");
    }
  }
}
