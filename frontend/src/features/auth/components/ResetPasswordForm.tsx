import { zodResolver } from "@hookform/resolvers/zod";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";

import { ApiError } from "@/api";

import { useResetPassword } from "../hooks/useResetPassword";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "../schemas/resetPasswordSchema";

interface ResetPasswordFormProps {
  userId?: string | null;
  token?: string | null;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  userId,
  token,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const { mutateAsync: resetPassword, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!userId || !token) {
      return;
    }

    try {
      await resetPassword({
        userId,
        token,
        newPassword: values.newPassword,
      });
      setIsResetComplete(true);
    } catch {
      // Handled by mutation error state
    }
  };

  const errorMessage = error
    ? error instanceof ApiError
      ? error.getDisplayMessage("Failed to reset password. The link may have expired or is invalid.")
      : error.message || "An unexpected error occurred."
    : null;

  // Invalid or missing link state
  if (!userId || !token) {
    return (
      <Stack spacing={3} sx={{ textAlign: "center", py: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "#f87171",
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 48 }} />
        </Box>

        <Typography variant="body1" sx={{ color: "#f8fafc", fontWeight: 600 }}>
          Invalid or Missing Reset Link
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
          This password reset link is incomplete or malformed. Please request a new link to regain access.
        </Typography>

        <Button
          component={RouterLink}
          to="/forgot-password"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{
            py: 1.3,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
          }}
        >
          Request New Link
        </Button>
      </Stack>
    );
  }

  // Successful reset state
  if (isResetComplete) {
    return (
      <Stack spacing={3} sx={{ textAlign: "center", py: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "#bef264",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48 }} />
        </Box>

        <Typography variant="body1" sx={{ color: "#f8fafc", fontWeight: 600 }}>
          Password Reset Complete
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
          Your password has been reset successfully and all previous sessions have been secured. You may now log in with your new credentials.
        </Typography>

        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{
            py: 1.3,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
          }}
        >
          Proceed to Login
        </Button>
      </Stack>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        {errorMessage && (
          <Alert severity="error" sx={{ bgcolor: "rgba(248, 113, 113, 0.1)", color: "#f87171" }}>
            {errorMessage}
          </Alert>
        )}

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please establish a new, strong password for your rider account.
        </Typography>

        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoFocus
          autoComplete="new-password"
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          disabled={isPending}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register("newPassword")}
        />

        <TextField
          label="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={isPending}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isPending}
          sx={{
            py: 1.3,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
          }}
        >
          {isPending ? (
            <CircularProgress size={24} sx={{ color: "#ffffff" }} />
          ) : (
            "Set New Password"
          )}
        </Button>

        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Remembered your credentials?{" "}
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                color: "#bef264",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
