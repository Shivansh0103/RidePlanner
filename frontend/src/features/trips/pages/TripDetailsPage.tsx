import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import { Map, RouteSummary, useRoute } from "@/shared/maps";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import BudgetSection from "@/features/budget/components/BudgetSection";
import ChecklistSection from "@/features/checklist/components/ChecklistSection";
import ItinerarySection from "../components/ItinerarySection";
import TripSummary from "../components/TripSummary";
import { useTrip } from "../hooks/useTrip";

export default function TripDetailsPage() {
  const navigate = useNavigate();

  const { tripId } = useParams();

  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const { data: trip, isLoading, isError } = useTrip(tripId ?? "");
  const { data: stops = [] } = useTripStops(tripId ?? "");

  const validStops = stops.filter((stop) => stop.latitude !== null && stop.longitude !== null);
  const { route } = useRoute(validStops);

  const routeDistanceKm = (route?.summary?.distanceMeters ?? 0) / 1000;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !trip) {
    return <ErrorState message="Unable to load trip." />;
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        width: "100%",
      }}
    >
      <Stack spacing={4}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/trips")}
          sx={{
            alignSelf: "flex-start",
            px: 0,
          }}
        >
          Back to Trips
        </Button>

        <Stack spacing={0.5}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            {trip.name}
          </Typography>

          {trip.description && <Typography color="text.secondary">{trip.description}</Typography>}
        </Stack>

        <TripSummary trip={trip} stops={stops} />

        <Box
          sx={{
            height: 500,
            borderRadius: 3,
            overflow: "hidden",
            mt: 3,
          }}
        >
          <Map stops={stops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} />
        </Box>

        <RouteSummary summary={route?.summary} stopCount={validStops.length} />

        <ItinerarySection
          tripId={trip.id}
          selectedStopId={selectedStopId}
          onStopSelect={setSelectedStopId}
        />

        <BudgetSection tripId={trip.id} routeDistanceKm={routeDistanceKm} />

        <ChecklistSection tripId={trip.id} />
      </Stack>
    </Box>
  );
}
