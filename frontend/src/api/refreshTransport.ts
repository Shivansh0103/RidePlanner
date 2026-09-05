import { rawClient } from "./rawClient";

export interface RefreshResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
}

/**
 * Dedicated unintercepted caller for token renewal.
 *
 * Uses rawClient so this request never passes through the 401 retry interceptor.
 */
export const refreshTransport = {
  async executeRefresh(): Promise<RefreshResponse> {
    const response = await rawClient.post<RefreshResponse>("/auth/refresh");
    return response.data;
  },
};
