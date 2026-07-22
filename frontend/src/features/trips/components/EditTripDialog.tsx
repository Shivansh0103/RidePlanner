import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "sonner";

import TripForm from "./TripForm";

import type { Trip } from "../types/trip";
import type { CreateTripRequest } from "../schemas/createTripSchema";

import { useUpdateTrip } from "../hooks/useUpdateTrip";

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

      toast.success("Trip updated!", {
        description: "Your changes have been saved.",
      });
    } catch {
      // Alert handles the error
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="edit-trip-dialog-title">
      <DialogTitle id="edit-trip-dialog-title">Edit Trip</DialogTitle>

      <DialogContent>
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

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" type="submit" form="trip-form" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
