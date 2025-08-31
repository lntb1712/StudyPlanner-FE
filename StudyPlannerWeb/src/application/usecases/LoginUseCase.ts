import type { LoginRequestDTO } from "../../domain/entities/LoginDTO/LoginRequestDTO";
import type { LoginResponseDTO } from "../../domain/entities/LoginDTO/LoginResponseDTO";
import type { ILoginRepository } from "../../infrastucture/repositories/LoginRepository/ILoginRepository";


export class LoginUseCase{
    private loginRepository: ILoginRepository;

    constructor(loginRepository: ILoginRepository) {
        this.loginRepository = loginRepository;
    }

    async execute(loginRequestDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
        return this.loginRepository.login(loginRequestDTO);
    }
}