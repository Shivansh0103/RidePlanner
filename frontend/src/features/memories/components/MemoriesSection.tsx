import AddIcon from "@mui/icons-material/Add";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { ConfirmDialog } from "@/shared/components";
import { ErrorState, LoadingSpinner } from "@/shared/ui";

import { useCreateTripMemory } from "../hooks/useCreateTripMemory";
import { useDeleteTripMemory } from "../hooks/useDeleteTripMemory";
import { useTripMemories } from "../hooks/useTripMemories";
import { useUpdateTripMemory } from "../hooks/useUpdateTripMemory";
import type { CreateMemoryRequest } from "../schemas/memorySchema";
import type { TripMemory } from "../types/memory";
import AddEditMemoryDialog from "./AddEditMemoryDialog";
import MemoryCard from "./MemoryCard";

interface MemoriesSectionProps {
  tripId: string;
}

export default function MemoriesSection({ tripId }: MemoriesSectionProps) {
  const { data: memories = [], isLoading, isError } = useTripMemories(tripId);

  const createMutation = useCreateTripMemory(tripId);
  const updateMutation = useUpdateTripMemory(tripId);
  const deleteMutation = useDeleteTripMemory(tripId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<TripMemory | null>(null);
  const [memoryToDelete, setMemoryToDelete] = useState<TripMemory | null>(null);

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (memory: TripMemory) => {
    setEditingMemory(memory);
    setIsDialogOpen(true);
  };

  const handleDelete = (memory: TripMemory) => {
    setMemoryToDelete(memory);
  };

  const handleConfirmDelete = () => {
    if (!memoryToDelete) return;
    deleteMutation.mutate(memoryToDelete.id, {
      onSuccess: () => {
        setMemoryToDelete(null);
      },
    });
  };

  const handleSubmit = async (data: CreateMemoryRequest) => {
    if (editingMemory) {
      await updateMutation.mutateAsync({ id: editingMemory.id, request: data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState message="Failed to load trip memories." />;
  }

  return (
    <Stack spacing={3}>
      <Paper
        className="neo-convex"
        sx={{
          p: 2.2,
          borderRadius: 2.5,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 1.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: "rgba(192, 132, 252, 0.15)",
                color: "#c084fc",
                border: "1px solid rgba(192, 132, 252, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CollectionsIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "1rem" }}>
                Ride Memories & Journal ({memories.length})
              </Typography>
              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                Capture highlights, journal logs, photo links, and mileage readings from your journey.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            endIcon={<AddIcon sx={{ fontSize: 15 }} />}
            onClick={handleOpenAdd}
            className="glow-indigo"
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 800,
              px: 1.6,
              py: 0.6,
              borderRadius: 2,
              textTransform: "none",
              alignSelf: { xs: "stretch", sm: "auto" },
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Add Memory
          </Button>
        </Stack>
      </Paper>

      {memories.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">
            No memories or journal entries added yet. Click "Add Memory" to log your first ride highlight!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {memories.map((memory) => (
            <Grid key={memory.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <MemoryCard memory={memory} onEdit={handleOpenEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <AddEditMemoryDialog
        open={isDialogOpen}
        memory={editingMemory}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={memoryToDelete !== null}
        title="Delete Memory"
        message={`Are you sure you want to delete memory "${memoryToDelete?.title}"?`}
        confirmText="Delete"
        loading={deleteMutation.isPending}
        onClose={() => setMemoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  );
}
