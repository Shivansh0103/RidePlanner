import { apiClient } from "@/api/axios";

import type { UpdateProfileRequest, UserProfile } from "../types/userProfile";

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/api/users/profile");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>("/api/users/profile", data);
    return response.data;
  },
};
