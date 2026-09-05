export interface User {
  id: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
}

export interface CurrentUserResponse {
  userId: string | null;
  isAuthenticated: boolean;
}
