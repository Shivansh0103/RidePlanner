import { useState } from "react";

import { Container, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

import TripList from "../components/TripList";
import NewTripButton from "../components/NewTripButton";
import CreateTripDialog from "../components/CreateTripDialog";
import { useTrips } from "../hooks/useTrips";

import StatCard from "@/shared/components/StatCard";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ErrorState from "@/shared/ui/ErrorState";
import EmptyState from "@/shared/ui/EmptyState";
import PageHeader from "@/shared/ui/PageHeader";

export default function TripsPage() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: trips, isLoading, isError, error } = useTrips();

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

        <TripList trips={trips} />

        <CreateTripDialog open={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} />
      </Stack>
    </Container>
  );
}
