import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { useCreateTripStop } from "../hooks/useCreateTripStop";
import type { TripStopFormValues } from "../validation/tripStopSchema";
import TripStopForm from "./TripStopForm";

type TripStopDialogProps = {
  open: boolean;
  tripId: string;
  nextDisplayOrder: number;
  onClose: () => void;
};

export default function TripStopDialog({
  open,
  tripId,
  nextDisplayOrder,
  onClose,
}: TripStopDialogProps) {
  const createTripStopMutation = useCreateTripStop(tripId);

  const defaultValues: TripStopFormValues = {
    name: "",
    arrivalDate: "",
    departureDate: "",
    notes: "",
    displayOrder: nextDisplayOrder,
  };

  function handleSubmit(values: TripStopFormValues) {
    createTripStopMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Dialog
      open={open}
      onClose={createTripStopMutation.isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add Trip Stop</DialogTitle>

      <DialogContent>
        <TripStopForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={createTripStopMutation.isPending}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={createTripStopMutation.isPending}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="trip-stop-form"
          variant="contained"
          loading={createTripStopMutation.isPending}
        >
          Save Stop
        </Button>
      </DialogActions>
    </Dialog>
  );
}
