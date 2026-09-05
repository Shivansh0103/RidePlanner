import type { User } from "./authContracts";

export type AuthStatus = "bootstrapping" | "authenticated" | "unauthenticated";

export interface BootstrappingAuthState {
  status: "bootstrapping";
  user: null;
  isAuthenticated: false;
}

export interface AuthenticatedAuthState {
  status: "authenticated";
  user: User;
  isAuthenticated: true;
}

export interface UnauthenticatedAuthState {
  status: "unauthenticated";
  user: null;
  isAuthenticated: false;
}

export type AuthState =
  | BootstrappingAuthState
  | AuthenticatedAuthState
  | UnauthenticatedAuthState;
