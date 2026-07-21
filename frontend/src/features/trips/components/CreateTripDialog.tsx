import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import TripForm from "./TripForm";
import { tripDefaults } from "../constants/tripDefaults";
import type { CreateTripRequest } from "../schemas/createTripSchema";
import { useCreateTrip } from "../hooks/useCreateTrip";
import { toast } from "sonner";

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

      toast.success("Trip created!", {
        description: "Your trip has been added.",
      });
    } catch {}
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Trip</DialogTitle>

      <DialogContent>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error instanceof Error ? error.message : "Failed to create trip."}
          </Alert>
        )}
        <TripForm defaultValues={tripDefaults} onSubmit={handleCreateTrip} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" type="submit" form="trip-form" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
