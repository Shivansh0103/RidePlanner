import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { useCreateTripStop } from "../hooks/useCreateTripStop";
import { useUpdateTripStop } from "../hooks/useUpdateTripStop";
import type { TripStopFormValues } from "../validation/tripStopSchema";
import TripStopForm from "./TripStopForm";

type TripStopDialogProps = {
  open: boolean;
  tripId: string;
  mode: "create" | "edit";
  defaultValues: TripStopFormValues;
  stopId?: string;
  onClose: () => void;
};

export default function TripStopDialog({
  open,
  tripId,
  mode,
  defaultValues,
  stopId,
  onClose,
}: TripStopDialogProps) {
  const createTripStopMutation = useCreateTripStop(tripId);
  const updateTripStopMutation = useUpdateTripStop(tripId);

  const isSubmitting = createTripStopMutation.isPending || updateTripStopMutation.isPending;

  function handleSubmit(values: TripStopFormValues) {
    if (mode === "create") {
      createTripStopMutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });

      return;
    }

    if (!stopId) {
      return;
    }

    updateTripStopMutation.mutate(
      {
        stopId,
        request: values,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="trip-stop-dialog-title"
    >
      <DialogTitle id="trip-stop-dialog-title">
        {mode === "create" ? "Add Trip Stop" : "Edit Trip Stop"}
      </DialogTitle>

      <DialogContent>
        <TripStopForm defaultValues={defaultValues} onSubmit={handleSubmit} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button type="submit" form="trip-stop-form" variant="contained" loading={isSubmitting}>
          {mode === "create" ? "Save Stop" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
