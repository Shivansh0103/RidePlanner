import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import CollectionsIcon from "@mui/icons-material/Collections";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditIcon from "@mui/icons-material/Edit";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import HotelIcon from "@mui/icons-material/Hotel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SpeedIcon from "@mui/icons-material/Speed";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { AccommodationsSection } from "@/features/accommodations";
import { BudgetSection } from "@/features/budget";
import { ChecklistSection } from "@/features/checklist";
import { EmergencyContactsSection } from "@/features/contacts";
import { DocumentsSection } from "@/features/documents";
import { MemoriesSection } from "@/features/memories";
import { ReadinessSection } from "@/features/readiness";
import { TripSummarySection } from "@/features/summary";
import { useTripStops } from "@/features/tripStops";
import { ItinerarySection, TripOverview, useCompleteTrip, useStartTrip, useTrip } from "@/features/trips";
import { BreadcrumbsBar } from "@/shared/components";
import { Map, RouteSummary, useRoute } from "@/shared/maps";
import { ErrorState } from "@/shared/ui";
import { formatDate } from "@/shared/utils";

import TripDetailsSkeleton from "../components/TripDetailsSkeleton";

const TAB_KEYS = [
  "overview",
  "readiness",
  "itinerary",
  "accommodation",
  "budget",
  "checklist",
  "documents",
  "contacts",
  "summary",
  "memories",
] as const;
type TabKey = (typeof TAB_KEYS)[number];

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
    return <TripDetailsSkeleton />;
  }

  if (isError || !trip) {
    return <ErrorState message="Unable to load trip expedition details." />;
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return {
          bg: "rgba(16, 185, 129, 0.12)",
          color: "#059669",
          border: "rgba(16, 185, 129, 0.3)",
          dot: "#10b981",
        };
      case "Planning":
        return {
          bg: "rgba(37, 99, 235, 0.1)",
          color: "#2563eb",
          border: "rgba(37, 99, 235, 0.25)",
          dot: "#3b82f6",
        };
      case "Completed":
        return {
          bg: "rgba(100, 116, 139, 0.1)",
          color: "#475569",
          border: "rgba(100, 116, 139, 0.2)",
          dot: "#64748b",
        };
      default:
        return {
          bg: "rgba(100, 116, 139, 0.1)",
          color: "#475569",
          border: "rgba(100, 116, 139, 0.2)",
          dot: "#64748b",
        };
    }
  };

  const statusStyle = getStatusStyles(trip.status);

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", width: "100%", pb: 6 }} className="animate-fade-in">
      <Stack spacing={3}>
        {/* 1. Breadcrumbs Trail */}
        <BreadcrumbsBar
          items={[
            { label: "My Trips", to: "/trips" },
            { label: trip.name },
          ]}
        />

        {/* 2. Expedition Lifecycle Hero Header */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "rgba(15, 23, 42, 0.08)",
            boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.03)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2.5}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
          >
            <Stack spacing={1}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Chip
                  icon={
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: statusStyle.dot,
                        ml: "6px !important",
                      }}
                    />
                  }
                  label={trip.status.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.02em",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 500 }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 16 }} />
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.2,
                }}
              >
                {trip.name}
              </Typography>

              {trip.description && (
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 700 }}>
                  {trip.description}
                </Typography>
              )}
            </Stack>

            {/* Lifecycle & Action Buttons */}
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
                startIcon={<EditIcon />}
                sx={{ fontWeight: 600 }}
              >
                Edit
              </Button>

              {trip.status === "Planning" && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  disabled={startTripMutation.isPending}
                  onClick={() => startTripMutation.mutate({ id: trip.id })}
                  sx={{
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  }}
                >
                  Start Expedition
                </Button>
              )}

              {trip.status === "Active" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  disabled={completeTripMutation.isPending}
                  onClick={() => completeTripMutation.mutate({ id: trip.id })}
                  sx={{
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                  }}
                >
                  Complete Expedition
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* 3. Badged Tab Navigation Header */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            bgcolor: "background.paper",
            borderColor: "rgba(15, 23, 42, 0.08)",
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
                fontSize: "0.92rem",
                px: 2,
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
              label={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <span>Itinerary</span>
                  {stops.length > 0 && (
                    <Chip
                      label={stops.length}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor: activeTab === "itinerary" ? "primary.main" : "action.selected",
                        color: activeTab === "itinerary" ? "#ffffff" : "text.secondary",
                      }}
                    />
                  )}
                </Stack>
              }
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
            <Tab
              icon={<CollectionsIcon fontSize="small" />}
              iconPosition="start"
              label="Memories"
              value="memories"
              id="trip-tab-memories"
              aria-controls="trip-tabpanel-memories"
            />
          </Tabs>
        </Paper>

        {/* 4. Tab Panels */}
        {/* Tab Panel 0: Overview Dashboard */}
        {activeTab === "overview" && (
          <Stack spacing={3} role="tabpanel" id="trip-tabpanel-overview" aria-labelledby="trip-tab-overview">
            <TripOverview
              trip={trip}
              onEditBudgetClick={() => setSearchParams({ tab: "budget" })}
              onViewAccommodationsClick={() => setSearchParams({ tab: "accommodation" })}
            />

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                <TwoWheelerIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Route Expedition Map
                </Typography>
              </Stack>

              <Box
                sx={{
                  height: 400,
                  borderRadius: 2.5,
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

        {/* Tab Panel 2: Itinerary & Map */}
        {activeTab === "itinerary" && (
          <Stack spacing={3} role="tabpanel" id="trip-tabpanel-itinerary" aria-labelledby="trip-tab-itinerary">
            <Box
              sx={{
                height: 480,
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "rgba(15, 23, 42, 0.08)",
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

        {/* Tab Panel 3: Accommodation */}
        {activeTab === "accommodation" && (
          <Box role="tabpanel" id="trip-tabpanel-accommodation" aria-labelledby="trip-tab-accommodation">
            <AccommodationsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 4: Budget */}
        {activeTab === "budget" && (
          <Box role="tabpanel" id="trip-tabpanel-budget" aria-labelledby="trip-tab-budget">
            <BudgetSection tripId={trip.id} routeDistanceKm={routeDistanceKm} />
          </Box>
        )}

        {/* Tab Panel 5: Checklist */}
        {activeTab === "checklist" && (
          <Box role="tabpanel" id="trip-tabpanel-checklist" aria-labelledby="trip-tab-checklist">
            <ChecklistSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 6: Documents */}
        {activeTab === "documents" && (
          <Box role="tabpanel" id="trip-tabpanel-documents" aria-labelledby="trip-tab-documents">
            <DocumentsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 7: Emergency Contacts */}
        {activeTab === "contacts" && (
          <Box role="tabpanel" id="trip-tabpanel-contacts" aria-labelledby="trip-tab-contacts">
            <EmergencyContactsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 8: Trip Summary Report */}
        {activeTab === "summary" && (
          <Box role="tabpanel" id="trip-tabpanel-summary" aria-labelledby="trip-tab-summary">
            <TripSummarySection tripId={trip.id} />
          </Box>
        )}

        {/* Tab Panel 9: Memories & Journal */}
        {activeTab === "memories" && (
          <Box role="tabpanel" id="trip-tabpanel-memories" aria-labelledby="trip-tab-memories">
            <MemoriesSection tripId={trip.id} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
