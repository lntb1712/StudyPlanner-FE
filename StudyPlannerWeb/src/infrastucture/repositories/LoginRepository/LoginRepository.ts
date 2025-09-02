import type { LoginRequestDTO } from "../../../domain/entities/LoginDTO/LoginRequestDTO";
import { LoginResponseDTO } from "../../../domain/entities/LoginDTO/LoginResponseDTO";
import { ApiResponse } from "../../../domain/value-objects/ApiResponse";
import { http } from "../../api/http";
import type { ILoginRepository } from "./ILoginRepository";

export class LoginRepository implements ILoginRepository {
  async login(loginRequestDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await http.post("/Login/Authentication", loginRequestDTO);

      // Map JSON -> ApiResponse object
      const apiResponse = ApiResponse.fromJson<LoginResponseDTO>(response);

      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || "Đăng nhập thất bại");
      }

      return LoginResponseDTO.fromJson(apiResponse.data);
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi xác thực");
    }
  }
}

