import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { TRIP_STOP_CATEGORY_OPTIONS } from "../constants/tripStopCategoryOptions";
import type { TripStopFormValues } from "../validation/tripStopSchema";
import { tripStopSchema } from "../validation/tripStopSchema";

type TripStopFormProps = {
  defaultValues: TripStopFormValues;
  onSubmit: (values: TripStopFormValues) => void;
};

export default function TripStopForm({ defaultValues, onSubmit }: TripStopFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripStopSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.name,
    defaultValues.category,
    defaultValues.arrivalDate,
    defaultValues.departureDate,
    defaultValues.notes,
    defaultValues,
    reset,
  ]);

  return (
    <form
      id="trip-stop-form"
      onSubmit={handleSubmit((data) => onSubmit(data as TripStopFormValues))}
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        <TextField
          autoFocus
          label="Stop Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Category"
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

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Arrival Date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={!!errors.arrivalDate}
            helperText={errors.arrivalDate?.message}
            {...register("arrivalDate")}
          />

          <TextField
            label="Departure Date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={!!errors.departureDate}
            helperText={errors.departureDate?.message}
            {...register("departureDate")}
          />
        </Stack>

        <TextField
          label="Notes"
          placeholder="Optional notes"
          multiline
          rows={4}
          fullWidth
          error={!!errors.notes}
          helperText={errors.notes?.message}
          {...register("notes")}
        />
      </Stack>
    </form>
  );
}
