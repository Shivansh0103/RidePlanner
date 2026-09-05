import { useMutation } from "@tanstack/react-query";

import type { LoginRequest } from "../types";
import { useAuth } from "./useAuth";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      await login(credentials);
    },
  });
}
