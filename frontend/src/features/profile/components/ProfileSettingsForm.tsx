import { zodResolver } from "@hookform/resolvers/zod";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PublicIcon from "@mui/icons-material/Public";
import SaveIcon from "@mui/icons-material/Save";
import SpeedIcon from "@mui/icons-material/Speed";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  type ProfileFormData,
  profileSchema,
  SUPPORTED_CURRENCIES,
  SUPPORTED_DISTANCE_UNITS,
} from "../schemas/profileSchema";
import type { UserProfile } from "../types/userProfile";

interface ProfileSettingsFormProps {
  profile: UserProfile;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileSettingsForm: React.FC<ProfileSettingsFormProps> = ({
  profile,
  onSubmit,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      preferredCurrencyCode: profile.preferredCurrencyCode,
      distanceUnit: profile.distanceUnit,
      defaultVehicleName: profile.defaultVehicleName ?? null,
      defaultTankCapacityLitres: profile.defaultTankCapacityLitres ?? null,
      defaultFuelEfficiencyKmPerLitre: profile.defaultFuelEfficiencyKmPerLitre ?? null,
    },
  });

  useEffect(() => {
    reset({
      preferredCurrencyCode: profile.preferredCurrencyCode,
      distanceUnit: profile.distanceUnit,
      defaultVehicleName: profile.defaultVehicleName ?? null,
      defaultTankCapacityLitres: profile.defaultTankCapacityLitres ?? null,
      defaultFuelEfficiencyKmPerLitre: profile.defaultFuelEfficiencyKmPerLitre ?? null,
    });
  }, [profile, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={4}>
        {/* Section 1: Travel & Localization */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            bgcolor: "rgba(15, 23, 42, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PublicIcon sx={{ color: "#818cf8", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                  Travel & Localization Preferences
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Configure your default monetary currency and distance presentation units for new expeditions.
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.06)" }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="preferredCurrencyCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Preferred Currency"
                      error={Boolean(errors.preferredCurrencyCode)}
                      helperText={
                        errors.preferredCurrencyCode?.message ||
                        "Default currency assigned to new expedition budgets."
                      }
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    >
                      {SUPPORTED_CURRENCIES.map((code) => (
                        <MenuItem key={code} value={code}>
                          {code === "INR" && "₹ INR — Indian Rupee"}
                          {code === "USD" && "$ USD — US Dollar"}
                          {code === "EUR" && "€ EUR — Euro"}
                          {code === "GBP" && "£ GBP — British Pound"}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="distanceUnit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Distance Presentation Unit"
                      error={Boolean(errors.distanceUnit)}
                      helperText={
                        errors.distanceUnit?.message ||
                        "Preferred unit for viewing route distances and itinerary waypoints."
                      }
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    >
                      {SUPPORTED_DISTANCE_UNITS.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit === "Kilometers" ? "Kilometers (km)" : "Miles (mi)"}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Section 2: Default Vehicle Profile */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            bgcolor: "rgba(15, 23, 42, 0.6)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DirectionsBikeIcon sx={{ color: "#38bdf8", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                  Default Vehicle Profile
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Configure your primary vehicle to auto-populate your Smart Fuel Cost Calculator.
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.06)" }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="defaultVehicleName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val.trim() === "" ? null : val);
                      }}
                      fullWidth
                      label="Vehicle Model / Nickname"
                      placeholder="e.g. Royal Enfield Himalayan 450, Honda City, Tenere 700"
                      error={Boolean(errors.defaultVehicleName)}
                      helperText={
                        errors.defaultVehicleName?.message ||
                        "Optional label identifying your motorcycle, car, or overland vehicle."
                      }
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="defaultTankCapacityLitres"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                      type="number"
                      fullWidth
                      label="Fuel Tank Capacity"
                      placeholder="e.g. 17"
                      error={Boolean(errors.defaultTankCapacityLitres)}
                      helperText={
                        errors.defaultTankCapacityLitres?.message ||
                        "Usable tank volume in litres (optional)."
                      }
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                <LocalGasStationIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700 }}>
                                  L
                                </Typography>
                              </Stack>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="defaultFuelEfficiencyKmPerLitre"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                      type="number"
                      fullWidth
                      label="Default Fuel Efficiency"
                      placeholder="e.g. 28.5"
                      error={Boolean(errors.defaultFuelEfficiencyKmPerLitre)}
                      helperText={
                        errors.defaultFuelEfficiencyKmPerLitre?.message ||
                        "Auto-populates the vehicle mileage in your Smart Fuel Calculator."
                      }
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                <SpeedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                                <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700 }}>
                                  km/L
                                </Typography>
                              </Stack>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Stack direction="row" sx={{ justifyContent: "flex-end", pt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !isDirty}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            className="glow-indigo"
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              fontWeight: 800,
              px: 4,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            {isLoading ? "Saving Preferences..." : "Save Preferences"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
