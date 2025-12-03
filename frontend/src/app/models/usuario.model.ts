export interface Usuario {
  login: string;
  nome: string;
  senha?: string;
}

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface RegisterRequest {
  login: string;
  nome: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  login: string;
  nome: string;
}
