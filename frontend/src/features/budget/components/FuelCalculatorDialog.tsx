import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  fuelCalculatorSchema,
  type FuelCalculatorRequest,
} from "../schemas/fuelCalculatorSchema";

interface FuelCalculatorDialogProps {
  open: boolean;
  routeDistanceKm: number;
  onClose: () => void;
  onSubmit: (data: FuelCalculatorRequest) => Promise<void>;
  isLoading: boolean;
}

export default function FuelCalculatorDialog({
  open,
  routeDistanceKm,
  onClose,
  onSubmit,
  isLoading,
}: FuelCalculatorDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FuelCalculatorRequest>({
    resolver: zodResolver(fuelCalculatorSchema),
    defaultValues: {
      routeDistanceKm: routeDistanceKm || 0,
      vehicleMileage: 15,
      fuelPricePerLiter: 100,
    },
  });

  useEffect(() => {
    if (open) {
      setValue("routeDistanceKm", routeDistanceKm || 0);
    }
  }, [open, routeDistanceKm, setValue]);

  const handleFormSubmit = async (data: FuelCalculatorRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Smart Fuel Cost Calculator</DialogTitle>
        <DialogContent>
          {routeDistanceKm <= 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No route distance calculated yet. Please add at least 2 stops to
              calculate fuel cost.
            </Alert>
          ) : (
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 1.5,
                backgroundColor: "action.hover",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Calculated Route Distance
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                {routeDistanceKm.toLocaleString("en-IN", {
                  maximumFractionDigits: 1,
                })}{" "}
                km
              </Typography>
            </Box>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Vehicle Mileage (km/L)"
            type="number"
            fullWidth
            variant="outlined"
            placeholder="e.g. 15"
            {...register("vehicleMileage", { valueAsNumber: true })}
            error={Boolean(errors.vehicleMileage)}
            helperText={errors.vehicleMileage?.message}
            disabled={isLoading || routeDistanceKm <= 0}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Fuel Price (₹/L)"
            type="number"
            fullWidth
            variant="outlined"
            placeholder="e.g. 100"
            {...register("fuelPricePerLiter", { valueAsNumber: true })}
            error={Boolean(errors.fuelPricePerLiter)}
            helperText={errors.fuelPricePerLiter?.message}
            disabled={isLoading || routeDistanceKm <= 0}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || routeDistanceKm <= 0}
          >
            Calculate & Apply
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
