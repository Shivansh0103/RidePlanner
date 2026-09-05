import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks/useAuth";

import { profileApi } from "../api/profileApi";
import type { UserProfile } from "../types/userProfile";

export const profileKeys = {
  profile: ["userProfile"] as const,
};

export function useProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserProfile>({
    queryKey: profileKeys.profile,
    queryFn: profileApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
