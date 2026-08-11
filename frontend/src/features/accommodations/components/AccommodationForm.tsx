import { zodResolver } from "@hookform/resolvers/zod";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Box,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { PlaceAutocomplete } from "@/shared/maps";
import type { PlaceLocation } from "@/shared/maps/types";

import { ACCOMMODATION_TYPE_OPTIONS } from "../constants/accommodationTypeOptions";
import type { AccommodationFormValues } from "../validation/accommodationSchema";
import { accommodationSchema } from "../validation/accommodationSchema";

interface AccommodationFormProps {
  defaultValues: AccommodationFormValues;
  onSubmit: (values: AccommodationFormValues) => void;
}

export default function AccommodationForm({
  defaultValues,
  onSubmit,
}: AccommodationFormProps) {
  const [isManualAddress, setIsManualAddress] = useState(
    !defaultValues.placeId && !!defaultValues.formattedAddress
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
    setIsManualAddress(!defaultValues.placeId && !!defaultValues.formattedAddress);
  }, [defaultValues, reset]);

  const placeId = watch("placeId");
  const formattedAddress = watch("formattedAddress");
  const name = watch("name");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const selectedLocation: PlaceLocation | null =
    placeId && formattedAddress
      ? {
          placeId,
          displayName: name,
          formattedAddress,
          coordinates: {
            latitude: latitude ?? null,
            longitude: longitude ?? null,
          },
        }
      : null;

  const handlePlaceSelect = (place: PlaceLocation | null) => {
    if (!place) {
      setValue("placeId", null);
      setValue("formattedAddress", "");
      setValue("latitude", null);
      setValue("longitude", null);
      return;
    }

    setValue("placeId", place.placeId);
    if (!watch("name")) {
      setValue("name", place.displayName);
    }
    setValue("formattedAddress", place.formattedAddress);
    setValue("latitude", place.coordinates.latitude);
    setValue("longitude", place.coordinates.longitude);
  };

  return (
    <form id="accommodation-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        {/* Enrichment Mode Toggle Indicator */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justify: "space-between",
            bgcolor: "action.hover",
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {placeId ? (
              <Chip
                icon={<AutoAwesomeIcon color="primary" fontSize="small" />}
                label="Google Places Enriched"
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : (
              <Chip
                icon={<EditNoteIcon fontSize="small" />}
                label="Manual Stay Entry"
                size="small"
                variant="outlined"
              />
            )}
          </Stack>

          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 600 }}
            onClick={() => setIsManualAddress(!isManualAddress)}
          >
            {isManualAddress
              ? "Use Google Places Search"
              : "Enter Location Manually"}
          </Typography>
        </Box>

        {/* Location Selector / Manual Address */}
        {!isManualAddress ? (
          <PlaceAutocomplete
            value={selectedLocation}
            onPlaceSelected={handlePlaceSelect}
          />
        ) : (
          <TextField
            label="Formatted Address"
            fullWidth
            placeholder="e.g. Near Mall Road, Manali, Himachal Pradesh"
            error={!!errors.formattedAddress}
            helperText={errors.formattedAddress?.message}
            {...register("formattedAddress")}
          />
        )}

        {/* Property Name & Type */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center" }}>
          <TextField
            label="Property / Stay Name"
            fullWidth
            placeholder="e.g. The Grand Manali"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Accommodation Type"
                fullWidth
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {ACCOMMODATION_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <opt.icon fontSize="small" />
                      <span>{opt.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>

        {/* Stay Dates */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Check-In Date"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.checkInDate}
            helperText={errors.checkInDate?.message}
            {...register("checkInDate")}
          />

          <TextField
            label="Check-Out Date"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.checkOutDate}
            helperText={errors.checkOutDate?.message}
            {...register("checkOutDate")}
          />
        </Stack>

        {/* Stay Times (Optional) */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Check-In Time (Optional)"
            type="time"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.checkInTime}
            helperText={errors.checkInTime?.message}
            {...register("checkInTime")}
          />

          <TextField
            label="Check-Out Time (Optional)"
            type="time"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.checkOutTime}
            helperText={errors.checkOutTime?.message}
            {...register("checkOutTime")}
          />
        </Stack>

        {/* Reservation & Contact Info */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Confirmation / Booking #"
            fullWidth
            placeholder="e.g. RES-982341"
            error={!!errors.confirmationNumber}
            helperText={errors.confirmationNumber?.message}
            {...register("confirmationNumber")}
          />

          <TextField
            label="Contact Person Name"
            fullWidth
            placeholder="e.g. Front Desk / Host Name"
            error={!!errors.contactName}
            helperText={errors.contactName?.message}
            {...register("contactName")}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Contact Phone"
            fullWidth
            placeholder="e.g. +91 98765 43210"
            error={!!errors.contactPhone}
            helperText={errors.contactPhone?.message}
            {...register("contactPhone")}
          />

          <TextField
            label="Property Website"
            fullWidth
            placeholder="e.g. https://hotelwebsite.com"
            error={!!errors.website}
            helperText={errors.website?.message}
            {...register("website")}
          />
        </Stack>

        {/* Cost & Display Order */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Estimated Stay Cost (₹)"
            type="number"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              },
            }}
            error={!!errors.cost}
            helperText={
              errors.cost?.message ||
              "Automatically synchronizes into Budget under Accommodation category."
            }
            {...register("cost", { valueAsNumber: true })}
          />
        </Stack>

        {/* Booking Notes */}
        <TextField
          label="Booking & Stay Notes"
          placeholder="e.g. Breakfast included, late check-in requested, parking in rear"
          multiline
          rows={3}
          fullWidth
          error={!!errors.bookingNotes}
          helperText={errors.bookingNotes?.message}
          {...register("bookingNotes")}
        />
      </Stack>
    </form>
  );
}
