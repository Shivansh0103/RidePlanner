import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { TripStopFormValues } from "../validation/tripStopSchema";
import { tripStopSchema } from "../validation/tripStopSchema";

type TripStopFormProps = {
  defaultValues: TripStopFormValues;
  onSubmit: (values: TripStopFormValues) => void;
  isSubmitting?: boolean;
};

export default function TripStopForm({ defaultValues, onSubmit }: TripStopFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripStopSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form id="trip-stop-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ mt: 1 }}>
        <TextField
          autoFocus
          label="Stop Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
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
          label="Display Order"
          type="number"
          fullWidth
          error={!!errors.displayOrder}
          helperText={errors.displayOrder?.message}
          {...register("displayOrder")}
        />

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
