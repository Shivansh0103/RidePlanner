import { apiClient, rawClient } from "@/api";

import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types";

export const authApi = {
  /**
   * Authenticate user with credentials using rawClient (unintercepted).
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await rawClient.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * Register a new user using rawClient (unintercepted).
   */
  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    const response = await rawClient.post<RegisterResponse>("/auth/register", credentials);
    return response.data;
  },

  /**
   * Logout the current session.
   * Uses apiClient with skipAuthRefresh so a 401 on logout doesn't trigger token renewal.
   */
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout", undefined, { skipAuthRefresh: true });
  },

  /**
   * Retrieve the current authenticated user identity.
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>("/auth/me");
    return response.data;
  },
};
