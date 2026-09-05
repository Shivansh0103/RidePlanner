import TuneIcon from "@mui/icons-material/Tune";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

import { BreadcrumbsBar } from "@/shared/components";

import { ProfileSettingsForm } from "../components/ProfileSettingsForm";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { ProfileFormData } from "../schemas/profileSchema";

export const SettingsPage: React.FC = () => {
  const { data: profile, isLoading, isError, error, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleSave = async (data: ProfileFormData) => {
    await updateProfileMutation.mutateAsync({
      preferredCurrencyCode: data.preferredCurrencyCode,
      distanceUnit: data.distanceUnit,
      defaultVehicleName: data.defaultVehicleName,
      defaultTankCapacityLitres: data.defaultTankCapacityLitres,
      defaultFuelEfficiencyKmPerLitre: data.defaultFuelEfficiencyKmPerLitre,
    });
  };

  return (
    <Container maxWidth="md" sx={{ pb: 8 }} className="animate-fade-in">
      <Stack spacing={3}>
        <BreadcrumbsBar
          items={[
            { label: "Expeditions", to: "/trips" },
            { label: "Rider Settings" },
          ]}
        />

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3.5,
            bgcolor: "rgba(11, 15, 23, 0.7)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Stack spacing={3.5}>
            {/* Header */}
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
                }}
              >
                <TuneIcon sx={{ color: "#ffffff", fontSize: 26 }} />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontFamily: '"Outfit", sans-serif',
                    color: "#f8fafc",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Rider Settings & Expedition Preferences
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  Configure your default trip currencies, distance units, and vehicle efficiency profile.
                </Typography>
              </Box>
            </Stack>

            {/* Error state */}
            {isError && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={() => refetch()}>
                    Retry
                  </Button>
                }
              >
                {error instanceof Error ? error.message : "Failed to load rider profile preferences."}
              </Alert>
            )}

            {/* Loading state */}
            {isLoading && (
              <Stack spacing={3}>
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
              </Stack>
            )}

            {/* Form */}
            {profile && (
              <ProfileSettingsForm
                profile={profile}
                onSubmit={handleSave}
                isLoading={updateProfileMutation.isPending}
              />
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SettingsPage;
