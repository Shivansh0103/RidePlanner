import { Alert, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material";

import { useTrips } from "../hooks/useTrips";

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
    <>
      <Typography variant="h4" gutterBottom>
        Trips
      </Typography>

      <List>
        {trips.map((trip) => (
          <ListItem key={trip.id}>
            <ListItemText
              primary={trip.name}
              secondary={`${trip.startDate} - ${trip.endDate}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}