import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { CATEGORY_LABELS } from "../constants/categoryLabels";
import {
  createEstimateSchema,
  type CreateEstimateRequest,
} from "../schemas/createEstimateSchema";
import type { BudgetCategoryType } from "../types/budget";

interface CreateEstimateDialogProps {
  open: boolean;
  defaultCategory: BudgetCategoryType;
  onClose: () => void;
  onSubmit: (data: CreateEstimateRequest) => Promise<void>;
  isLoading: boolean;
}

export default function CreateEstimateDialog({
  open,
  defaultCategory,
  onClose,
  onSubmit,
  isLoading,
}: CreateEstimateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEstimateRequest>({
    resolver: zodResolver(createEstimateSchema),
    defaultValues: {
      category: defaultCategory,
      name: "",
      estimatedAmount: 0,
    },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (open) {
      reset({
        category: defaultCategory,
        name: "",
        estimatedAmount: 0,
      });
    }
  }, [open, defaultCategory, reset]);

  const handleFormSubmit = async (data: CreateEstimateRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Add Budget Estimate</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            variant="outlined"
            value={selectedCategory ?? defaultCategory}
            onChange={(e) =>
              setValue("category", e.target.value as BudgetCategoryType)
            }
            error={Boolean(errors.category)}
            helperText={errors.category?.message}
            disabled={isLoading}
            sx={{ mt: 1, mb: 2 }}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            autoFocus
            margin="dense"
            label="Estimate Name"
            fullWidth
            variant="outlined"
            placeholder="e.g. Hotel Leh"
            {...register("name")}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
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
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Add Estimate
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
