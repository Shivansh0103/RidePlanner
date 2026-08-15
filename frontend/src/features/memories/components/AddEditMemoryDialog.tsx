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
  type CreateMemoryRequest,
  createMemorySchema,
} from "../schemas/memorySchema";
import type { TripMemory } from "../types/memory";

interface AddEditMemoryDialogProps {
  open: boolean;
  memory: TripMemory | null;
  onClose: () => void;
  onSubmit: (data: CreateMemoryRequest) => Promise<void>;
  isLoading: boolean;
}

export default function AddEditMemoryDialog({
  open,
  memory,
  onClose,
  onSubmit,
  isLoading,
}: AddEditMemoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMemoryRequest>({
    resolver: zodResolver(createMemorySchema),

    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      odometerReadingKm: null,
      memoryDate: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (memory) {
        reset({
          title: memory.title,
          content: memory.content ?? "",
          imageUrl: memory.imageUrl ?? "",
          odometerReadingKm: memory.odometerReadingKm ?? null,
          memoryDate: memory.memoryDate ? memory.memoryDate.split("T")[0] : "",
        });
      } else {
        reset({
          title: "",
          content: "",
          imageUrl: "",
          odometerReadingKm: null,
          memoryDate: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [open, memory, reset]);

  const handleFormSubmit = async (data: CreateMemoryRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>{memory ? "Edit Ride Memory" : "Add Ride Memory / Journal"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Memory Title"
            fullWidth
            variant="outlined"
            placeholder="e.g. Sunset view over Khardung La Pass"
            {...register("title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            disabled={isLoading}
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Journal Entry / Highlights (Optional)"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Record what made this moment special, road conditions, gear notes..."
            {...register("content")}
            error={Boolean(errors.content)}
            helperText={errors.content?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Image URL (Optional)"
            fullWidth
            variant="outlined"
            placeholder="https://example.com/photo.jpg"
            {...register("imageUrl")}
            error={Boolean(errors.imageUrl)}
            helperText={errors.imageUrl?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Odometer Reading (KM) (Optional)"
            type="number"
            fullWidth
            variant="outlined"
            placeholder="e.g. 18450"
            {...register("odometerReadingKm", {
              setValueAs: (val) =>
                val === "" || val === null || val === undefined || isNaN(Number(val))
                  ? null
                  : Number(val),
            })}
            error={Boolean(errors.odometerReadingKm)}

            helperText={errors.odometerReadingKm?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Memory Date"
            type="date"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("memoryDate")}
            error={Boolean(errors.memoryDate)}
            helperText={errors.memoryDate?.message}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {memory ? "Save Changes" : "Add Memory"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
