import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { profileApi } from "../api/profileApi";
import type { UpdateProfileRequest, UserProfile } from "../types/userProfile";
import { profileKeys } from "./useProfile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfileRequest>({
    mutationFn: (data) => profileApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.profile, updatedProfile);
      queryClient.invalidateQueries({ queryKey: profileKeys.profile });
      toast.success("Rider preferences saved successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save rider preferences.");
    },
  });
}
