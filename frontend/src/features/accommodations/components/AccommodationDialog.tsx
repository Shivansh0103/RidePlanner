import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import type { Accommodation } from "../types/accommodation";
import type { AccommodationFormValues } from "../validation/accommodationSchema";
import AccommodationForm from "./AccommodationForm";

interface AccommodationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AccommodationFormValues) => Promise<void>;
  editingAccommodation?: Accommodation | null;
  defaultDisplayOrder?: number;
  isLoading?: boolean;
}

export default function AccommodationDialog({
  open,
  onClose,
  onSubmit,
  editingAccommodation,
  defaultDisplayOrder = 1,
  isLoading = false,
}: AccommodationDialogProps) {
  const isEditing = !!editingAccommodation;

  const defaultValues: AccommodationFormValues = {
    name: editingAccommodation?.name ?? "",
    type: editingAccommodation?.type ?? "Hotel",
    checkInDate:
      editingAccommodation?.checkInDate ??
      new Date().toISOString().split("T")[0],
    checkOutDate:
      editingAccommodation?.checkOutDate ??
      new Date().toISOString().split("T")[0],
    checkInTime: editingAccommodation?.checkInTime ?? "",
    checkOutTime: editingAccommodation?.checkOutTime ?? "",
    formattedAddress: editingAccommodation?.formattedAddress ?? "",
    latitude: editingAccommodation?.latitude ?? null,
    longitude: editingAccommodation?.longitude ?? null,
    placeId: editingAccommodation?.placeId ?? null,
    confirmationNumber: editingAccommodation?.confirmationNumber ?? "",
    contactName: editingAccommodation?.contactName ?? "",
    contactPhone: editingAccommodation?.contactPhone ?? "",
    website: editingAccommodation?.website ?? "",
    bookingNotes: editingAccommodation?.bookingNotes ?? "",
    cost: editingAccommodation?.cost ?? 0,
    displayOrder: editingAccommodation?.displayOrder ?? defaultDisplayOrder,
  };

  const handleSubmit = async (values: AccommodationFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditing ? "Edit Accommodation Stay" : "Add Accommodation Stay"}
      </DialogTitle>

      <DialogContent dividers>
        <AccommodationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="accommodation-form"
          variant="contained"
          disabled={isLoading}
        >
          {isEditing ? "Save Changes" : "Add Stay"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
