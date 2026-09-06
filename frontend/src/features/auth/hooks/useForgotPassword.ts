import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/authApi";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "../types";

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: async (payload: ForgotPasswordRequest) => {
      return await authApi.forgotPassword(payload);
    },
  });
}
