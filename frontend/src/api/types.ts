export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly title: string;
  public readonly detail?: string;
  public readonly errors?: Record<string, string[]>;
  public readonly isNetworkError: boolean;
  public readonly raw?: unknown;

  constructor(params: {
    message: string;
    status: number;
    title: string;
    detail?: string;
    errors?: Record<string, string[]>;
    isNetworkError?: boolean;
    raw?: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.title = params.title;
    this.detail = params.detail;
    this.errors = params.errors;
    this.isNetworkError = params.isNetworkError ?? false;
    this.raw = params.raw;

    // Restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Returns the most descriptive single human-readable error message.
   * Priority:
   * 1. First validation error in `errors`
   * 2. `detail`
   * 3. `title`
   * 4. Fallback string
   */
  public getDisplayMessage(fallback = "An unexpected error occurred."): string {
    if (this.errors && Object.keys(this.errors).length > 0) {
      const firstKey = Object.keys(this.errors)[0];
      const firstMsg = this.errors[firstKey]?.[0];
      if (firstMsg) return firstMsg;
    }

    return this.detail || this.title || this.message || fallback;
  }
}
