import { createContext } from "react";

import type { AuthState, LoginRequest, RegisterRequest, User } from "../types";

export interface AuthContextValue {
  authState: AuthState;
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<{ autoLoginSucceeded: boolean }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
