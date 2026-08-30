import { zodResolver } from "@hookform/resolvers/zod";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  type FuelCalculatorRequest,
  fuelCalculatorSchema,
} from "../schemas/fuelCalculatorSchema";

interface FuelCalculatorDialogProps {
  open: boolean;
  routeDistanceKm: number;
  onClose: () => void;
  onSubmit: (data: FuelCalculatorRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function FuelCalculatorDialog({
  open,
  routeDistanceKm,
  onClose,
  onSubmit,
}: FuelCalculatorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FuelCalculatorRequest>({
    resolver: zodResolver(fuelCalculatorSchema),
    defaultValues: {
      routeDistanceKm: routeDistanceKm || 0,
      vehicleMileage: 15,
      fuelPricePerLiter: 100,
    },
  });

  const mileage = watch("vehicleMileage") || 15;
  const price = watch("fuelPricePerLiter") || 100;
  const computedFuelLiters = mileage > 0 && routeDistanceKm > 0 ? routeDistanceKm / mileage : 0;
  const computedTotalCost = Math.round(computedFuelLiters * price);

  useEffect(() => {
    if (open) {
      setValue("routeDistanceKm", routeDistanceKm || 0);
      setIsSubmitting(false);
    }
  }, [open, routeDistanceKm, setValue]);

  const handleFormSubmit = async (data: FuelCalculatorRequest) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <LocalGasStationIcon sx={{ color: "#38bdf8" }} />
            <span>Smart Fuel Cost Calculator</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {routeDistanceKm <= 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No route distance calculated yet. Please plot your waypoints in the Itinerary tab to
              auto-calculate fuel cost.
            </Alert>
          ) : (
            <Box
              className="neo-inset"
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                bgcolor: "#141313",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Route Distance
                  </Typography>
                  <Typography className="font-mono" variant="h6" sx={{ fontWeight: 800, color: "#38bdf8" }}>
                    {routeDistanceKm.toLocaleString("en-IN", {
                      maximumFractionDigits: 1,
                    })}{" "}
                    km
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Estimated Fuel Need
                  </Typography>
                  <Typography className="font-mono" variant="h6" sx={{ fontWeight: 800, color: "#bef264" }}>
                    ₹{computedTotalCost.toLocaleString("en-IN")}
                  </Typography>
                  <Typography className="font-mono" sx={{ fontSize: "0.62rem", color: "#71717a" }}>
                    (~{computedFuelLiters.toFixed(1)} L)
                  </Typography>
                </Box>
              </Stack>
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
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("vehicleMileage", { valueAsNumber: true })}
            error={Boolean(errors.vehicleMileage)}
            helperText={errors.vehicleMileage?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Fuel Price (₹/L)"
            type="number"
            fullWidth
            variant="outlined"
            placeholder="e.g. 100"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("fuelPricePerLiter", { valueAsNumber: true })}
            error={Boolean(errors.fuelPricePerLiter)}
            helperText={errors.fuelPricePerLiter?.message}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} disabled={isSubmitting} sx={{ color: "#94a3b8" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || routeDistanceKm <= 0}
            className="glow-indigo"
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            {isSubmitting ? "Applying..." : `Calculate & Apply (₹${computedTotalCost.toLocaleString()})`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
