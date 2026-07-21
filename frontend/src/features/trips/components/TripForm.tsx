import { Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { tripSchema, type TripFormValues } from "../schemas/tripSchema";

type TripFormProps = {
  defaultValues?: TripFormValues;
  onSubmit: (data: TripFormValues) => void;
};

export default function TripForm({ defaultValues, onSubmit }: TripFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: defaultValues ?? {
      name: "",
    },
  });

  return (
    <form id="trip-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          label="Trip Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />
      </Stack>
    </form>
  );
}
