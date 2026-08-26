import AddIcon from "@mui/icons-material/Add";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { ConfirmDialog } from "@/shared/components";
import { ErrorState, LoadingSpinner } from "@/shared/ui";

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
  const [docToDelete, setDocToDelete] = useState<TripDocument | null>(null);

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (doc: TripDocument) => {
    setEditingDoc(doc);
    setIsDialogOpen(true);
  };

  const handleDelete = (doc: TripDocument) => {
    setDocToDelete(doc);
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    deleteMutation.mutate(docToDelete.id, {
      onSuccess: () => {
        setDocToDelete(null);
      },
    });
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
                bgcolor: "rgba(99, 102, 241, 0.12)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FolderSpecialIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}>
                Field Permits & Document Vault ({documents.length})
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                Permits, vehicle registration (RC), insurance policies, and identity clearances
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
            Add Document
          </Button>
        </Stack>
      </Paper>

      {documents.length === 0 ? (
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
            No travel documents registered in the vault yet. Click "+ Add Document" to store your permits or insurance info.
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

      <ConfirmDialog
        open={docToDelete !== null}
        title="Delete Document"
        message={`Are you sure you want to delete travel document "${docToDelete?.title}"?`}
        confirmText="Delete"
        loading={deleteMutation.isPending}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  );
}
