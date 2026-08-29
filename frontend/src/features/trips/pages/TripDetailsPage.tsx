import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
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
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SpeedIcon from "@mui/icons-material/Speed";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { AccommodationsSection, useAccommodations } from "@/features/accommodations";
import { BudgetSection, useTripBudget } from "@/features/budget";
import { ChecklistSection, type ChecklistItem, useToggleChecklistItem, useTripChecklist } from "@/features/checklist";
import { EmergencyContactsSection } from "@/features/contacts";
import { DocumentsSection } from "@/features/documents";
import { MemoriesSection } from "@/features/memories";
import { ReadinessSection, useTripReadiness } from "@/features/readiness";
import { TripSummarySection } from "@/features/summary";
import { useTripStops } from "@/features/tripStops";
import { ItinerarySection, useCompleteTrip, useStartTrip, useTrip } from "@/features/trips";
import { BreadcrumbsBar } from "@/shared/components";
import { Map, RouteSummary, useRoute } from "@/shared/maps";
import { ErrorState } from "@/shared/ui";
import { formatCurrency, formatDate } from "@/shared/utils";

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
  const { data: budget } = useTripBudget(tripId ?? "");
  const { data: checklist } = useTripChecklist(tripId ?? "");
  const { data: accommodations = [] } = useAccommodations(tripId ?? "");
  const { data: readinessData } = useTripReadiness(tripId ?? "");

  const startTripMutation = useStartTrip();
  const completeTripMutation = useCompleteTrip();
  const toggleItemMutation = useToggleChecklistItem(tripId ?? "");

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

  // Auto-scroll timeline to selected stop when clicked from map or list
  useEffect(() => {
    if (selectedStopId) {
      const el = document.getElementById(`timeline-stop-${selectedStopId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedStopId]);

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
          bg: "rgba(20, 19, 19, 0.9)",
          color: "#bef264",
          border: "rgba(190, 242, 100, 0.4)",
          dot: "#bef264",
          label: "ACTIVE / IN-FLIGHT",
          glow: "glow-acid",
        };
      case "Planning":
        return {
          bg: "rgba(20, 19, 19, 0.9)",
          color: "#818cf8",
          border: "rgba(99, 102, 241, 0.4)",
          dot: "#6366f1",
          label: "PLANNING / PRE-FLIGHT",
          glow: "glow-indigo",
        };
      case "Completed":
        return {
          bg: "rgba(20, 19, 19, 0.9)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.3)",
          dot: "#64748b",
          label: "COMPLETED / ARCHIVED",
          glow: "",
        };
      default:
        return {
          bg: "rgba(20, 19, 19, 0.9)",
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

  // Readiness Score
  const overallReadinessScore = readinessData?.scorePercentage ?? 0;

  // Budget calculations
  const spentAmount = budget?.estimatedCost ?? 0;
  const targetBudget = budget?.targetBudget ?? 0;
  const budgetPercent = targetBudget > 0 ? Math.min(100, Math.round((spentAmount / targetBudget) * 100)) : 0;

  // Next Accommodation
  const nextStay = accommodations[0];

  // Checklist items preview across categories
  const allChecklistItems: ChecklistItem[] = (checklist?.categories ?? []).flatMap((c) => c.items);
  const checklistItems = allChecklistItems.slice(0, 4);

  return (
    <Box sx={{ width: "100%", pb: 6 }} className="animate-fade-in">
      <Stack spacing={2.5}>
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
            startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
            sx={{
              color: "#94a3b8",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.7rem",
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
            p: { xs: 2, sm: 2.8 },
            borderRadius: 2.5,
            bgcolor: "#1a1a1e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
          >
            {/* Title & Status */}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.8, flexWrap: "wrap", gap: 0.8 }}>
                <Chip
                  className={`font-mono ${statusStyle.glow}`}
                  icon={
                    <Box
                      className={trip.status === "Active" ? "pulse-telemetry" : undefined}
                      sx={{
                        width: 7,
                        height: 7,
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
                    fontSize: "0.68rem",
                    letterSpacing: "0.04em",
                  }}
                />

                <Typography
                  className="font-mono"
                  variant="caption"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 700, color: "#94a3b8", fontSize: "0.72rem" }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 13, color: "#818cf8" }} />
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ({diffDays} {diffDays === 1 ? "Day" : "Days"})
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  fontStyle: "italic",
                  color: "#f8fafc",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  fontSize: { xs: "1.6rem", sm: "2rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {trip.name}
              </Typography>

              {trip.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#94a3b8",
                    maxWidth: 700,
                    lineHeight: 1.4,
                    fontSize: "0.82rem",
                    mt: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {trip.description}
                </Typography>
              )}
            </Box>

            {/* Action Buttons (Shrink-0 to prevent clipping) */}
            <Stack direction="row" spacing={1.2} sx={{ flexShrink: 0, alignItems: "center" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#e2e8f0",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  py: 0.8,
                  "&:hover": { borderColor: "#818cf8", color: "#818cf8" },
                }}
              >
                Edit
              </Button>

              {trip.status === "Planning" && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                  disabled={startTripMutation.isPending}
                  onClick={() => startTripMutation.mutate({ id: trip.id })}
                  className="glow-indigo"
                  sx={{
                    bgcolor: "#6366f1",
                    color: "#ffffff",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    px: 2,
                    py: 0.8,
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}
                >
                  Start Expedition
                </Button>
              )}

              {trip.status === "Active" && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                  disabled={completeTripMutation.isPending}
                  onClick={() => completeTripMutation.mutate({ id: trip.id })}
                  className="glow-acid"
                  sx={{
                    bgcolor: "#bef264",
                    color: "#141313",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    px: 2,
                    py: 0.8,
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#a3e635" },
                  }}
                >
                  Complete Expedition
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* 3. Sleek Cockpit Tab Navigation Bar (Mobile / Drawer only to avoid duplicating left sidebar on desktop) */}
        <Paper
          className="neo-convex"
          sx={{
            display: { xs: "block", md: "none" },
            borderRadius: 2,
            bgcolor: "#18181b",
            border: "1px solid rgba(255, 255, 255, 0.08)",
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
              px: 0.5,
              minHeight: 44,
              "& .MuiTabs-indicator": {
                bgcolor: "#bef264",
                height: 2.5,
                boxShadow: "0 0 10px rgba(190, 242, 100, 0.6)",
              },
              "& .MuiTab-root": {
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                minHeight: 44,
                py: 0.5,
                px: 1.5,
                color: "#a1a1aa",
                "&:hover": { color: "#ffffff" },
                "&.Mui-selected": {
                  color: "#bef264",
                },
              },
            }}
          >
            <Tab icon={<DashboardIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Overview" value="overview" />
            <Tab icon={<SpeedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Readiness" value="readiness" />
            <Tab
              icon={<AltRouteIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label={
                <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                  <span>Itinerary</span>
                  {stops.length > 0 && (
                    <Box
                      className="neo-inset font-mono"
                      sx={{
                        px: 0.8,
                        py: 0.1,
                        borderRadius: 1,
                        fontSize: "0.6rem",
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
            />
            <Tab icon={<HotelIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Accommodation" value="accommodation" />
            <Tab icon={<AccountBalanceWalletIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Budget & Costs" value="budget" />
            <Tab icon={<ChecklistRtlIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Checklist & Gear" value="checklist" />
            <Tab icon={<FolderSpecialIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Documents" value="documents" />
            <Tab icon={<ContactPhoneIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Safety & ICE" value="contacts" />
            <Tab icon={<AssessmentIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Summary" value="summary" />
            <Tab icon={<CollectionsIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Memories" value="memories" />
          </Tabs>
        </Paper>

        {/* 4. Tab Panels */}
        {/* Tab 0: Authentic Stitch Overview Bento Grid */}
        {activeTab === "overview" && (
          <Stack spacing={2.5} role="tabpanel">
            {/* Top Row: Tactical Navigation Map + Route Timeline Side-by-Side */}
            <Grid container spacing={2.5}>
              {/* Left Column: Interactive Map Viewport with Telemetry HUD */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Paper
                  className="glass-panel neo-convex"
                  sx={{
                    position: "relative",
                    borderRadius: 2.5,
                    overflow: "hidden",
                    bgcolor: "#1a1a1e",
                    height: 480,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      p: 1.5,
                      px: 2,
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                      bgcolor: "#141313",
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <TwoWheelerIcon sx={{ color: "#bef264", fontSize: 18 }} />
                      <Typography variant="subtitle2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc", fontSize: "0.85rem" }}>
                        Tactical Navigation Display
                      </Typography>
                    </Stack>
                    <Button
                      size="small"
                      onClick={() => setSearchParams({ tab: "itinerary" })}
                      sx={{
                        color: "#818cf8",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      Manage Waypoints →
                    </Button>
                  </Stack>

                  <Box sx={{ flex: 1, position: "relative", minHeight: 0 }}>
                    <Map stops={stops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} />

                    {/* Floating Glass Telemetry HUD */}
                    <Box
                      className="glass-panel"
                      sx={{
                        position: "absolute",
                        bottom: 14,
                        left: 14,
                        zIndex: 10,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography className="font-mono" sx={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          Distance
                        </Typography>
                        <Typography className="font-mono" sx={{ fontSize: "0.9rem", color: "#f8fafc", fontWeight: 800 }}>
                          {routeDistanceKm > 0 ? `${routeDistanceKm.toFixed(1)} km` : `${stops.length} Stops`}
                        </Typography>
                      </Box>
                      <Box sx={{ width: "1px", height: 20, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
                      <Box>
                        <Typography className="font-mono" sx={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          Duration
                        </Typography>
                        <Typography className="font-mono" sx={{ fontSize: "0.9rem", color: "#bef264", fontWeight: 800 }}>
                          {diffDays} Days
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column: Route Timeline Card Directly Next to Map */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper
                  className="glass-panel neo-convex"
                  sx={{
                    p: 2.2,
                    borderRadius: 2.5,
                    bgcolor: "#1a1a1e",
                    height: 480,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.8 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <AltRouteIcon sx={{ color: "#818cf8", fontSize: 18 }} />
                      <Typography variant="subtitle1" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc", fontSize: "0.95rem" }}>
                        Route Timeline
                      </Typography>
                      <Box
                        className="neo-inset font-mono"
                        sx={{
                          px: 1,
                          py: 0.2,
                          borderRadius: 1,
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          color: "#818cf8",
                        }}
                      >
                        {stops.length} Stops
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={() => setSearchParams({ tab: "itinerary" })}
                        startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          color: "#818cf8",
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "0.68rem",
                          fontWeight: 700,
                        }}
                      >
                        Add Stop
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setSearchParams({ tab: "accommodation" })}
                        startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          color: "#bef264",
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "0.68rem",
                          fontWeight: 700,
                        }}
                      >
                        Add Stay
                      </Button>
                    </Stack>
                  </Stack>

                  {stops.length === 0 ? (
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3, textAlign: "center" }}>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        No waypoints mapped yet. Add starting point and stops in the Itinerary tab.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        pr: 0.8,
                        "&::-webkit-scrollbar": {
                          width: "5px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(255, 255, 255, 0.12)",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      <Stack spacing={1.2}>
                        {stops.map((stop, idx) => {
                          const isSelected = selectedStopId === stop.id;
                          return (
                            <Box
                              key={stop.id}
                              id={`timeline-stop-${stop.id}`}
                              className={isSelected ? "neo-convex" : "neo-inset"}
                              onClick={() => setSelectedStopId(isSelected ? null : stop.id)}
                              sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                bgcolor: isSelected ? "rgba(99, 102, 241, 0.18)" : "#141313",
                                border: isSelected ? "1px solid #6366f1" : "1px solid rgba(255, 255, 255, 0.04)",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: "#818cf8",
                                  bgcolor: isSelected ? "rgba(99, 102, 241, 0.25)" : "#1c1b1f",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  bgcolor: isSelected ? "#6366f1" : "#27272a",
                                  border: isSelected ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.15)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.72rem",
                                  fontWeight: 800,
                                  color: "#ffffff",
                                  fontFamily: '"JetBrains Mono", monospace',
                                  flexShrink: 0,
                                  boxShadow: isSelected ? "0 0 10px rgba(99, 102, 241, 0.5)" : "none",
                                }}
                              >
                                {idx + 1}
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700, color: isSelected ? "#818cf8" : "#f8fafc", fontSize: "0.82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {stop.name}
                                  {idx === 0 && (
                                    <Box component="span" sx={{ ml: 1, fontSize: "0.62rem", bgcolor: "#27272a", px: 1, py: 0.2, borderRadius: 1, color: "#a1a1aa" }}>
                                      Start
                                    </Box>
                                  )}
                                </Typography>
                              </Box>
                              {stop.notes && (
                                <Typography className="font-mono" sx={{ color: "#94a3b8", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                                  {stop.notes}
                                </Typography>
                              )}
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* Bottom Row: 4-Column Expedition Telemetry Bento Grid */}
            <Grid container spacing={2.5}>
              {/* 1. Readiness Health Score Card */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper
                  className="glass-panel neo-convex"
                  sx={{
                    p: 2.2,
                    borderRadius: 2.5,
                    bgcolor: "#1a1a1e",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      className="font-mono"
                      sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", mb: 1.5 }}
                    >
                      Expedition Readiness
                    </Typography>

                    <Stack direction="row" spacing={1.8} sx={{ alignItems: "center", mb: 1.5 }}>
                      <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={54}
                          thickness={5}
                          sx={{ color: "#27272a" }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={overallReadinessScore}
                          size={54}
                          thickness={5}
                          sx={{
                            color: overallReadinessScore >= 80 ? "#bef264" : "#fbbf24",
                            position: "absolute",
                            left: 0,
                            filter: overallReadinessScore >= 80 ? "drop-shadow(0 0 6px rgba(190, 242, 100, 0.5))" : "none",
                          }}
                        />
                        <Box sx={{ position: "absolute", textAlign: "center" }}>
                          <Typography className="font-mono" sx={{ fontSize: "0.78rem", fontWeight: 800, color: "#f8fafc" }}>
                            {overallReadinessScore}%
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ color: "#f8fafc", fontWeight: 600, fontSize: "0.78rem", lineHeight: 1.3 }}>
                          {overallReadinessScore === 100
                            ? "All mission checklists nominal."
                            : "Pending pre-ride items."}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => setSearchParams({ tab: "readiness" })}
                          sx={{ color: "#818cf8", fontSize: "0.68rem", p: 0, mt: 0.3, textTransform: "none", fontWeight: 700 }}
                        >
                          Inspect Breakdown →
                        </Button>
                      </Box>
                    </Stack>
                  </Box>

                  {overallReadinessScore < 100 && (
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: "rgba(251, 191, 36, 0.08)",
                        border: "1px solid rgba(251, 191, 36, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                      }}
                    >
                      <WarningAmberIcon sx={{ color: "#fbbf24", fontSize: 14 }} />
                      <Typography sx={{ color: "#fbbf24", fontSize: "0.68rem", fontWeight: 600 }}>
                        Tasks require attention.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* 2. Fuel & Expense Budget Card */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper
                  className="glass-panel neo-convex"
                  sx={{
                    p: 2.2,
                    borderRadius: 2.5,
                    bgcolor: "#1a1a1e",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography
                        className="font-mono"
                        sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                      >
                        Budget Tracking
                      </Typography>
                      <Typography className="font-mono" sx={{ color: "#818cf8", fontSize: "0.68rem", fontWeight: 800 }}>
                        {budgetPercent}% Used
                      </Typography>
                    </Stack>

                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
                      <Typography className="font-mono" sx={{ fontSize: "1rem", fontWeight: 800, color: "#f8fafc" }}>
                        {formatCurrency(spentAmount)}
                        <Box component="span" sx={{ fontSize: "0.6rem", color: "#94a3b8", ml: 0.4 }}>
                          SPENT
                        </Box>
                      </Typography>
                      <Typography className="font-mono" sx={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 700 }}>
                        {targetBudget > 0 ? formatCurrency(targetBudget) : "No Target"}
                      </Typography>
                    </Stack>

                    <Box
                      className="neo-inset"
                      sx={{
                        width: "100%",
                        height: 5,
                        borderRadius: 9999,
                        overflow: "hidden",
                        bgcolor: "#141313",
                        mb: 1.8,
                      }}
                    >
                      <Box
                        className="glow-indigo"
                        sx={{
                          height: "100%",
                          width: `${Math.min(100, budgetPercent)}%`,
                          bgcolor: budgetPercent > 100 ? "#f87171" : "#6366f1",
                          borderRadius: 9999,
                        }}
                      />
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => setSearchParams({ tab: "budget" })}
                      startIcon={<LocalGasStationIcon sx={{ fontSize: 13 }} />}
                      sx={{
                        bgcolor: "#201f1f",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#bef264",
                        fontSize: "0.65rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700,
                        py: 0.5,
                        "&:hover": { bgcolor: "#27272a" },
                      }}
                    >
                      Fuel
                    </Button>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => setSearchParams({ tab: "budget" })}
                      startIcon={<ReceiptLongIcon sx={{ fontSize: 13 }} />}
                      sx={{
                        bgcolor: "#201f1f",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#818cf8",
                        fontSize: "0.65rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700,
                        py: 0.5,
                        "&:hover": { bgcolor: "#27272a" },
                      }}
                    >
                      Expense
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              {/* 3. Upcoming Stay Card */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper
                  className="glass-panel neo-convex"
                  sx={{
                    p: 2.2,
                    borderRadius: 2.5,
                    bgcolor: "#1a1a1e",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography
                        className="font-mono"
                        sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                      >
                        Next Stay
                      </Typography>
                      {nextStay && (
                        <Chip
                          label={nextStay.type}
                          size="small"
                          sx={{ height: 18, fontSize: "0.6rem", bgcolor: "#27272a", color: "#a1a1aa", borderRadius: 1 }}
                        />
                      )}
                    </Stack>

                    {nextStay ? (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.85rem", mb: 0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {nextStay.name}
                        </Typography>
                        <Typography className="font-mono" sx={{ color: "#818cf8", fontSize: "0.7rem" }}>
                          {formatDate(nextStay.checkInDate)} – {formatDate(nextStay.checkOutDate)}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 0.8 }}>
                        <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.75rem", mb: 0.5 }}>
                          No lodging booked yet.
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    size="small"
                    onClick={() => setSearchParams({ tab: "accommodation" })}
                    sx={{
                      bgcolor: "#201f1f",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#bef264",
                      fontSize: "0.65rem",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 700,
                      py: 0.5,
                      "&:hover": { bgcolor: "#27272a" },
                    }}
                  >
                    {nextStay ? "View All Lodging →" : "+ Add Stay Details"}
                  </Button>
                </Paper>
              </Grid>

              {/* 4. Critical Gear Checklist Card */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper
                  className="glass-panel neo-convex"
                  sx={{
                    p: 2.2,
                    borderRadius: 2.5,
                    bgcolor: "#1a1a1e",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography
                        className="font-mono"
                        sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                      >
                        Critical Gear
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setSearchParams({ tab: "checklist" })}
                        sx={{ color: "#818cf8", fontSize: "0.65rem", p: 0, minWidth: 0 }}
                      >
                        [{checklist?.totalItemsCount ?? 0}] All →
                      </Button>
                    </Stack>

                    {checklistItems.length === 0 ? (
                      <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.75rem", py: 1, textAlign: "center" }}>
                        No checklist items added.
                      </Typography>
                    ) : (
                      <Stack spacing={0.6}>
                        {checklistItems.slice(0, 3).map((item: ChecklistItem) => (
                          <Box
                            key={item.id}
                            onClick={() => toggleItemMutation.mutate({ itemId: item.id, isCompleted: !item.isCompleted })}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              cursor: "pointer",
                              p: 0.3,
                              borderRadius: 1,
                              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.03)" },
                            }}
                          >
                            <Checkbox
                              checked={item.isCompleted}
                              size="small"
                              sx={{
                                p: 0,
                                color: "#52525b",
                                "&.Mui-checked": { color: "#6366f1" },
                              }}
                            />
                            <Typography
                              className="font-mono"
                              sx={{
                                fontSize: "0.72rem",
                                color: item.isCompleted ? "#71717a" : "#e4e4e7",
                                textDecoration: item.isCompleted ? "line-through" : "none",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    size="small"
                    onClick={() => setSearchParams({ tab: "checklist" })}
                    sx={{
                      bgcolor: "#201f1f",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#818cf8",
                      fontSize: "0.65rem",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 700,
                      py: 0.5,
                      mt: 1,
                      "&:hover": { bgcolor: "#27272a" },
                    }}
                  >
                    Open Checklist →
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* Tab 1: Readiness Section */}
        {activeTab === "readiness" && (
          <Box role="tabpanel">
            <ReadinessSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 2: Itinerary & Waypoints */}
        {activeTab === "itinerary" && (
          <Stack spacing={2.5} role="tabpanel">
            {/* Top Stat Bar */}
            <RouteSummary summary={route?.summary} stopCount={validStops.length} />

            {/* Side-by-Side Map & Itinerary List */}
            <Grid container spacing={2.5} sx={{ alignItems: "stretch" }}>
              {/* Left Column: Tactical Map */}
              <Grid size={{ xs: 12, lg: 6.5 }} sx={{ height: { xs: 420, lg: 680 } }}>
                <Paper
                  className="glass-panel neo-convex"
                  sx={{
                    height: "100%",
                    borderRadius: 2.5,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Map stops={stops} selectedStopId={selectedStopId} onStopSelect={setSelectedStopId} />
                </Paper>
              </Grid>

              {/* Right Column: Waypoints List & Sequence */}
              <Grid size={{ xs: 12, lg: 5.5 }} sx={{ height: { xs: "auto", lg: 680 } }}>
                <ItinerarySection
                  tripId={trip.id}
                  selectedStopId={selectedStopId}
                  onStopSelect={setSelectedStopId}
                  routeLegs={route?.legs}
                />
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* Tab 3: Accommodations */}
        {activeTab === "accommodation" && (
          <Box role="tabpanel">
            <AccommodationsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 4: Budget & Fuel */}
        {activeTab === "budget" && (
          <Box role="tabpanel">
            <BudgetSection tripId={trip.id} routeDistanceKm={routeDistanceKm} />
          </Box>
        )}

        {/* Tab 5: Checklist & Gear */}
        {activeTab === "checklist" && (
          <Box role="tabpanel">
            <ChecklistSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 6: Documents & Permits */}
        {activeTab === "documents" && (
          <Box role="tabpanel">
            <DocumentsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 7: Emergency Contacts */}
        {activeTab === "contacts" && (
          <Box role="tabpanel">
            <EmergencyContactsSection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 8: Summary Report */}
        {activeTab === "summary" && (
          <Box role="tabpanel">
            <TripSummarySection tripId={trip.id} />
          </Box>
        )}

        {/* Tab 9: Memories & Notes */}
        {activeTab === "memories" && (
          <Box role="tabpanel">
            <MemoriesSection tripId={trip.id} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
