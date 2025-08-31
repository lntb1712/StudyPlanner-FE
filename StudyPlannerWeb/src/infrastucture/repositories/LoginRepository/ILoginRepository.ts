import type { LoginRequestDTO } from "../../../domain/entities/LoginDTO/LoginRequestDTO";
import type { LoginResponseDTO } from "../../../domain/entities/LoginDTO/LoginResponseDTO";


export interface ILoginRepository {
  login(loginRequestDTO: LoginRequestDTO): Promise<LoginResponseDTO>;
}
