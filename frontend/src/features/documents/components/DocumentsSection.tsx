import AddIcon from "@mui/icons-material/Add";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import { useCreateTripDocument } from "../hooks/useCreateTripDocument";
import { useDeleteTripDocument } from "../hooks/useDeleteTripDocument";
import { useTripDocuments } from "../hooks/useTripDocuments";
import { useUpdateTripDocument } from "../hooks/useUpdateTripDocument";
import type { CreateDocumentRequest } from "../schemas/documentSchema";
import type { TripDocument } from "../types/document";
import AddEditDocumentDialog from "./AddEditDocumentDialog";
import DocumentCard from "./DocumentCard";

interface DocumentsSectionProps {
  tripId: string;
}

export default function DocumentsSection({ tripId }: DocumentsSectionProps) {
  const { data: documents = [], isLoading, isError } = useTripDocuments(tripId);

  const createMutation = useCreateTripDocument(tripId);
  const updateMutation = useUpdateTripDocument(tripId);
  const deleteMutation = useDeleteTripDocument(tripId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<TripDocument | null>(null);

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (doc: TripDocument) => {
    setEditingDoc(doc);
    setIsDialogOpen(true);
  };

  const handleDelete = (doc: TripDocument) => {
    if (window.confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      deleteMutation.mutate(doc.id);
    }
  };

  const handleSubmit = async (data: CreateDocumentRequest) => {
    if (editingDoc) {
      await updateMutation.mutateAsync({ id: editingDoc.id, request: data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState message="Failed to load travel documents." />;
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <FolderSpecialIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Travel Documents ({documents.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage licenses, permits, vehicle RC, insurance, and identity proofs for this trip.
              </Typography>
            </Box>
          </Box>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Add Document
          </Button>
        </Stack>
      </Paper>

      {documents.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textTransform: "none", textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">
            No travel documents added yet. Click "Add Document" to store your license, permit, or insurance info.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {documents.map((doc) => (
            <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <DocumentCard document={doc} onEdit={handleOpenEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>

      )}

      <AddEditDocumentDialog
        open={isDialogOpen}
        document={editingDoc}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Stack>
  );
}
