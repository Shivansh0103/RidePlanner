import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  updateEstimateSchema,
  type UpdateEstimateRequest,
} from "../schemas/updateEstimateSchema";
import type { BudgetEstimate } from "../types/budget";

interface EditEstimateDialogProps {
  open: boolean;
  estimate: BudgetEstimate | null;
  onClose: () => void;
  onSubmit: (
    estimateId: string,
    data: UpdateEstimateRequest
  ) => Promise<void>;
  isLoading: boolean;
}

export default function EditEstimateDialog({
  open,
  estimate,
  onClose,
  onSubmit,
  isLoading,
}: EditEstimateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateEstimateRequest>({
    resolver: zodResolver(updateEstimateSchema),
  });

  useEffect(() => {
    if (open && estimate) {
      reset({
        name: estimate.title,
        estimatedAmount: estimate.estimatedAmount,
      });
    }
  }, [open, estimate, reset]);

  const handleFormSubmit = async (data: UpdateEstimateRequest) => {
    if (!estimate) return;
    await onSubmit(estimate.id, data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Edit Budget Estimate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Estimate Name"
            fullWidth
            variant="outlined"
            {...register("name")}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            disabled={isLoading}
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Estimated Amount (₹)"
            type="number"
            fullWidth
            variant="outlined"
            {...register("estimatedAmount", { valueAsNumber: true })}
            error={Boolean(errors.estimatedAmount)}
            helperText={errors.estimatedAmount?.message}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
