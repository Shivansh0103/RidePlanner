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
  type CreateDocumentRequest,
  createDocumentSchema,
} from "../schemas/documentSchema";
import type { DocumentType, TripDocument } from "../types/document";

const DOCUMENT_TYPES: DocumentType[] = [
  "Passport",
  "Driving License",
  "Vehicle RC",
  "Insurance",
  "Permit",
  "Visa",
  "Other",
];

interface AddEditDocumentDialogProps {
  open: boolean;
  document: TripDocument | null;
  onClose: () => void;
  onSubmit: (data: CreateDocumentRequest) => Promise<void>;
  isLoading: boolean;
}

export default function AddEditDocumentDialog({
  open,
  document: doc,
  onClose,
  onSubmit,
  isLoading,
}: AddEditDocumentDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDocumentRequest>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      title: "",
      type: "Driving License",
      documentNumber: "",
      expiryDate: "",
      filePath: "",
      notes: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (open) {
      if (doc) {
        reset({
          title: doc.title,
          type: doc.type,
          documentNumber: doc.documentNumber ?? "",
          expiryDate: doc.expiryDate ? doc.expiryDate.split("T")[0] : "",
          filePath: doc.filePath ?? "",
          notes: doc.notes ?? "",
        });
      } else {
        reset({
          title: "",
          type: "Driving License",
          documentNumber: "",
          expiryDate: "",
          filePath: "",
          notes: "",
        });
      }
    }
  }, [open, doc, reset]);

  const handleFormSubmit = async (data: CreateDocumentRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>{doc ? "Edit Travel Document" : "Add Travel Document"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Document Title"
            fullWidth
            variant="outlined"
            placeholder="e.g. Primary Driver's License"
            {...register("title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            disabled={isLoading}
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            select
            margin="dense"
            label="Document Type"
            fullWidth
            variant="outlined"
            value={selectedType || "Other"}
            onChange={(e) => setValue("type", e.target.value)}
            error={Boolean(errors.type)}
            helperText={errors.type?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {DOCUMENT_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="dense"
            label="Document Number (Optional)"
            fullWidth
            variant="outlined"
            placeholder="e.g. DL-12345678"
            {...register("documentNumber")}
            error={Boolean(errors.documentNumber)}
            helperText={errors.documentNumber?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Expiry Date (Optional)"
            type="date"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("expiryDate")}
            error={Boolean(errors.expiryDate)}
            helperText={errors.expiryDate?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Notes / Comments (Optional)"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="e.g. Original copy kept in bike jacket pocket"
            {...register("notes")}
            error={Boolean(errors.notes)}
            helperText={errors.notes?.message}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {doc ? "Save Changes" : "Add Document"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
