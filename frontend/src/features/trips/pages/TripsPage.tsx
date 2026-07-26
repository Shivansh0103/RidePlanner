import { Container, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/shared/components/ConfirmDialog";
import StatCard from "@/shared/components/StatCard";
import EmptyState from "@/shared/ui/EmptyState";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import PageHeader from "@/shared/ui/PageHeader";

import CreateTripDialog from "../components/CreateTripDialog";
import EditTripDialog from "../components/EditTripDialog";
import NewTripButton from "../components/NewTripButton";
import TripList from "../components/TripList";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import { useTrips } from "../hooks/useTrips";
import { type Trip } from "../types/trip";

export default function TripsPage() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const { data: trips, isLoading, isError, error } = useTrips();
  const deleteTripMutation = useDeleteTrip();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState message={error instanceof Error ? error.message : "Unknown error"} />;
  }

  if (!trips || trips.length === 0) {
    return (
      <EmptyState
        title="No trips yet"
        description="Create your first ride to begin planning your adventure."
      />
    );
  }

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleDelete = (trip: Trip) => {
    setTripToDelete(trip);
  };

  const handleCloseEdit = () => {
    setSelectedTrip(null);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      await deleteTripMutation.mutateAsync(tripToDelete.id);

      toast.success("Trip deleted successfully.");

      setTripToDelete(null);
    } catch {
      toast.error("Failed to delete trip.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <PageHeader
          title="Trips"
          subtitle="Your motorcycle adventures and upcoming journeys."
          action={<NewTripButton onClick={() => setCreateDialogOpen(true)} />}
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard label="Total Trips" value={trips.length} />
          </Grid>
        </Grid>

        <TripList trips={trips} onEdit={handleEdit} onDelete={handleDelete} />

        <CreateTripDialog open={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} />

        {selectedTrip && <EditTripDialog open trip={selectedTrip} onClose={handleCloseEdit} />}

        <ConfirmDialog
          open={tripToDelete !== null}
          title="Delete Trip"
          message={`Are you sure you want to permanently delete "${tripToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          loading={deleteTripMutation.isPending}
          onClose={() => setTripToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </Stack>
    </Container>
  );
}
