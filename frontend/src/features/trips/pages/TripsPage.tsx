import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import TripList from "../components/TripList";
import { useTrips } from "../hooks/useTrips";
import StatCard from "@/shared/components/StatCard";
import Grid from "@mui/material/Grid";

export default function TripsPage() {
  const { data: trips, isLoading, isError, error } = useTrips();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Failed to load trips.
        <br />
        {error instanceof Error ? error.message : "Unknown error"}
      </Alert>
    );
  }

  if (!trips || trips.length === 0) {
    return <Typography>No trips found.</Typography>;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <Stack spacing={4}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="h4">Trips</Typography>

            <Typography color="text.secondary">
              Your motorcycle adventures and upcoming journeys.
            </Typography>
          </div>

          <Button variant="contained">
            Create Trip
          </Button>
        </Stack>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              label="Total Trips"
              value={trips.length}
            />
          </Grid>
        </Grid>
        <TripList trips={trips} />
      </Stack>
    </Container>
  );
}