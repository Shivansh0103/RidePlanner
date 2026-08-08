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
  type CreateCategoryRequest,
} from "../schemas/categorySchema";

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest) => Promise<void>;
  isLoading: boolean;
}

export default function AddCategoryDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: AddCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryRequest>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ name: "" });
    }
  }, [open, reset]);

  const handleFormSubmit = async (data: CreateCategoryRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            placeholder="e.g. Navigation Tools"
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
            Add Category
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
