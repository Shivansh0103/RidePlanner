import { useQueryClient } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { refreshManager, tokenStore } from "@/api";

import { authApi } from "../api/authApi";
import type {
  AuthState,
  LoginRequest,
  RegisterRequest,
} from "../types";
import { AuthContext, type AuthContextValue } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({
    status: "bootstrapping",
    user: null,
    isAuthenticated: false,
  });

  const handleSessionExpired = useCallback(() => {
    tokenStore.clear();
    queryClient.clear();
    setAuthState({
      status: "unauthenticated",
      user: null,
      isAuthenticated: false,
    });
  }, [queryClient]);

  // Handle session expired event from transport layer
  useEffect(() => {
    const unsubscribe = refreshManager.onSessionExpired(handleSessionExpired);
    return () => unsubscribe();
  }, [handleSessionExpired]);

  // Session bootstrap effect on initial mount
  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      try {
        const session = await refreshManager.restoreSession();
        if (isMounted) {
          setAuthState({
            status: "authenticated",
            user: session.user,
            isAuthenticated: true,
          });
        }
      } catch {
        if (isMounted) {
          tokenStore.clear();
          setAuthState({
            status: "unauthenticated",
            user: null,
            isAuthenticated: false,
          });
        }
      }
    }

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    const response = await authApi.login(credentials);
    tokenStore.set(response.accessToken);
    setAuthState({
      status: "authenticated",
      user: {
        id: response.userId,
        email: response.email,
      },
      isAuthenticated: true,
    });
  }, []);

  const register = useCallback(
    async (credentials: RegisterRequest): Promise<{ autoLoginSucceeded: boolean }> => {
      await authApi.register(credentials);
      try {
        const loginResponse = await authApi.login({
          email: credentials.email,
          password: credentials.password,
        });
        tokenStore.set(loginResponse.accessToken);
        setAuthState({
          status: "authenticated",
          user: {
            id: loginResponse.userId,
            email: loginResponse.email,
          },
          isAuthenticated: true,
        });
        return { autoLoginSucceeded: true };
      } catch (autoLoginError) {
        console.warn("Auto-login after registration failed, user must log in manually:", autoLoginError);
        return { autoLoginSucceeded: false };
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Backend logout notification failed, proceeding with local cleanup:", err);
    } finally {
      tokenStore.clear();
      queryClient.clear();
      setAuthState({
        status: "unauthenticated",
        user: null,
        isAuthenticated: false,
      });
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      authState,
      user: authState.status === "authenticated" ? authState.user : null,
      isAuthenticated: authState.status === "authenticated",
      isBootstrapping: authState.status === "bootstrapping",
      login,
      register,
      logout,
    }),
    [authState, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
