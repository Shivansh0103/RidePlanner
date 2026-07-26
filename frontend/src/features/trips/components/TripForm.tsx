import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

import { tripDefaults } from "../constants/tripDefaults";
import { type CreateTripRequest,createTripSchema } from "../schemas/createTripSchema";

type TripFormProps = {
  defaultValues?: CreateTripRequest;
  onSubmit: (data: CreateTripRequest) => void;
};

export default function TripForm({ defaultValues, onSubmit }: TripFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTripRequest>({
    resolver: zodResolver(createTripSchema),
    defaultValues: defaultValues ?? tripDefaults,
  });

  return (
    <form id="trip-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Trip Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            {...register("startDate")}
          />

          <TextField
            label="End Date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
            {...register("endDate")}
          />
        </Stack>

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register("description")}
        />
      </Stack>
    </form>
  );
}
