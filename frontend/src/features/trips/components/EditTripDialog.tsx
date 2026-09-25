import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { useUpdateTrip } from "../hooks/useUpdateTrip";
import type { CreateTripRequest } from "../schemas/createTripSchema";
import type { Trip } from "../types/trip";
import TripForm from "./TripForm";

type EditTripDialogProps = {
  open: boolean;
  trip: Trip;
  onClose: () => void;
};

export default function EditTripDialog({ open, trip, onClose }: EditTripDialogProps) {
  const { mutateAsync, isPending, error, isError } = useUpdateTrip();

  const handleUpdateTrip = async (data: CreateTripRequest) => {
    try {
      await mutateAsync({
        id: trip.id,
        ...data,
      });

      onClose();
    } catch {
      // Alert handles the error
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-trip-dialog-title"
      slotProps={{
        paper: {
          className: "neo-convex",
          sx: {
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: (theme) => theme.palette.mode === "dark" ? "0 20px 50px rgba(0, 0, 0, 0.8)" : "0 20px 50px rgba(0, 0, 0, 0.12)",
          },
        },
      }}
    >
      <DialogTitle
        id="edit-trip-dialog-title"
        sx={{
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 800,
          color: "text.primary",
          pt: 3,
          px: 3,
        }}
      >
        Update Expedition Configuration
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error instanceof Error ? error.message : "Failed to update trip."}
          </Alert>
        )}

        <TripForm
          key={trip.id}
          defaultValues={{
            name: trip.name,
            description: trip.description ?? "",
            startDate: trip.startDate,
            endDate: trip.endDate,
          }}
          onSubmit={handleUpdateTrip}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={isPending}
          sx={{ color: "text.secondary", fontFamily: '"JetBrains Mono", monospace', fontSize: "0.78rem", fontWeight: 700 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          type="submit"
          form="trip-form"
          loading={isPending}
          className="glow-indigo"
          sx={{
            bgcolor: "#6366f1",
            color: "#ffffff",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "0.04em",
            "&:hover": { bgcolor: "#4f46e5" },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
