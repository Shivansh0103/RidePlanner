import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { BudgetEstimate } from "../types/budget";

interface DeleteEstimateDialogProps {
  open: boolean;
  estimate: BudgetEstimate | null;
  onClose: () => void;
  onConfirm: (estimateId: string) => Promise<void>;
  isLoading: boolean;
}

export default function DeleteEstimateDialog({
  open,
  estimate,
  onClose,
  onConfirm,
  isLoading,
}: DeleteEstimateDialogProps) {
  const handleConfirm = async () => {
    if (!estimate) return;
    await onConfirm(estimate.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Estimate?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the estimate &quot;
          {estimate?.title}&quot;? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
