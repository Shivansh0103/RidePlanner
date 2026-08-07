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
  updateBudgetSchema,
  type UpdateBudgetRequest,
} from "../schemas/updateBudgetSchema";

interface EditBudgetDialogProps {
  open: boolean;
  initialTargetBudget: number;
  onClose: () => void;
  onSubmit: (data: UpdateBudgetRequest) => Promise<void>;
  isLoading: boolean;
}

export default function EditBudgetDialog({
  open,
  initialTargetBudget,
  onClose,
  onSubmit,
  isLoading,
}: EditBudgetDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateBudgetRequest>({
    resolver: zodResolver(updateBudgetSchema),
    defaultValues: {
      targetBudget: initialTargetBudget,
    },
  });

  useEffect(() => {
    if (open) {
      reset({ targetBudget: initialTargetBudget });
    }
  }, [open, initialTargetBudget, reset]);

  const handleFormSubmit = async (data: UpdateBudgetRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Edit Target Budget</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Target Budget (₹)"
            type="number"
            fullWidth
            variant="outlined"
            {...register("targetBudget", { valueAsNumber: true })}
            error={Boolean(errors.targetBudget)}
            helperText={errors.targetBudget?.message}
            disabled={isLoading}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
