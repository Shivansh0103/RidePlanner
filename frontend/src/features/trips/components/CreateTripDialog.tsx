import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { tripDefaults } from "../constants/tripDefaults";
import { useCreateTrip } from "../hooks/useCreateTrip";
import type { CreateTripRequest } from "../schemas/createTripSchema";
import TripForm from "./TripForm";

type CreateTripDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateTripDialog({ open, onClose }: CreateTripDialogProps) {
  const { mutateAsync, isPending, error, isError } = useCreateTrip();

  const handleCreateTrip = async (data: CreateTripRequest) => {
    try {
      await mutateAsync(data);
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
      aria-labelledby="create-trip-dialog-title"
    >
      <DialogTitle id="create-trip-dialog-title">Create Trip</DialogTitle>

      <DialogContent>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error instanceof Error ? error.message : "Failed to create trip."}
          </Alert>
        )}
        <TripForm defaultValues={tripDefaults} onSubmit={handleCreateTrip} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>

        <Button variant="contained" type="submit" form="trip-form" loading={isPending}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

