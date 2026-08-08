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

import {
  createItemSchema,
  type CreateItemRequest,
} from "../schemas/itemSchema";
import type { ChecklistCategory } from "../types/checklist";

interface AddItemDialogProps {
  open: boolean;
  categories: ChecklistCategory[];
  defaultCategoryId: string | null;
  onClose: () => void;
  onSubmit: (data: CreateItemRequest) => Promise<void>;
  isLoading: boolean;
}

export default function AddItemDialog({
  open,
  categories,
  defaultCategoryId,
  onClose,
  onSubmit,
  isLoading,
}: AddItemDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateItemRequest>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      categoryId: defaultCategoryId ?? (categories[0]?.id || ""),
      title: "",
    },
  });

  const selectedCategory = watch("categoryId");

  useEffect(() => {
    if (open) {
      const initialCatId = defaultCategoryId || categories[0]?.id || "";
      reset({
        categoryId: initialCatId,
        title: "",
      });
    }
  }, [open, defaultCategoryId, categories, reset]);

  const handleFormSubmit = async (data: CreateItemRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Add Checklist Item</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            variant="outlined"
            value={selectedCategory || ""}
            onChange={(e) => setValue("categoryId", e.target.value)}
            error={Boolean(errors.categoryId)}
            helperText={errors.categoryId?.message}
            disabled={isLoading}
            sx={{ mt: 1, mb: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            autoFocus
            margin="dense"
            label="Item Title"
            fullWidth
            variant="outlined"
            placeholder="e.g. Rain Jacket"
            {...register("title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Add Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
