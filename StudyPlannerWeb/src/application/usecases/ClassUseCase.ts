import type { ClassRequestDTO } from "../../domain/entities/ClassDTO/ClassRequestDTO";
import type { ClassResponseDTO } from "../../domain/entities/ClassDTO/ClassResponseDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";
import { ApiResponse } from "../../domain/value-objects/ApiResponse";
import { ClassRepository } from "../../infrastucture/repositories/ClassRepository/ClassRepository";

export class ClassUseCase {
  private repository: ClassRepository;

  constructor(repository: ClassRepository = new ClassRepository()) {
    this.repository = repository;
  }

  async addClass(classDto: ClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.addClass(classDto);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to add class");
    }
  }

  async getAllClasses(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<ClassResponseDTO>>> {
    try {
      return await this.repository.getAllClasses(page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch classes");
    }
  }

  async deleteClass(classId: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.deleteClass(classId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to delete class");
    }
  }

  async updateClass(classDto: ClassRequestDTO): Promise<ApiResponse<boolean>> {
    try {
      return await this.repository.updateClass(classDto);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to update class");
    }
  }

  async searchClassesInList(textToSearch: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<ClassResponseDTO>>> {
    try {
      return await this.repository.searchClassesInList(textToSearch, page, pageSize);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to search classes");
    }
  }

  async getClassWithClassId(classId: string): Promise<ApiResponse<ClassResponseDTO>> {
    try {
      return await this.repository.getClassWithClassId(classId);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch class details");
    }
  }
}