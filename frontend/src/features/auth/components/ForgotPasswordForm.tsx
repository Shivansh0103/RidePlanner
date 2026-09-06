import { zodResolver } from "@hookform/resolvers/zod";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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

import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "../schemas/forgotPasswordSchema";

export const ForgotPasswordForm: React.FC = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { mutateAsync: forgotPassword, isPending, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values);
      setSubmittedEmail(values.email);
    } catch {
      // Handled by mutation error state
    }
  };

  const errorMessage = error
    ? error instanceof ApiError
      ? error.getDisplayMessage("Unable to request password reset. Please try again.")
      : error.message || "An unexpected error occurred."
    : null;

  if (submittedEmail) {
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

        <Typography variant="body1" sx={{ color: "#f8fafc", fontWeight: 500 }}>
          If an account exists with that email address, password reset instructions have been sent.
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
          Please check your inbox (and spam folder) for a recovery link. The link expires in 2 hours.
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
          Return to Cockpit Login
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
          Enter the email address registered with your rider account. We will transmit a secure recovery link.
        </Typography>

        <TextField
          label="Email Address"
          fullWidth
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isPending}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          {...register("email")}
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
            "Transmit Reset Link"
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
