import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Button, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import BudgetSection from "@/features/budget/components/BudgetSection";
import ChecklistSection from "@/features/checklist/components/ChecklistSection";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import { Map, RouteSummary, useRoute } from "@/shared/maps";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import ItinerarySection from "../components/ItinerarySection";
import TripOverview from "../components/overview/TripOverview";
import { useTrip } from "../hooks/useTrip";

const TAB_KEYS = ["overview", "itinerary", "budget", "checklist"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function TripDetailsPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const { data: trip, isLoading, isError } = useTrip(tripId ?? "");
  const { data: stops = [] } = useTripStops(tripId ?? "");

  const validStops = stops.filter((stop) => stop.latitude !== null && stop.longitude !== null);
  const { route } = useRoute(validStops);

  const routeDistanceKm = (route?.summary?.distanceMeters ?? 0) / 1000;

  // Determine active tab from URL query param (?tab=...)
  const currentTabParam = searchParams.get("tab");
  const activeTab: TabKey = TAB_KEYS.includes(currentTabParam as TabKey)
    ? (currentTabParam as TabKey)
    : "overview";

  const handleTabChange = (_: React.SyntheticEvent, newTab: TabKey) => {
    setSearchParams({ tab: newTab }, { replace: true });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !trip) {
    return <ErrorState message="Unable to load trip." />;
  }

  return (
    <Box
      sx={{
        maxWidth: 950,
        mx: "auto",
        width: "100%",
        pb: 6,
      }}
    >
      <Stack spacing={3}>
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

        {/* Tab Navigation Header */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Trip planning section tabs"
            sx={{
              px: 1,
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
                minHeight: 48,
                fontSize: "0.95rem",
              },
            }}
          >
            <Tab
              icon={<DashboardIcon fontSize="small" />}
              iconPosition="start"
              label="Overview"
              value="overview"
              id="trip-tab-overview"
              aria-controls="trip-tabpanel-overview"
            />
            <Tab
              icon={<AltRouteIcon fontSize="small" />}
              iconPosition="start"
              label="Itinerary & Route"
              value="itinerary"
              id="trip-tab-itinerary"
              aria-controls="trip-tabpanel-itinerary"
            />
            <Tab
              icon={<AccountBalanceWalletIcon fontSize="small" />}
              iconPosition="start"
              label="Budget & Costs"
              value="budget"
              id="trip-tab-budget"
              aria-controls="trip-tabpanel-budget"
            />
            <Tab
              icon={<ChecklistRtlIcon fontSize="small" />}
              iconPosition="start"
              label="Checklist & Gear"
              value="checklist"
              id="trip-tab-checklist"
              aria-controls="trip-tabpanel-checklist"
            />
          </Tabs>
        </Paper>

        {/* Tab Panel 0: Overview Dashboard */}
        {activeTab === "overview" && (
          <Stack spacing={3} role="tabpanel" id="trip-tabpanel-overview" aria-labelledby="trip-tab-overview">
            <TripOverview trip={trip} onEditBudgetClick={() => setSearchParams({ tab: "budget" })} />

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Route Overview Map
              </Typography>
              <Box
                sx={{
                  height: 380,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Map stops={stops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} />
              </Box>
            </Paper>
          </Stack>
        )}

        {/* Tab Panel 1: Itinerary & Map with Bi-Directional Selection Sync */}
        {activeTab === "itinerary" && (
          <Stack spacing={3} role="tabpanel" id="trip-tabpanel-itinerary" aria-labelledby="trip-tab-itinerary">
            <Box
              sx={{
                height: 460,
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Map stops={stops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} />
            </Box>

            <RouteSummary summary={route?.summary} stopCount={validStops.length} />

            <ItinerarySection
              tripId={trip.id}
              selectedStopId={selectedStopId}
              onStopSelect={setSelectedStopId}
              routeLegs={route?.legs}
            />
          </Stack>
        )}

        {/* Tab Panel 2: Budget */}
        {activeTab === "budget" && (
          <Box role="tabpanel" id="trip-tabpanel-budget" aria-labelledby="trip-tab-budget">
            <BudgetSection tripId={trip.id} routeDistanceKm={routeDistanceKm} />
          </Box>
        )}

        {/* Tab Panel 3: Checklist */}
        {activeTab === "checklist" && (
          <Box role="tabpanel" id="trip-tabpanel-checklist" aria-labelledby="trip-tab-checklist">
            <ChecklistSection tripId={trip.id} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
