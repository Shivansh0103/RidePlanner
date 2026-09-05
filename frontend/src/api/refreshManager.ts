import { type RefreshResponse,refreshTransport } from "./refreshTransport";
import { tokenStore } from "./tokenStore";

class RefreshManager {
  private inFlightRefreshPromise: Promise<RefreshResponse> | null = null;
  private sessionExpiredListeners: Array<() => void> = [];

  /**
   * Registers a callback to be notified when token renewal fails irreversibly.
   * Returns an unsubscribe function.
   */
  public onSessionExpired(listener: () => void): () => void {
    this.sessionExpiredListeners.push(listener);
    return () => {
      this.sessionExpiredListeners = this.sessionExpiredListeners.filter(
        (l) => l !== listener
      );
    };
  }

  /**
   * Returns a valid access token.
   *
   * Concurrency Guarantee:
   * If a refresh request is already in-flight, all subsequent calls attach to the
   * same Promise. This prevents multiple concurrent /refresh requests from presenting
   * the same rotating token to the backend, which would trigger reuse detection
   * and revoke the user's session family.
   */
  public async getValidToken(): Promise<string> {
    const response = await this.executeRefreshInternal();
    return response.accessToken;
  }

  /**
   * Restores an active session on application bootstrap and returns the user identity.
   */
  public async restoreSession(): Promise<{
    user: { id: string; email: string };
    accessToken: string;
  }> {
    const response = await this.executeRefreshInternal();
    return {
      user: { id: response.userId, email: response.email },
      accessToken: response.accessToken,
    };
  }

  private async executeRefreshInternal(): Promise<import("./refreshTransport").RefreshResponse> {
    if (this.inFlightRefreshPromise) {
      return this.inFlightRefreshPromise;
    }

    this.inFlightRefreshPromise = (async () => {
      try {
        const response = await refreshTransport.executeRefresh();
        const newToken = response.accessToken;
        tokenStore.set(newToken);
        return response;
      } catch (error) {
        tokenStore.clear();
        this.emitSessionExpired();
        throw error;
      } finally {
        this.inFlightRefreshPromise = null;
      }
    })();

    return this.inFlightRefreshPromise;
  }

  /**
   * Emits a single session-expired notification to all registered listeners.
   */
  private emitSessionExpired(): void {
    this.sessionExpiredListeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("Error in sessionExpired listener:", e);
      }
    });
  }
}

export const refreshManager = new RefreshManager();
