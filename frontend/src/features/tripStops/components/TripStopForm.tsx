import { zodResolver } from "@hookform/resolvers/zod";
import FlagIcon from "@mui/icons-material/Flag";
import HotelIcon from "@mui/icons-material/Hotel";
import NavigationIcon from "@mui/icons-material/Navigation";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { PlaceAutocomplete } from "@/shared/maps";
import type { PlaceLocation } from "@/shared/maps/types/place";

import { TRIP_STOP_CATEGORY_OPTIONS } from "../constants/tripStopCategoryOptions";
import type { TripStopFormValues } from "../schemas/tripStopSchema";
import { tripStopSchema } from "../schemas/tripStopSchema";
import { TripStopCategory } from "../types/tripStopCategory";

type TripStopFormProps = {
  defaultValues: TripStopFormValues;
  onSubmit: (values: TripStopFormValues) => void;
  onRedirectToAccommodation?: (values: TripStopFormValues) => void;
};

type StopRole = "START" | "WAYPOINT" | "STAY" | "DESTINATION";

export default function TripStopForm({ defaultValues, onSubmit, onRedirectToAccommodation }: TripStopFormProps) {
  // Determine initial role based on default values
  const initialRole: StopRole =
    defaultValues.category === TripStopCategory.Hotel
      ? "STAY"
      : defaultValues.arrivalDate && defaultValues.departureDate && defaultValues.arrivalDate !== defaultValues.departureDate
      ? "STAY"
      : "WAYPOINT";

  const [stopRole, setStopRole] = useState<StopRole>(initialRole);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TripStopFormValues>({
    resolver: zodResolver(tripStopSchema),
    defaultValues,
  });

  const category = watch("category");
  const arrivalDate = watch("arrivalDate");
  const departureDate = watch("departureDate");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedLocation: PlaceLocation | null =
    watch("placeId") && watch("formattedAddress")
      ? {
          placeId: watch("placeId") ?? null,
          displayName: watch("name"),
          formattedAddress: watch("formattedAddress"),
          coordinates: {
            latitude: watch("latitude") ?? null,
            longitude: watch("longitude") ?? null,
          },
        }
      : null;

  const handleRoleChange = (_: React.SyntheticEvent, newRole: StopRole) => {
    setStopRole(newRole);
    if (newRole === "START") {
      if (departureDate) setValue("arrivalDate", departureDate);
    } else if (newRole === "DESTINATION") {
      setValue("category", TripStopCategory.Destination);
      if (arrivalDate) setValue("departureDate", arrivalDate);
    } else if (newRole === "STAY") {
      setValue("category", TripStopCategory.Hotel);
    } else if (newRole === "WAYPOINT") {
      if (category === TripStopCategory.Hotel) {
        setValue("category", TripStopCategory.Checkpoint);
      }
      if (arrivalDate) setValue("departureDate", arrivalDate);
    }
  };

  const handleFormSubmit = (data: TripStopFormValues) => {
    let finalArrival = data.arrivalDate;
    let finalDeparture = data.departureDate;

    if (stopRole === "START") {
      finalArrival = data.departureDate;
    } else if (stopRole === "DESTINATION") {
      finalDeparture = data.arrivalDate;
    } else if (stopRole === "WAYPOINT") {
      finalDeparture = data.arrivalDate;
    }

    onSubmit({
      ...data,
      arrivalDate: finalArrival,
      departureDate: finalDeparture,
    });
  };

  return (
    <form id="trip-stop-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        {/* Stop Role Segmented Tabs */}
        <Box
          className="neo-inset"
          sx={{
            p: 0.5,
            borderRadius: 2,
            bgcolor: "#141313",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Tabs
            value={stopRole}
            onChange={handleRoleChange}
            variant="fullWidth"
            sx={{
              minHeight: 36,
              "& .MuiTabs-indicator": {
                bgcolor: "#6366f1",
                height: "100%",
                borderRadius: 1.5,
                zIndex: 0,
              },
              "& .MuiTab-root": {
                minHeight: 36,
                py: 0.5,
                fontSize: "0.68rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                color: "#94a3b8",
                zIndex: 1,
                textTransform: "uppercase",
                "&.Mui-selected": {
                  color: "#ffffff",
                },
              },
            }}
          >
            <Tab icon={<FlagIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Start Point" value="START" />
            <Tab icon={<NavigationIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Pass / Waypoint" value="WAYPOINT" />
            <Tab icon={<HotelIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Overnight Stay" value="STAY" />
            <Tab icon={<SportsScoreIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="End Point" value="DESTINATION" />
          </Tabs>
        </Box>

        {/* Hotel / Stay Notice & Shortcut */}
        {category === TripStopCategory.Hotel && (
          <Alert
            severity="info"
            icon={<HotelIcon sx={{ color: "#bef264" }} />}
            action={
              onRedirectToAccommodation && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => onRedirectToAccommodation(watch())}
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#bef264",
                  }}
                >
                  Full Lodging Editor →
                </Button>
              )
            }
            sx={{
              bgcolor: "rgba(190, 242, 100, 0.08)",
              border: "1px solid rgba(190, 242, 100, 0.3)",
              color: "#e2e8f0",
              fontSize: "0.76rem",
              borderRadius: 2,
            }}
          >
            <strong>Hotel / Lodging Selected:</strong> Saving will seamlessly register this stop and open the room booking & confirmation editor.
          </Alert>
        )}

        <TextField
          autoFocus
          label="Stop Name"
          placeholder="e.g. Manali Base Camp or Rohtang Pass"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />

        <PlaceAutocomplete
          value={selectedLocation}
          onPlaceSelected={(place) => {
            if (!place) {
              setValue("placeId", null);
              setValue("formattedAddress", "");
              setValue("latitude", null);
              setValue("longitude", null);
              return;
            }

            setValue("placeId", place.placeId);
            setValue("formattedAddress", place.formattedAddress);
            setValue("latitude", place.coordinates.latitude);
            setValue("longitude", place.coordinates.longitude);
            if (!watch("name")) {
              setValue("name", place.displayName);
            }
          }}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Stop Category"
              fullWidth
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              {TRIP_STOP_CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Dynamic Context-Aware Date Fields */}
        {stopRole === "START" && (
          <TextField
            label="Departure Date (Day of Departure)"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            error={!!errors.departureDate}
            helperText={errors.departureDate?.message || "Starting point of your expedition"}
            value={watch("departureDate")}
            onChange={(e) => {
              setValue("departureDate", e.target.value);
              setValue("arrivalDate", e.target.value);
            }}
          />
        )}

        {stopRole === "DESTINATION" && (
          <TextField
            label="Arrival Date (Day of Final Arrival)"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            error={!!errors.arrivalDate}
            helperText={errors.arrivalDate?.message || "Final destination of your expedition"}
            value={watch("arrivalDate")}
            onChange={(e) => {
              setValue("arrivalDate", e.target.value);
              setValue("departureDate", e.target.value);
            }}
          />
        )}

        {stopRole === "WAYPOINT" && (
          <TextField
            label="Transit Date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            error={!!errors.arrivalDate}
            helperText={errors.arrivalDate?.message || "Date of pass, fuel stop, or en-route waypoint"}
            value={watch("arrivalDate")}
            onChange={(e) => {
              setValue("arrivalDate", e.target.value);
              setValue("departureDate", e.target.value);
            }}
          />
        )}

        {stopRole === "STAY" && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Arrival / Check-in Date"
              type="date"
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
              error={!!errors.arrivalDate}
              helperText={errors.arrivalDate?.message}
              {...register("arrivalDate")}
            />

            <TextField
              label="Departure / Check-out Date"
              type="date"
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
              error={!!errors.departureDate}
              helperText={errors.departureDate?.message}
              {...register("departureDate")}
            />
          </Stack>
        )}

        <TextField
          label="Waypoint Notes & Instructions"
          placeholder="e.g. Fuel tank top-up, check tyre pressure, camera spot"
          multiline
          rows={3}
          fullWidth
          error={!!errors.notes}
          helperText={errors.notes?.message}
          {...register("notes")}
        />
      </Stack>
    </form>
  );
}
