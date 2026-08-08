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
  categorySchema,
  type UpdateCategoryRequest,
} from "../schemas/categorySchema";
import type { ChecklistCategory } from "../types/checklist";

interface EditCategoryDialogProps {
  open: boolean;
  category: ChecklistCategory | null;
  onClose: () => void;
  onSubmit: (categoryId: string, data: UpdateCategoryRequest) => Promise<void>;
  isLoading: boolean;
}

export default function EditCategoryDialog({
  open,
  category,
  onClose,
  onSubmit,
  isLoading,
}: EditCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCategoryRequest>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open && category) {
      reset({ name: category.name });
    }
  }, [open, category, reset]);

  const handleFormSubmit = async (data: UpdateCategoryRequest) => {
    if (!category) return;
    await onSubmit(category.id, data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            {...register("name")}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            disabled={isLoading}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
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
