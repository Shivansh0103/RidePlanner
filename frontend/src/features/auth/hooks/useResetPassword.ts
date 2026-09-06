import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/authApi";
import type { ResetPasswordRequest, ResetPasswordResponse } from "../types";

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: async (payload: ResetPasswordRequest) => {
      return await authApi.resetPassword(payload);
    },
  });
}
