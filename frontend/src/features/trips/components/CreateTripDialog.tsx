import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import TripForm from "./TripForm";
import type { TripFormValues } from "../schemas/tripSchema";
import { useCreateTrip } from "../hooks/useCreateTrip";

type CreateTripDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateTripDialog({ open, onClose }: CreateTripDialogProps) {
  const { mutate, isPending } = useCreateTrip();

  const handleCreateTrip = (data: TripFormValues) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Trip</DialogTitle>

      <DialogContent>
        <TripForm
          defaultValues={{
            name: "",
          }}
          onSubmit={handleCreateTrip}
        />
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
