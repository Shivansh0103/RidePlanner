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
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";

import { ApiError } from "@/api";

import { authApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { AuthLayout } from "../layouts/AuthLayout";
import type { ExternalLinkInfo } from "../types";

export const LinkAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { linkExternalAccount } = useAuth();

  const ticket = searchParams.get("ticket");

  const [linkInfo, setLinkInfo] = useState<ExternalLinkInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [infoError, setInfoError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchInfo() {
      if (!ticket) {
        if (isMounted) {
          setInfoError("No account linking ticket was provided in the request URL.");
          setLoadingInfo(false);
        }
        return;
      }

      try {
        const info = await authApi.getLinkInfo(ticket);
        if (isMounted) {
          setLinkInfo(info);
          setLoadingInfo(false);
        }
      } catch (err) {
        if (isMounted) {
          const msg =
            err instanceof ApiError
              ? err.getDisplayMessage("Failed to validate account linking ticket.")
              : "Invalid or expired account linking ticket.";
          setInfoError(msg);
          setLoadingInfo(false);
        }
      }
    }

    fetchInfo();

    return () => {
      isMounted = false;
    };
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !password) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await linkExternalAccount({
        linkTicket: ticket,
        password,
      });
      navigate("/trips", { replace: true });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.getDisplayMessage("Failed to link account. Please verify your password.")
          : "An unexpected error occurred during account linking.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInfo) {
    return (
      <AuthLayout title="Account Linking" subtitle="Verifying link ticket...">
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={36} sx={{ color: "#bef264" }} />
        </Box>
      </AuthLayout>
    );
  }

  if (infoError || !ticket) {
    return (
      <AuthLayout title="Account Linking" subtitle="Ticket Validation Failed">
        <Stack spacing={2.5}>
          <Alert severity="error" sx={{ bgcolor: "rgba(248, 113, 113, 0.1)", color: "#f87171" }}>
            {infoError || "Invalid account linking ticket."}
          </Alert>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.3, fontWeight: 700, textTransform: "none" }}
          >
            Return to Login
          </Button>
        </Stack>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Link Existing Account"
      subtitle={`Confirm password to link your ${linkInfo?.provider ?? "external"} login`}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          {submitError && (
            <Alert severity="error" sx={{ bgcolor: "rgba(248, 113, 113, 0.1)", color: "#f87171" }}>
              {submitError}
            </Alert>
          )}

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(99, 102, 241, 0.08)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#e2e8f0", lineHeight: 1.6 }}>
              A RidePlanner account already exists for{" "}
              <Box component="span" sx={{ color: "#bef264", fontWeight: 700 }}>
                {linkInfo?.maskedEmail}
              </Box>
              . To link your {linkInfo?.provider} account for one-click login in the future, please
              confirm your current account password.
            </Typography>
          </Box>

          <TextField
            label="Account Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
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
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={submitting || !password.trim()}
            sx={{
              py: 1.3,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
            }}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "#ffffff" }} />
            ) : (
              "Confirm & Link Account"
            )}
          </Button>

          <Box sx={{ textAlign: "center", pt: 1 }}>
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                color: "text.secondary",
                fontSize: "0.85rem",
                textDecoration: "none",
                "&:hover": { color: "#bef264", textDecoration: "underline" },
              }}
            >
              Cancel and Return to Login
            </Link>
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default LinkAccountPage;
