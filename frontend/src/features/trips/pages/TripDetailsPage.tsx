import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Chip, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import HotelIcon from "@mui/icons-material/Hotel";
import AccommodationsSection from "@/features/accommodations/components/AccommodationsSection";
import BudgetSection from "@/features/budget/components/BudgetSection";
import ChecklistSection from "@/features/checklist/components/ChecklistSection";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import { Map, RouteSummary, useRoute } from "@/shared/maps";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import ItinerarySection from "../components/ItinerarySection";
import TripOverview from "../components/overview/TripOverview";
import { useTrip } from "../hooks/useTrip";
import { useStartTrip } from "../hooks/useStartTrip";
import { useCompleteTrip } from "../hooks/useCompleteTrip";

import AssessmentIcon from "@mui/icons-material/Assessment";
import SpeedIcon from "@mui/icons-material/Speed";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import DocumentsSection from "@/features/documents/components/DocumentsSection";
import EmergencyContactsSection from "@/features/contacts/components/EmergencyContactsSection";
import ReadinessSection from "@/features/readiness/components/ReadinessSection";
import TripSummarySection from "@/features/summary/components/TripSummarySection";

const TAB_KEYS = ["overview", "readiness", "itinerary", "accommodation", "budget", "checklist", "documents", "contacts", "summary"] as const;
type TabKey = (typeof TAB_KEYS)[number];





const STATUS_COLOR_MAP = {
  Planning: "info",
  Active: "success",
  Completed: "secondary",
} as const;

export default function TripDetailsPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const { data: trip, isLoading, isError } = useTrip(tripId ?? "");
  const { data: stops = [] } = useTripStops(tripId ?? "");
  const startTripMutation = useStartTrip();
  const completeTripMutation = useCompleteTrip();

  const validStops = stops.filter(
    (stop) =>
      stop.latitude !== null &&
      stop.longitude !== null &&
      (stop.latitude !== 0 || stop.longitude !== 0)
  );
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

        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                }}
              >
                {trip.name}
              </Typography>
              <Chip
                label={trip.status}
                color={STATUS_COLOR_MAP[trip.status] ?? "default"}
                size="small"
                sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem" }}
              />
            </Stack>


            {trip.description && <Typography color="text.secondary">{trip.description}</Typography>}
          </Stack>

          <Stack direction="row" spacing={1}>
            {trip.status === "Planning" && (
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrowIcon />}
                disabled={startTripMutation.isPending}
                onClick={() => startTripMutation.mutate({ id: trip.id })}
              >
                Start Trip Early
              </Button>
            )}

            {trip.status === "Active" && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CheckCircleIcon />}
                disabled={completeTripMutation.isPending}
                onClick={() => completeTripMutation.mutate({ id: trip.id })}
              >
                Complete Trip
              </Button>
            )}
          </Stack>
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
              icon={<SpeedIcon fontSize="small" />}
              iconPosition="start"
              label="Readiness"
              value="readiness"
              id="trip-tab-readiness"
              aria-controls="trip-tabpanel-readiness"
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
              icon={<HotelIcon fontSize="small" />}
              iconPosition="start"
              label="Accommodation"
              value="accommodation"
              id="trip-tab-accommodation"
              aria-controls="trip-tabpanel-accommodation"
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
            <Tab
              icon={<FolderSpecialIcon fontSize="small" />}
              iconPosition="start"
              label="Documents"
              value="documents"
              id="trip-tab-documents"
              aria-controls="trip-tabpanel-documents"
            />
            <Tab
              icon={<ContactPhoneIcon fontSize="small" />}
              iconPosition="start"
              label="Contacts"
              value="contacts"
              id="trip-tab-contacts"
              aria-controls="trip-tabpanel-contacts"
            />
            <Tab
              icon={<AssessmentIcon fontSize="small" />}
              iconPosition="start"
              label="Summary"
              value="summary"
              id="trip-tab-summary"
              aria-controls="trip-tabpanel-summary"
            />
          </Tabs>
        </Paper>


        {/* Tab Panel 0: Overview Dashboard */}
        {activeTab === "overview" && (
          <Stack spacing={3} role="tabpanel" id="trip-tabpanel-overview" aria-labelledby="trip-tab-overview">
            <TripOverview
              trip={trip}
              onEditBudgetClick={() => setSearchParams({ tab: "budget" })}
              onViewAccommodationsClick={() => setSearchParams({ tab: "accommodation" })}
            />

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

        {/* Tab Panel 1: Readiness Health Score */}
        {activeTab === "readiness" && (
          <Box role="tabpanel" id="trip-tabpanel-readiness" aria-labelledby="trip-tab-readiness">
            <ReadinessSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 2: Itinerary & Map with Bi-Directional Selection Sync */}

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

        {/* Tab Panel 2: Accommodation */}
        {activeTab === "accommodation" && (
          <Box role="tabpanel" id="trip-tabpanel-accommodation" aria-labelledby="trip-tab-accommodation">
            <AccommodationsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 3: Budget */}
        {activeTab === "budget" && (
          <Box role="tabpanel" id="trip-tabpanel-budget" aria-labelledby="trip-tab-budget">
            <BudgetSection tripId={trip.id} routeDistanceKm={routeDistanceKm} />
          </Box>
        )}

        {/* Tab Panel 4: Checklist */}
        {activeTab === "checklist" && (
          <Box role="tabpanel" id="trip-tabpanel-checklist" aria-labelledby="trip-tab-checklist">
            <ChecklistSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 5: Documents */}
        {activeTab === "documents" && (
          <Box role="tabpanel" id="trip-tabpanel-documents" aria-labelledby="trip-tab-documents">
            <DocumentsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 6: Emergency Contacts */}
        {activeTab === "contacts" && (
          <Box role="tabpanel" id="trip-tabpanel-contacts" aria-labelledby="trip-tab-contacts">
            <EmergencyContactsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 7: Trip Summary Report */}
        {activeTab === "summary" && (
          <Box role="tabpanel" id="trip-tabpanel-summary" aria-labelledby="trip-tab-summary">
            <TripSummarySection tripId={trip.id} />
          </Box>
        )}



      </Stack>
    </Box>
  );
}
