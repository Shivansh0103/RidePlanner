import AddIcon from "@mui/icons-material/Add";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import { useCreateEmergencyContact } from "../hooks/useCreateEmergencyContact";
import { useDeleteEmergencyContact } from "../hooks/useDeleteEmergencyContact";
import { useEmergencyContacts } from "../hooks/useEmergencyContacts";
import { useUpdateEmergencyContact } from "../hooks/useUpdateEmergencyContact";
import type { CreateContactRequest } from "../schemas/contactSchema";
import type { EmergencyContact } from "../types/contact";
import AddEditContactDialog from "./AddEditContactDialog";
import ContactCard from "./ContactCard";

interface EmergencyContactsSectionProps {
  tripId: string;
}

export default function EmergencyContactsSection({ tripId }: EmergencyContactsSectionProps) {
  const { data: contacts = [], isLoading, isError } = useEmergencyContacts(tripId);

  const createMutation = useCreateEmergencyContact(tripId);
  const updateMutation = useUpdateEmergencyContact(tripId);
  const deleteMutation = useDeleteEmergencyContact(tripId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const handleDelete = (contact: EmergencyContact) => {
    if (window.confirm(`Are you sure you want to delete emergency contact "${contact.name}"?`)) {
      deleteMutation.mutate(contact.id);
    }
  };

  const handleSubmit = async (data: CreateContactRequest) => {
    if (editingContact) {
      await updateMutation.mutateAsync({ id: editingContact.id, request: data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState message="Failed to load emergency contacts." />;
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ContactPhoneIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Emergency Contacts ({contacts.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ensure safety by adding trusted contacts, family members, or riding companions for this trip.
              </Typography>
            </Box>
          </Box>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Add Contact
          </Button>
        </Stack>
      </Paper>

      {contacts.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">
            No emergency contacts added yet. Click "Add Contact" to add family, spouse, or emergency contact info.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {contacts.map((contact) => (
            <Grid key={contact.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ContactCard contact={contact} onEdit={handleOpenEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <AddEditContactDialog
        open={isDialogOpen}
        contact={editingContact}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Stack>
  );
}
