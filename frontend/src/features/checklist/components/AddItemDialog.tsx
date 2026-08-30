import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  type CreateItemRequest,
  createItemSchema,
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

const CATEGORY_PRESETS: Record<string, string[]> = {
  documents: [
    "Govt Photo ID (Aadhar / Passport)",
    "Driving License",
    "Vehicle RC & PUC",
    "Insurance Policy",
    "Inner Line Permits / Passes",
  ],
  vehicle: [
    "Tyre Pressure & Tread",
    "Engine Oil & Coolant",
    "Drive Chain Tension & Lube",
    "Brake Pads & Fluid",
    "Emergency Toolkit & Puncture Kit",
  ],
  packing: [
    "Riding Jacket & Gloves",
    "Rain Gear & Liners",
    "First-Aid Kit & Meds",
    "Power Bank & Phone Mount",
    "Thermal Layers & Clothes",
  ],
};

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
      isRequired: true,
    },
  });

  const selectedCategoryId = watch("categoryId");
  const isRequiredValue = watch("isRequired");

  useEffect(() => {
    if (open) {
      const initialCatId = defaultCategoryId || categories[0]?.id || "";
      reset({
        categoryId: initialCatId,
        title: "",
        isRequired: true,
      });
    }
  }, [open, defaultCategoryId, categories, reset]);

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);
  const categoryKey = selectedCategoryObj?.name?.toLowerCase() || "";
  const presets =
    CATEGORY_PRESETS[
      Object.keys(CATEGORY_PRESETS).find((k) => categoryKey.includes(k)) || "packing"
    ] || [];

  const handleFormSubmit = async (data: CreateItemRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
          Add Checklist Item
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            variant="outlined"
            value={selectedCategoryId || ""}
            onChange={(e) => setValue("categoryId", e.target.value, { shouldValidate: true })}
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
            placeholder="e.g. Rain Jacket or ID Card"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            disabled={isLoading}
            sx={{ mb: 1.5 }}
          />

          {/* Quick Preset Recommendations */}
          {presets.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mb: 0.8, fontSize: "0.68rem", fontWeight: 700 }}>
                QUICK SUGGESTIONS:
              </Typography>
              <Stack direction="row" spacing={0.6} sx={{ flexWrap: "wrap", gap: 0.6 }}>
                {presets.map((preset) => (
                  <Chip
                    key={preset}
                    label={preset}
                    size="small"
                    onClick={() => setValue("title", preset, { shouldValidate: true })}
                    sx={{
                      fontSize: "0.64rem",
                      fontFamily: '"JetBrains Mono", monospace',
                      cursor: "pointer",
                      bgcolor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#cbd5e1",
                      "&:hover": {
                        bgcolor: "rgba(99, 102, 241, 0.15)",
                        borderColor: "#818cf8",
                        color: "#ffffff",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={isRequiredValue ?? true}
                onChange={(e) => setValue("isRequired", e.target.checked)}
                disabled={isLoading}
                sx={{
                  color: "#52525b",
                  "&.Mui-checked": { color: "#bef264" },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#e2e8f0" }}>
                Required Item (affects trip readiness)
              </Typography>
            }
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} disabled={isLoading} sx={{ color: "#94a3b8", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="glow-indigo"
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Add Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
