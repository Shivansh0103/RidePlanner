import { useMutation } from "@tanstack/react-query";

import type { RegisterRequest } from "../types";
import { useAuth } from "./useAuth";

export function useRegister() {
  const { register } = useAuth();

  return useMutation({
    mutationFn: async (credentials: RegisterRequest) => {
      return await register(credentials);
    },
  });
}
