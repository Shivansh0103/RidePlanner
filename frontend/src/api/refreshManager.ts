import { refreshTransport } from "./refreshTransport";
import { tokenStore } from "./tokenStore";

class RefreshManager {
  private inFlightRefreshPromise: Promise<string> | null = null;
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
    if (this.inFlightRefreshPromise) {
      return this.inFlightRefreshPromise;
    }

    this.inFlightRefreshPromise = (async () => {
      try {
        const response = await refreshTransport.executeRefresh();
        const newToken = response.accessToken;
        tokenStore.set(newToken);
        return newToken;
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
