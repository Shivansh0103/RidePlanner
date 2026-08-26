import AddIcon from "@mui/icons-material/Add";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { ConfirmDialog } from "@/shared/components";
import { ErrorState, LoadingSpinner } from "@/shared/ui";

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
  const [contactToDelete, setContactToDelete] = useState<EmergencyContact | null>(null);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const handleDelete = (contact: EmergencyContact) => {
    setContactToDelete(contact);
  };

  const handleConfirmDelete = () => {
    if (!contactToDelete) return;
    deleteMutation.mutate(contactToDelete.id, {
      onSuccess: () => {
        setContactToDelete(null);
      },
    });
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
      <Paper
        className="neo-convex"
        sx={{
          p: 2.8,
          borderRadius: 2.5,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "rgba(248, 113, 113, 0.12)",
                color: "#f87171",
                border: "1px solid rgba(248, 113, 113, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ContactPhoneIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}>
                Emergency Contacts & ICE Network ({contacts.length})
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                In-Case-of-Emergency contacts, blood relations, and medical response points
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={handleOpenAdd}
            className="glow-indigo"
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Add ICE Contact
          </Button>
        </Stack>
      </Paper>

      {contacts.length === 0 ? (
        <Paper
          className="neo-inset"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2.5,
            bgcolor: "#141313",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            No emergency contacts listed for this trip. Click "+ Add ICE Contact" to register contacts for safety.
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

      <ConfirmDialog
        open={contactToDelete !== null}
        title="Delete Contact"
        message={`Are you sure you want to delete emergency contact "${contactToDelete?.name}"?`}
        confirmText="Delete"
        loading={deleteMutation.isPending}
        onClose={() => setContactToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  );
}
