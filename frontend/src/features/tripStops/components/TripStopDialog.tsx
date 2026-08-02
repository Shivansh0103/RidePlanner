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
      slotProps={{
        paper: {
          sx: { borderRadius: 2 },
        },
      }}
    >
      <DialogTitle id="trip-stop-dialog-title" sx={{ px: 3, pt: 2.5, pb: 1.5, fontWeight: 700 }}>
        {mode === "create" ? "Add Trip Stop" : "Edit Trip Stop"}
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1.5 }}>
        <TripStopForm defaultValues={defaultValues} onSubmit={handleSubmit} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="trip-stop-form"
          variant="contained"
          loading={isSubmitting}
          sx={{ fontWeight: 600 }}
        >
          {mode === "create" ? "Save Stop" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
