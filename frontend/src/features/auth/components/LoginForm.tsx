import { zodResolver } from "@hookform/resolvers/zod";
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

import { useLogin } from "../hooks/useLogin";
import { type LoginFormValues, loginSchema } from "../schemas/loginSchema";

interface LocationState {
  from?: {
    pathname: string;
    search?: string;
  };
}

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const { mutateAsync: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      const destination = state?.from?.pathname
        ? `${state.from.pathname}${state.from.search || ""}`
        : "/trips";
      navigate(destination, { replace: true });
    } catch {
      // Handled by mutation error state
    }
  };

  const errorMessage = error
    ? error instanceof ApiError
      ? error.getDisplayMessage("Invalid credentials. Please verify your email and password.")
      : error.message || "An unexpected error occurred during login."
    : null;

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
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
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
            "Enter Cockpit"
          )}
        </Button>

        <Box sx={{ textAlign: "center", pt: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Don't have a rider profile?{" "}
            <Link
              component={RouterLink}
              to="/register"
              state={state}
              sx={{
                color: "#bef264",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
