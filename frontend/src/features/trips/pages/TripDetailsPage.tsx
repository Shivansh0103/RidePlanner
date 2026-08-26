import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  Grid,
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
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#bef264",
          border: "rgba(190, 242, 100, 0.4)",
          dot: "#bef264",
          label: "ACTIVE / IN-FLIGHT",
          glow: "glow-acid",
        };
      case "Planning":
        return {
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#818cf8",
          border: "rgba(99, 102, 241, 0.4)",
          dot: "#6366f1",
          label: "PLANNING / PRE-FLIGHT",
          glow: "glow-indigo",
        };
      case "Completed":
        return {
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.3)",
          dot: "#64748b",
          label: "COMPLETED / ARCHIVED",
          glow: "",
        };
      default:
        return {
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.3)",
          dot: "#64748b",
          label: status.toUpperCase(),
          glow: "",
        };
    }
  };

  const statusStyle = getStatusStyles(trip.status);

  // Calculate duration
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <Box sx={{ maxWidth: 1440, mx: "auto", width: "100%", pb: 6 }} className="animate-fade-in">
      <Stack spacing={3}>
        {/* 1. Breadcrumbs Navigation */}
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <BreadcrumbsBar
            items={[
              { label: "My Expeditions", to: "/trips" },
              { label: trip.name },
            ]}
          />
          <Button
            size="small"
            onClick={() => navigate("/trips")}
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{
              color: "#94a3b8",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              "&:hover": { color: "#818cf8" },
            }}
          >
            All Expeditions
          </Button>
        </Stack>

        {/* 2. Tactical Cockpit Header Bar */}
        <Paper
          className="neo-convex"
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            bgcolor: "#1a1a1e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={3}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", lg: "center" } }}
          >
            {/* Left Title & Status */}
            <Stack spacing={1}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  className={`font-mono ${statusStyle.glow}`}
                  icon={
                    <Box
                      className={trip.status === "Active" ? "pulse-telemetry" : undefined}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: statusStyle.dot,
                        ml: "6px !important",
                      }}
                    />
                  }
                  label={statusStyle.label}
                  size="small"
                  sx={{
                    bgcolor: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    letterSpacing: "0.06em",
                  }}
                />

                <Typography
                  className="font-mono"
                  variant="caption"
                  sx={{ display: "flex", alignItems: "center", gap: 0.6, fontWeight: 700, color: "#94a3b8" }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 14, color: "#818cf8" }} />
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ({diffDays} {diffDays === 1 ? "Day" : "Days"})
                </Typography>
              </Stack>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  fontStyle: "italic",
                  color: "#f8fafc",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  fontSize: { xs: "1.8rem", sm: "2.4rem" },
                }}
              >
                {trip.name}
              </Typography>

              {trip.description && (
                <Typography variant="body2" sx={{ color: "#94a3b8", maxWidth: 750, lineHeight: 1.6 }}>
                  {trip.description}
                </Typography>
              )}
            </Stack>

            {/* Right Action Controls */}
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
                startIcon={<EditIcon fontSize="small" />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#e2e8f0",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  "&:hover": { borderColor: "#818cf8", color: "#818cf8", bgcolor: "rgba(99, 102, 241, 0.08)" },
                }}
              >
                Edit
              </Button>

              {trip.status === "Planning" && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  disabled={startTripMutation.isPending}
                  onClick={() => startTripMutation.mutate({ id: trip.id })}
                  className="glow-indigo"
                  sx={{
                    bgcolor: "#6366f1",
                    color: "#ffffff",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    px: 2.5,
                    py: 1,
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}
                >
                  Start Expedition
                </Button>
              )}

              {trip.status === "Active" && (
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  disabled={completeTripMutation.isPending}
                  onClick={() => completeTripMutation.mutate({ id: trip.id })}
                  className="glow-acid"
                  sx={{
                    bgcolor: "#bef264",
                    color: "#141313",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    px: 2.5,
                    py: 1,
                    "&:hover": { bgcolor: "#a3e635" },
                  }}
                >
                  Complete Expedition
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* 3. Badged Cockpit Tab Navigation Bar */}
        <Paper
          className="neo-convex"
          sx={{
            borderRadius: 2,
            bgcolor: "#1c1b1b",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Trip Cockpit Navigation Tabs"
            sx={{
              px: 1,
              "& .MuiTabs-indicator": {
                bgcolor: "#bef264",
                height: 3,
                boxShadow: "0 0 10px rgba(190, 242, 100, 0.6)",
              },
              "& .MuiTab-root": {
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                minHeight: 50,
                color: "#94a3b8",
                px: 2,
                "&:hover": { color: "#ffffff" },
                "&.Mui-selected": {
                  color: "#bef264",
                },
              },
            }}
          >
            <Tab icon={<DashboardIcon fontSize="small" />} iconPosition="start" label="Overview" value="overview" id="trip-tab-overview" />
            <Tab icon={<SpeedIcon fontSize="small" />} iconPosition="start" label="Readiness" value="readiness" id="trip-tab-readiness" />
            <Tab
              icon={<AltRouteIcon fontSize="small" />}
              iconPosition="start"
              label={
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                  <span>Itinerary</span>
                  {stops.length > 0 && (
                    <Box
                      className="neo-inset font-mono"
                      sx={{
                        px: 1,
                        py: 0.2,
                        borderRadius: 1,
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        bgcolor: activeTab === "itinerary" ? "rgba(190, 242, 100, 0.2)" : "#141313",
                        color: activeTab === "itinerary" ? "#bef264" : "#94a3b8",
                      }}
                    >
                      {stops.length}
                    </Box>
                  )}
                </Stack>
              }
              value="itinerary"
              id="trip-tab-itinerary"
            />
            <Tab icon={<HotelIcon fontSize="small" />} iconPosition="start" label="Accommodation" value="accommodation" id="trip-tab-accommodation" />
            <Tab icon={<AccountBalanceWalletIcon fontSize="small" />} iconPosition="start" label="Budget & Costs" value="budget" id="trip-tab-budget" />
            <Tab icon={<ChecklistRtlIcon fontSize="small" />} iconPosition="start" label="Checklist & Gear" value="checklist" id="trip-tab-checklist" />
            <Tab icon={<FolderSpecialIcon fontSize="small" />} iconPosition="start" label="Documents" value="documents" id="trip-tab-documents" />
            <Tab icon={<ContactPhoneIcon fontSize="small" />} iconPosition="start" label="Safety & ICE" value="contacts" id="trip-tab-contacts" />
            <Tab icon={<AssessmentIcon fontSize="small" />} iconPosition="start" label="Summary" value="summary" id="trip-tab-summary" />
            <Tab icon={<CollectionsIcon fontSize="small" />} iconPosition="start" label="Memories" value="memories" id="trip-tab-memories" />
          </Tabs>
        </Paper>

        {/* 4. Tab Panels */}
        {/* Tab 0: Overview Dashboard (Bento Layout) */}
        {activeTab === "overview" && (
          <Grid container spacing={3} role="tabpanel" id="trip-tabpanel-overview" aria-labelledby="trip-tab-overview">
            {/* Left 65% Bento Column */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3}>
                {/* Interactive Map Viewport with Telemetry HUD */}
                <Paper
                  className="glass-panel"
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    bgcolor: "#1a1a1e",
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ p: 2, alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <TwoWheelerIcon sx={{ color: "#bef264", fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}>
                        Tactical Navigation Map
                      </Typography>
                    </Stack>
                    <Button
                      size="small"
                      onClick={() => setSearchParams({ tab: "itinerary" })}
                      sx={{
                        color: "#818cf8",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      Manage Waypoints →
                    </Button>
                  </Stack>

                  <Box sx={{ height: 420, position: "relative" }}>
                    <Map stops={stops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} />

                    {/* Floating Glass Telemetry HUD */}
                    <Box
                      className="glass-panel"
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        zIndex: 10,
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                        gap: 2.5,
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography className="font-mono" sx={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          Distance
                        </Typography>
                        <Typography className="font-mono" sx={{ fontSize: "0.95rem", color: "#f8fafc", fontWeight: 800 }}>
                          {routeDistanceKm > 0 ? `${routeDistanceKm.toFixed(1)} km` : `${stops.length} Stops`}
                        </Typography>
                      </Box>
                      <Box sx={{ width: "1px", height: 24, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
                      <Box>
                        <Typography className="font-mono" sx={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          Duration
                        </Typography>
                        <Typography className="font-mono" sx={{ fontSize: "0.95rem", color: "#bef264", fontWeight: 800 }}>
                          {diffDays} Days
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                <TripOverview
                  trip={trip}
                  onEditBudgetClick={() => setSearchParams({ tab: "budget" })}
                  onViewAccommodationsClick={() => setSearchParams({ tab: "accommodation" })}
                />
              </Stack>
            </Grid>

            {/* Right 35% Bento Column (Quick Telemetry Gauges) */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={3}>
                <Paper
                  className="glass-panel"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#1a1a1e",
                  }}
                >
                  <ReadinessSection tripId={trip.id} />
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Readiness Section */}
        {activeTab === "readiness" && (
          <Box role="tabpanel" id="trip-tabpanel-readiness" aria-labelledby="trip-tab-readiness">
            <ReadinessSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 2: Itinerary & Waypoints */}
        {activeTab === "itinerary" && (
          <Stack spacing={3} role="tabpanel" id="trip-tabpanel-itinerary" aria-labelledby="trip-tab-itinerary">
            <Paper
              className="glass-panel"
              sx={{
                height: 480,
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Map stops={stops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} />
            </Paper>

            <RouteSummary summary={route?.summary} stopCount={validStops.length} />

            <ItinerarySection
              tripId={trip.id}
              selectedStopId={selectedStopId}
              onStopSelect={setSelectedStopId}
              routeLegs={route?.legs}
            />
          </Stack>
        )}

        {/* Tab 3: Accommodations */}
        {activeTab === "accommodation" && (
          <Box role="tabpanel" id="trip-tabpanel-accommodation" aria-labelledby="trip-tab-accommodation">
            <AccommodationsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 4: Budget & Fuel */}
        {activeTab === "budget" && (
          <Box role="tabpanel" id="trip-tabpanel-budget" aria-labelledby="trip-tab-budget">
            <BudgetSection tripId={trip.id} routeDistanceKm={routeDistanceKm} />
          </Box>
        )}

        {/* Tab 5: Checklist & Gear */}
        {activeTab === "checklist" && (
          <Box role="tabpanel" id="trip-tabpanel-checklist" aria-labelledby="trip-tab-checklist">
            <ChecklistSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 6: Documents & Permits */}
        {activeTab === "documents" && (
          <Box role="tabpanel" id="trip-tabpanel-documents" aria-labelledby="trip-tab-documents">
            <DocumentsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 7: Emergency Contacts */}
        {activeTab === "contacts" && (
          <Box role="tabpanel" id="trip-tabpanel-contacts" aria-labelledby="trip-tab-contacts">
            <EmergencyContactsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 8: Summary Report */}
        {activeTab === "summary" && (
          <Box role="tabpanel" id="trip-tabpanel-summary" aria-labelledby="trip-tab-summary">
            <TripSummarySection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 9: Memories & Notes */}
        {activeTab === "memories" && (
          <Box role="tabpanel" id="trip-tabpanel-memories" aria-labelledby="trip-tab-memories">
            <MemoriesSection tripId={trip.id} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
