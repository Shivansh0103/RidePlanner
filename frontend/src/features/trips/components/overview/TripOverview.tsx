import { Box, Grid, Stack } from "@mui/material";

import { useTripBudget } from "@/features/budget/hooks/useTripBudget";
import { useTripChecklist } from "@/features/checklist/hooks/useTripChecklist";
import type { Trip } from "@/features/trips/types/trip";
import {
  calculatePlanningProgress,
  deriveTripAlerts,
  determineNextStop,
} from "@/features/trips/utils/tripOverviewSelectors";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import { useRoute } from "@/shared/maps";

import ReadinessWidget from "@/features/readiness/components/ReadinessWidget";

import OverviewAccommodationCard from "./OverviewAccommodationCard";
import OverviewAlerts from "./OverviewAlerts";
import OverviewBudgetCard from "./OverviewBudgetCard";
import OverviewHeader from "./OverviewHeader";
import OverviewItineraryCard from "./OverviewItineraryCard";
import OverviewPreparationCard from "./OverviewPreparationCard";
import OverviewProgressCard from "./OverviewProgressCard";


interface TripOverviewProps {
  trip: Trip;
  onEditBudgetClick?: () => void;
  onViewAccommodationsClick?: () => void;
}

export default function TripOverview({
  trip,
  onEditBudgetClick,
  onViewAccommodationsClick,
}: TripOverviewProps) {
  const { data: stops = [] } = useTripStops(trip.id);
  const { data: budget } = useTripBudget(trip.id);
  const { data: checklist } = useTripChecklist(trip.id);

  const validStops = stops.filter(
    (stop) =>
      stop.latitude !== null &&
      stop.longitude !== null &&
      (stop.latitude !== 0 || stop.longitude !== 0)
  );
  const { route } = useRoute(validStops);

  // Derived selectors
  const alerts = deriveTripAlerts(trip, stops, budget, checklist);
  const nextStopInfo = determineNextStop(stops, trip.startDate, trip.endDate);
  const progress = calculatePlanningProgress(stops, budget, checklist);

  return (
    <Box component="section" aria-label="Trip Overview Command Center">
      <Stack spacing={3}>
        {/* Command Center Hero Header */}
        <OverviewHeader
          trip={trip}
          stopCount={stops.length}
          routeDistanceMeters={route?.summary?.distanceMeters}
          routeDurationMillis={route?.summary?.durationMillis}
        />

        {/* Pre-Ride Readiness Health Score Widget */}
        <ReadinessWidget tripId={trip.id} />

        {/* Conservative Smart Alerts */}
        <OverviewAlerts alerts={alerts} />


        {/* Compact Overview Widgets Grid */}
        <Grid container spacing={2.5}>
          {/* Row 1, Col 1: Planning Progress */}
          <Grid size={{ xs: 12, md: 6 }}>
            <OverviewProgressCard
              checklistPercentage={progress.checklistPercentage}
              completedItemsCount={checklist?.completedItemsCount ?? 0}
              totalItemsCount={checklist?.totalItemsCount ?? 0}
              budgetPercentage={progress.budgetPercentage}
              estimatedCost={budget?.estimatedCost ?? 0}
              targetBudget={budget?.targetBudget ?? 0}
              itineraryPercentage={progress.itineraryPercentage}
              validStopsCount={progress.validStopsCount}
            />
          </Grid>

          {/* Row 1, Col 2: Itinerary Snapshot */}
          <Grid size={{ xs: 12, md: 6 }}>
            <OverviewItineraryCard
              nextStopInfo={nextStopInfo}
              totalStops={stops.length}
              routeDistanceMeters={route?.summary?.distanceMeters}
              routeDurationMillis={route?.summary?.durationMillis}
            />
          </Grid>

          {/* Row 2, Col 1: Accommodation Snapshot */}
          <Grid size={{ xs: 12, md: 6 }}>
            <OverviewAccommodationCard
              tripId={trip.id}
              onViewAccommodations={onViewAccommodationsClick}
            />
          </Grid>

          {/* Row 2, Col 2: Preparation Action Items Snapshot */}
          <Grid size={{ xs: 12, md: 6 }}>
            <OverviewPreparationCard tripId={trip.id} checklist={checklist} />
          </Grid>

          {/* Row 3: Budget Overview Snapshot */}
          <Grid size={{ xs: 12 }}>
            <OverviewBudgetCard budget={budget} onEditBudget={onEditBudgetClick} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
