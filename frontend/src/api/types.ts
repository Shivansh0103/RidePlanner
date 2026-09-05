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
   * 3. `message`
   * 4. `title`
   * 5. Fallback string
   */
  public getDisplayMessage(fallback = "An unexpected error occurred."): string {
    if (this.errors && Object.keys(this.errors).length > 0) {
      const firstKey = Object.keys(this.errors)[0];
      const firstMsg = this.errors[firstKey]?.[0];
      if (firstMsg) return firstMsg;
    }

    return this.detail || this.message || this.title || fallback;
  }
}

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

/**
 * Normalizes an unknown Axios error or standard error into an ApiError.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  const axiosError = error as {
    isAxiosError?: boolean;
    code?: string;
    message?: string;
    response?: {
      status: number;
      data: unknown;
    };
  };

  // Case 1: No response received (Network error, offline, timeout, CORS)
  if (!axiosError?.response) {
    const isTimeout =
      axiosError?.code === "ECONNABORTED" ||
      (axiosError?.message && axiosError.message.toLowerCase().includes("timeout"));

    return new ApiError({
      message: isTimeout
        ? "Request timed out. Please try again."
        : "Unable to connect to the server. Please check your network connection.",
      status: 0,
      title: isTimeout ? "Request Timeout" : "Network Error",
      isNetworkError: true,
      raw: error,
    });
  }

  // Case 2: Server responded with an HTTP error status (4xx / 5xx)
  const { status, data } = axiosError.response;
  const problem = data as ProblemDetails | undefined;

  const legacyError =
    typeof data === "object" && data !== null
      ? ((data as { Error?: string }).Error ??
        (data as { error?: string }).error)
      : undefined;

  const title =
    problem?.title ||
    (status >= 500 ? "Server Error" : "Request Failed");
  const detail = problem?.detail || legacyError;
  const errors = problem?.errors;

  let message = detail || title;
  if (errors && Object.keys(errors).length > 0) {
    const firstField = Object.keys(errors)[0];
    const firstError = errors[firstField]?.[0];
    if (firstError) {
      message = firstError;
    }
  }

  return new ApiError({
    message,
    status,
    title,
    detail,
    errors,
    raw: data,
  });
}

