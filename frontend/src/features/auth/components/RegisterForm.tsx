import { zodResolver } from "@hookform/resolvers/zod";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { ApiError } from "@/api";

import { useRegister } from "../hooks/useRegister";
import { type RegisterFormValues, registerSchema } from "../schemas/registerSchema";

interface LocationState {
  from?: {
    pathname: string;
    search?: string;
  };
}

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [manualLoginRequired, setManualLoginRequired] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const { mutateAsync: registerUser, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await registerUser({
        email: values.email,
        password: values.password,
      });

      if (result.autoLoginSucceeded) {
        const destination = state?.from?.pathname
          ? `${state.from.pathname}${state.from.search || ""}`
          : "/trips";
        navigate(destination, { replace: true });
      } else {
        setManualLoginRequired(true);
      }
    } catch {
      // Handled by mutation error state
    }
  };

  const errorMessage = error
    ? error instanceof ApiError
      ? error.getDisplayMessage("Registration failed. Please check your details and try again.")
      : error.message || "An unexpected error occurred during registration."
    : null;

  if (manualLoginRequired) {
    return (
      <Stack spacing={2.5} sx={{ textAlign: "center", py: 1 }}>
        <Alert
          icon={<CheckCircleIcon fontSize="inherit" />}
          severity="success"
          sx={{ bgcolor: "rgba(190, 242, 100, 0.1)", color: "#bef264" }}
        >
          Registration successful! Please sign in with your new credentials to enter your cockpit.
        </Alert>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          component={RouterLink}
          to="/login"
          state={state}
          sx={{
            py: 1.3,
            fontWeight: 700,
            textTransform: "none",
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

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoComplete="new-password"
          error={!!errors.password}
          helperText={
            errors.password?.message ||
            "Minimum 8 characters with uppercase, lowercase, digit, and symbol"
          }
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
          {...register("password")}
        />

        <TextField
          label="Confirm Password"
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
            "Create Rider Profile"
          )}
        </Button>

        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Already have a profile?{" "}
            <Link
              component={RouterLink}
              to="/login"
              state={state}
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
