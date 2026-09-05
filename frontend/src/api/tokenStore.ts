/**
 * In-memory access token storage.
 *
 * Security Guarantee:
 * - Stored exclusively in a private JavaScript module closure.
 * - Never persisted in localStorage, sessionStorage, or IndexedDB.
 * - Never attached to window or DOM globals.
 * - Ephemeral: disappears on full page refresh or tab close.
 */
let currentAccessToken: string | null = null;

export const tokenStore = {
  /**
   * Retrieves the current in-memory access token synchronously.
   */
  get: (): string | null => currentAccessToken,

  /**
   * Sets or updates the in-memory access token.
   */
  set: (token: string | null): void => {
    currentAccessToken = token;
  },

  /**
   * Clears the in-memory access token.
   */
  clear: (): void => {
    currentAccessToken = null;
  },
};
