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
  updateItemSchema,
  type UpdateItemRequest,
} from "../schemas/itemSchema";
import type { ChecklistItem } from "../types/checklist";

interface EditItemDialogProps {
  open: boolean;
  item: ChecklistItem | null;
  onClose: () => void;
  onSubmit: (itemId: string, data: UpdateItemRequest) => Promise<void>;
  isLoading: boolean;
}

export default function EditItemDialog({
  open,
  item,
  onClose,
  onSubmit,
  isLoading,
}: EditItemDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateItemRequest>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (open && item) {
      reset({ title: item.title });
    }
  }, [open, item, reset]);

  const handleFormSubmit = async (data: UpdateItemRequest) => {
    if (!item) return;
    await onSubmit(item.id, data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Edit Checklist Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Title"
            fullWidth
            variant="outlined"
            {...register("title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
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
