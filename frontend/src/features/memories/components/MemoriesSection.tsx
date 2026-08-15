import AddIcon from "@mui/icons-material/Add";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

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

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (memory: TripMemory) => {
    setEditingMemory(memory);
    setIsDialogOpen(true);
  };

  const handleDelete = (memory: TripMemory) => {
    if (window.confirm(`Are you sure you want to delete memory "${memory.title}"?`)) {
      deleteMutation.mutate(memory.id);
    }
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
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CollectionsIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Ride Memories & Journal ({memories.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capture highlights, journal logs, photo links, and mileage readings from your journey.
              </Typography>
            </Box>
          </Box>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
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
    </Stack>
  );
}
