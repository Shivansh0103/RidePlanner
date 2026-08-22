import { describe, expect, it } from "vitest";

import { ApiError } from "../types";

describe("ApiError Domain Model", () => {
  it("creates an ApiError instance with default message and status", () => {
    const error = new ApiError({
      message: "Something went wrong",
      status: 500,
      title: "Server Error",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(500);
    expect(error.title).toBe("Server Error");
    expect(error.isNetworkError).toBe(false);
  });

  it("prioritizes field validation errors in getDisplayMessage()", () => {
    const error = new ApiError({
      message: "Validation failed",
      status: 400,
      title: "One or more validation errors occurred",
      errors: {
        StartDate: ["Start date is required."],
        EndDate: ["End date cannot be in the past."],
      },
    });

    expect(error.getDisplayMessage()).toBe("Start date is required.");
  });

  it("falls back to detail string if no field validation errors exist", () => {
    const error = new ApiError({
      message: "Not found",
      status: 404,
      title: "Resource Not Found",
      detail: "Trip with ID 123 was not found in the database.",
    });

    expect(error.getDisplayMessage()).toBe("Trip with ID 123 was not found in the database.");
  });

  it("handles network error instantiation", () => {
    const error = new ApiError({
      message: "Unable to connect to the server.",
      status: 0,
      title: "Network Error",
      isNetworkError: true,
    });

    expect(error.isNetworkError).toBe(true);
    expect(error.status).toBe(0);
    expect(error.getDisplayMessage()).toBe("Unable to connect to the server.");
  });
});
