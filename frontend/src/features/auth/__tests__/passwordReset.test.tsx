import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { authApi } from "../api/authApi";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

describe("Password Reset UI Components", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.restoreAllMocks();
  });

  function renderWithProviders(ui: ReactNode) {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  describe("ForgotPasswordForm", () => {
    it("renders email field and displays validation error when empty", async () => {
      renderWithProviders(<ForgotPasswordForm />);

      const submitButton = screen.getByRole("button", { name: /Transmit Reset Link/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      });
    });

    it("displays error when email format is invalid", async () => {
      renderWithProviders(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitButton = screen.getByRole("button", { name: /Transmit Reset Link/i });

      await userEvent.type(emailInput, "not-an-email");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it("submits valid email and displays anti-enumeration success message", async () => {
      const forgotPasswordSpy = vi.spyOn(authApi, "forgotPassword").mockResolvedValue({
        message: "If an account exists with that email address, password reset instructions have been sent.",
      });

      renderWithProviders(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitButton = screen.getByRole("button", { name: /Transmit Reset Link/i });

      await userEvent.type(emailInput, "rider@example.com");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(forgotPasswordSpy).toHaveBeenCalledWith({ email: "rider@example.com" });
        expect(
          screen.getByText(/If an account exists with that email address, password reset instructions have been sent./i)
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Return to Cockpit Login/i })).toBeInTheDocument();
      });
    });

    it("displays error alert when submission fails", async () => {
      vi.spyOn(authApi, "forgotPassword").mockRejectedValue(new Error("Network connection error"));

      renderWithProviders(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitButton = screen.getByRole("button", { name: /Transmit Reset Link/i });

      await userEvent.type(emailInput, "rider@example.com");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Network connection error/i)).toBeInTheDocument();
      });
    });
  });

  describe("ResetPasswordForm", () => {
    it("renders invalid link state when userId or token is missing", () => {
      renderWithProviders(<ResetPasswordForm userId={null} token={null} />);

      expect(screen.getByText(/Invalid or Missing Reset Link/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Request New Link/i })).toBeInTheDocument();
      expect(screen.queryByLabelText(/New Password/i)).not.toBeInTheDocument();
    });

    it("displays validation error when passwords do not match", async () => {
      renderWithProviders(
        <ResetPasswordForm userId="3fa85f64-5717-4562-b3fc-2c963f66afa6" token="sample-token" />
      );

      const newPasswordInput = screen.getByLabelText(/^New Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm New Password/i);
      const submitButton = screen.getByRole("button", { name: /Set New Password/i });

      await userEvent.type(newPasswordInput, "SecurePass123!");
      await userEvent.type(confirmPasswordInput, "DifferentPass123!");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });

    it("displays validation error when password is too short", async () => {
      renderWithProviders(
        <ResetPasswordForm userId="3fa85f64-5717-4562-b3fc-2c963f66afa6" token="sample-token" />
      );

      const newPasswordInput = screen.getByLabelText(/^New Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm New Password/i);
      const submitButton = screen.getByRole("button", { name: /Set New Password/i });

      await userEvent.type(newPasswordInput, "123");
      await userEvent.type(confirmPasswordInput, "123");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
      });
    });

    it("submits valid new password and renders completion message", async () => {
      const resetPasswordSpy = vi.spyOn(authApi, "resetPassword").mockResolvedValue({
        message: "Password has been reset successfully. You may now log in with your new credentials.",
      });

      renderWithProviders(
        <ResetPasswordForm userId="3fa85f64-5717-4562-b3fc-2c963f66afa6" token="valid-token-abc" />
      );

      const newPasswordInput = screen.getByLabelText(/^New Password/i);
      const confirmPasswordInput = screen.getByLabelText(/Confirm New Password/i);
      const submitButton = screen.getByRole("button", { name: /Set New Password/i });

      await userEvent.type(newPasswordInput, "BrandNewSecret123!");
      await userEvent.type(confirmPasswordInput, "BrandNewSecret123!");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(resetPasswordSpy).toHaveBeenCalledWith({
          userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          token: "valid-token-abc",
          newPassword: "BrandNewSecret123!",
        });
        expect(screen.getByText(/Password Reset Complete/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Proceed to Login/i })).toBeInTheDocument();
      });
    });
  });
});
