import { apiClient, rawClient } from "@/api";

import type {
  CurrentUserResponse,
  ExternalLinkInfo,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LinkExternalAccountRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
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
   * Request a password reset link using rawClient (unintercepted).
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await rawClient.post<ForgotPasswordResponse>("/auth/forgot-password", payload);
    return response.data;
  },

  /**
   * Complete password reset using rawClient (unintercepted).
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await rawClient.post<ResetPasswordResponse>("/auth/reset-password", payload);
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
   * Retrieve external link info for account linking preview.
   */
  async getLinkInfo(ticket: string): Promise<ExternalLinkInfo> {
    const response = await rawClient.get<ExternalLinkInfo>(
      `/auth/external/link-info?ticket=${encodeURIComponent(ticket)}`
    );
    return response.data;
  },

  /**
   * Link external account to existing account by proving control with password.
   */
  async linkExternalAccount(payload: LinkExternalAccountRequest): Promise<LoginResponse> {
    const response = await rawClient.post<LoginResponse>("/auth/external/link", payload);
    return response.data;
  },

  /**
   * Retrieve the current authenticated user identity.
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>("/auth/me");
    return response.data;
  },
};
