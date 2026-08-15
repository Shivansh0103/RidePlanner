import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  type CreateContactRequest,
  createContactSchema,
} from "../schemas/contactSchema";
import type { EmergencyContact } from "../types/contact";

interface AddEditContactDialogProps {
  open: boolean;
  contact: EmergencyContact | null;
  onClose: () => void;
  onSubmit: (data: CreateContactRequest) => Promise<void>;
  isLoading: boolean;
}

export default function AddEditContactDialog({
  open,
  contact,
  onClose,
  onSubmit,
  isLoading,
}: AddEditContactDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateContactRequest>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
      alternatePhone: "",
      email: "",
      isPrimary: false,
    },
  });

  const isPrimaryValue = watch("isPrimary");

  useEffect(() => {
    if (open) {
      if (contact) {
        reset({
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phone,
          alternatePhone: contact.alternatePhone ?? "",
          email: contact.email ?? "",
          isPrimary: contact.isPrimary,
        });
      } else {
        reset({
          name: "",
          relationship: "",
          phone: "",
          alternatePhone: "",
          email: "",
          isPrimary: false,
        });
      }
    }
  }, [open, contact, reset]);

  const handleFormSubmit = async (data: CreateContactRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>{contact ? "Edit Emergency Contact" : "Add Emergency Contact"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
            placeholder="e.g. Rahul Sharma"
            {...register("name")}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            disabled={isLoading}
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Relationship"
            fullWidth
            variant="outlined"
            placeholder="e.g. Brother, Spouse, Parent, Friend"
            {...register("relationship")}
            error={Boolean(errors.relationship)}
            helperText={errors.relationship?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Primary Phone Number"
            fullWidth
            variant="outlined"
            placeholder="e.g. +91 9876543210"
            {...register("phone")}
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Alternate Phone Number (Optional)"
            fullWidth
            variant="outlined"
            placeholder="e.g. +91 9123456789"
            {...register("alternatePhone")}
            error={Boolean(errors.alternatePhone)}
            helperText={errors.alternatePhone?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Email Address (Optional)"
            type="email"
            fullWidth
            variant="outlined"
            placeholder="e.g. rahul@example.com"
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            disabled={isLoading}
            sx={{ mb: 1.5 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isPrimaryValue ?? false}
                onChange={(e) => setValue("isPrimary", e.target.checked)}
                disabled={isLoading}
              />
            }
            label="Set as Primary Emergency Contact for this Trip"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {contact ? "Save Changes" : "Add Contact"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
