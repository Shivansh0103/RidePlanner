import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { restoreSession } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const status = searchParams.get("status");
  const rawReturnUrl = searchParams.get("returnUrl");
  const errorParam = searchParams.get("error");

  // Strictly sanitize returnUrl to prevent open redirects
  const destination =
    rawReturnUrl &&
    rawReturnUrl.startsWith("/") &&
    !rawReturnUrl.startsWith("//") &&
    !rawReturnUrl.startsWith("/\\")
      ? rawReturnUrl
      : "/trips";

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      if (errorParam) {
        if (isMounted) {
          setErrorMessage(
            errorParam === "external_auth_failed"
              ? "Google authentication was cancelled or failed."
              : errorParam === "external_auth_missing_claims"
                ? "Google did not provide the required email or identifier claims."
                : `Authentication error: ${errorParam}`
          );
        }
        return;
      }

      if (status === "success") {
        try {
          // Bootstrap session via POST /api/auth/refresh using HttpOnly cookie
          await restoreSession();
          if (isMounted) {
            navigate(destination, { replace: true });
          }
        } catch (err) {
          if (isMounted) {
            console.error("Failed to restore session following Google callback:", err);
            setErrorMessage("Failed to establish session. Please try signing in again.");
          }
        }
      } else {
        if (isMounted) {
          setErrorMessage("Invalid authentication response received from login provider.");
        }
      }
    }

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [status, errorParam, destination, navigate, restoreSession]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0b0f19",
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 70%), linear-gradient(180deg, #0b0f19 0%, #121416 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: "#141824",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow:
              "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
            textAlign: "center",
          }}
        >
          <Stack spacing={3} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2.5,
                bgcolor: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                boxShadow: "0 0 25px rgba(99, 102, 241, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#818cf8",
              }}
            >
              <TwoWheelerIcon sx={{ fontSize: 30 }} />
            </Box>

            {errorMessage ? (
              <>
                <Alert
                  severity="error"
                  sx={{
                    width: "100%",
                    bgcolor: "rgba(248, 113, 113, 0.1)",
                    color: "#f87171",
                    textAlign: "left",
                  }}
                >
                  {errorMessage}
                </Alert>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    py: 1.2,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Return to Login
                </Button>
              </>
            ) : (
              <>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#f8fafc",
                      mb: 1,
                    }}
                  >
                    Authenticating Rider Cockpit
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Securing credentials and initializing navigation telemetry...
                  </Typography>
                </Box>

                <CircularProgress
                  size={36}
                  thickness={4}
                  sx={{
                    color: "#bef264",
                    my: 2,
                  }}
                />
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthCallbackPage;
