import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExploreIcon from "@mui/icons-material/Explore";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import MapIcon from "@mui/icons-material/Map";
import NavigationIcon from "@mui/icons-material/Navigation";
import ShieldIcon from "@mui/icons-material/Shield";
import SpeedIcon from "@mui/icons-material/Speed";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useTrips } from "@/features/trips";
import { EmptyState, LoadingSpinner } from "@/shared/ui";
import { formatDate } from "@/shared/utils";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: trips = [], isLoading } = useTrips();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const activeTrips = trips.filter((t) => t.status === "Active");
  const planningTrips = trips.filter((t) => t.status === "Planning");
  const completedTrips = trips.filter((t) => t.status === "Completed");

  // Spotlight the first active trip or next upcoming planning trip
  const spotlightTrip = activeTrips[0] || planningTrips[0] || trips[0];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return {
          bg: "rgba(190, 242, 100, 0.12)",
          color: "#bef264",
          border: "rgba(190, 242, 100, 0.35)",
          dot: "#bef264",
          glow: "0 0 12px rgba(190, 242, 100, 0.3)",
        };
      case "Planning":
        return {
          bg: "rgba(99, 102, 241, 0.12)",
          color: "#818cf8",
          border: "rgba(99, 102, 241, 0.35)",
          dot: "#6366f1",
          glow: "0 0 12px rgba(99, 102, 241, 0.2)",
        };
      case "Completed":
        return {
          bg: "rgba(148, 163, 184, 0.1)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.25)",
          dot: "#64748b",
          glow: "none",
        };
      default:
        return {
          bg: "rgba(148, 163, 184, 0.1)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.25)",
          dot: "#64748b",
          glow: "none",
        };
    }
  };

  return (
    <Stack spacing={4} className="animate-fade-in" sx={{ pb: 6 }}>
      {/* 1. Obsidian Velocity Tactical Hero Cockpit */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, sm: 4.5, md: 5.5 },
          borderRadius: 3.5,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #16181c 0%, #1f2128 50%, #121416 100%)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Subtle Decorative Ambient Glows */}
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            left: "30%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(190, 242, 100, 0.08) 0%, rgba(190, 242, 100, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        <Grid container spacing={4} sx={{ alignItems: "center", position: "relative", zIndex: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
              <Chip
                icon={
                  <Box
                    className="pulse-telemetry"
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: "#bef264",
                      ml: "6px !important",
                    }}
                  />
                }
                label="TACTICAL EXPEDITION COCKPIT"
                size="small"
                sx={{
                  bgcolor: "rgba(190, 242, 100, 0.12)",
                  color: "#bef264",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  border: "1px solid rgba(190, 242, 100, 0.3)",
                }}
              />

              <Chip
                label="SYSTEM V12.0 // ONLINE"
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  color: "#94a3b8",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.04em",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              />
            </Stack>

            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.6rem", md: "3.2rem" },
                lineHeight: 1.12,
              }}
            >
              Plan, Ride & Chronicle <br />
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #818cf8 0%, #bef264 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Epic Expeditions
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#94a3b8",
                maxWidth: 640,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                lineHeight: 1.65,
                mb: 3.5,
              }}
            >
              Real-time Google Maps route geometry, drag-and-drop waypoint logistics, automated fuel ledgers,
              lodging coordination, and full rider telemetry in one unified dark cockpit.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/trips/new")}
                startIcon={<AddIcon />}
                sx={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.35,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                    boxShadow: "0 6px 24px rgba(99, 102, 241, 0.6)",
                  },
                }}
              >
                Plan New Expedition
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/trips")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "#f8fafc",
                  fontWeight: 600,
                  px: 3,
                  py: 1.35,
                  fontSize: "0.95rem",
                  "&:hover": {
                    borderColor: "#6366f1",
                    bgcolor: "rgba(99, 102, 241, 0.08)",
                  },
                }}
              >
                Expedition Explorer ({trips.length})
              </Button>
            </Stack>
          </Grid>

          {/* Quick HUD Telemetry Preview Widget */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "rgba(18, 20, 22, 0.75)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>
                    FLEET TELEMETRY HUD
                  </Typography>
                  <SpeedIcon sx={{ color: "#818cf8", fontSize: 20 }} />
                </Stack>

                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      Active Rides
                    </Typography>
                    <Typography className="font-mono" sx={{ color: "#bef264", fontWeight: 700 }}>
                      {activeTrips.length} IN MOTION
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      Planned Expeditions
                    </Typography>
                    <Typography className="font-mono" sx={{ color: "#818cf8", fontWeight: 700 }}>
                      {planningTrips.length} QUEUED
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      Completed Journeys
                    </Typography>
                    <Typography className="font-mono" sx={{ color: "#cbd5e1", fontWeight: 700 }}>
                      {completedTrips.length} ARCHIVED
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Lifetime Expedition Stats HUD */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#6366f1",
                boxShadow: "0 0 16px rgba(99, 102, 241, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: "rgba(99, 102, 241, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.25)",
              }}
            >
              <ExploreIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography
                variant="h4"
                className="font-mono"
                sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.1 }}
              >
                {trips.length}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, letterSpacing: "0.02em" }}>
                Total Expeditions
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#bef264",
                boxShadow: "0 0 16px rgba(190, 242, 100, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: "rgba(190, 242, 100, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bef264",
                border: "1px solid rgba(190, 242, 100, 0.3)",
              }}
            >
              <TwoWheelerIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography
                variant="h4"
                className="font-mono"
                sx={{ fontWeight: 800, color: "#bef264", lineHeight: 1.1 }}
              >
                {activeTrips.length}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, letterSpacing: "0.02em" }}>
                Active in Motion
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#fbbf24",
                boxShadow: "0 0 16px rgba(251, 191, 36, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: "rgba(251, 191, 36, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fbbf24",
                border: "1px solid rgba(251, 191, 36, 0.3)",
              }}
            >
              <CalendarMonthIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography
                variant="h4"
                className="font-mono"
                sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.1 }}
              >
                {planningTrips.length}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, letterSpacing: "0.02em" }}>
                In Planning
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.25)",
              },
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: "rgba(148, 163, 184, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                border: "1px solid rgba(148, 163, 184, 0.2)",
              }}
            >
              <CheckCircleIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography
                variant="h4"
                className="font-mono"
                sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.1 }}
              >
                {completedTrips.length}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, letterSpacing: "0.02em" }}>
                Logged & Archived
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Featured Expedition Spotlight */}
      {spotlightTrip ? (
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2, justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "#f8fafc" }}>
                Expedition Spotlight
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Instant command access to your active or upcoming priority journey.
              </Typography>
            </Box>

            <Button
              onClick={() => navigate("/trips")}
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 600, color: "#818cf8" }}
            >
              View All Expeditions
            </Button>
          </Stack>

          <Card
            sx={{
              p: 3.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                spotlightTrip.status === "Active"
                  ? "rgba(190, 242, 100, 0.4)"
                  : "rgba(99, 102, 241, 0.35)",
              bgcolor: "#1a1a1e",
              boxShadow:
                spotlightTrip.status === "Active"
                  ? "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(190, 242, 100, 0.15)"
                  : "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(99, 102, 241, 0.15)",
            }}
          >
            <Grid container spacing={3} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    {(() => {
                      const style = getStatusStyle(spotlightTrip.status);
                      return (
                        <Chip
                          icon={
                            <Box
                              className={spotlightTrip.status === "Active" ? "pulse-telemetry" : undefined}
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                bgcolor: style.dot,
                                ml: "6px !important",
                              }}
                            />
                          }
                          label={spotlightTrip.status.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                            fontWeight: 800,
                            fontSize: "0.72rem",
                            letterSpacing: "0.04em",
                          }}
                        />
                      );
                    })()}

                    <Typography
                      variant="caption"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94a3b8", fontWeight: 600 }}
                    >
                      <CalendarMonthIcon sx={{ fontSize: 16 }} />
                      {formatDate(spotlightTrip.startDate)} – {formatDate(spotlightTrip.endDate)}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "#f8fafc" }}
                  >
                    {spotlightTrip.name}
                  </Typography>

                  {spotlightTrip.description && (
                    <Typography variant="body2" sx={{ color: "#94a3b8", maxWidth: 650 }}>
                      {spotlightTrip.description}
                    </Typography>
                  )}
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: "left", md: "right" } }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate(`/trips/${spotlightTrip.id}`)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.3,
                  }}
                >
                  Open Cockpit
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>
      ) : (
        <EmptyState
          title="No expeditions logged yet"
          description="Initialize your journey ledger by creating your first motorcycle expedition route and itinerary."
          icon={<TwoWheelerIcon sx={{ fontSize: 48, color: "#6366f1" }} />}
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/trips/new")}
              startIcon={<AddIcon />}
              sx={{ fontWeight: 700 }}
            >
              Plan Your First Expedition
            </Button>
          }
        />
      )}

      {/* 4. Tactical Tooling Bento Grid */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "#f8fafc", mb: 2 }}>
          Expedition Operations Suite
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                height: "100%",
                bgcolor: "#1a1a1e",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#6366f1",
                  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818cf8",
                  mb: 1.5,
                }}
              >
                <MapIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f8fafc", mb: 0.5 }}>
                Waypoints & Route Map
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Interactive Google Maps routing with drag-and-drop waypoint sequencing, distance & elevation profiles.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                height: "100%",
                bgcolor: "#1a1a1e",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#bef264",
                  boxShadow: "0 4px 20px rgba(190, 242, 100, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "rgba(190, 242, 100, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#bef264",
                  mb: 1.5,
                }}
              >
                <LocalGasStationIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f8fafc", mb: 0.5 }}>
                Fuel & Financial Telemetry
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Target vs actual expense ledger, automated fuel estimates, tolls, and maintenance tracking.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                height: "100%",
                bgcolor: "#1a1a1e",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#fbbf24",
                  boxShadow: "0 4px 20px rgba(251, 191, 36, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "rgba(251, 191, 36, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fbbf24",
                  mb: 1.5,
                }}
              >
                <CalendarMonthIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f8fafc", mb: 0.5 }}>
                Lodging & Stays
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Booking confirmation codes, contact numbers, and check-in dates aligned with itinerary stops.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                height: "100%",
                bgcolor: "#1a1a1e",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#f87171",
                  boxShadow: "0 4px 20px rgba(248, 113, 113, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "rgba(248, 113, 113, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f87171",
                  mb: 1.5,
                }}
              >
                <ShieldIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f8fafc", mb: 0.5 }}>
                Safety & Readiness
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Emergency contacts with quick-dial, permits, vehicle insurance, and multi-category gear checklists.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 5. Recent Expeditions Grid */}
      {trips.length > 1 && (
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2, justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "#f8fafc" }}>
              Recent Expeditions
            </Typography>
            <Button
              onClick={() => navigate("/trips")}
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: "#818cf8", fontWeight: 600 }}
            >
              All Expeditions ({trips.length})
            </Button>
          </Stack>

          <Grid container spacing={2.5}>
            {trips.slice(0, 3).map((trip) => {
              const statusStyle = getStatusStyle(trip.status);
              return (
                <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    variant="outlined"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    sx={{
                      height: "100%",
                      borderRadius: 2.5,
                      cursor: "pointer",
                      bgcolor: "#1a1a1e",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: "#6366f1",
                        boxShadow: "0 10px 24px -4px rgba(0, 0, 0, 0.7), 0 0 16px rgba(99, 102, 241, 0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ justifyContent: "space-between", alignItems: "center" }}
                        >
                          <Chip
                            icon={
                              <Box
                                className={trip.status === "Active" ? "pulse-telemetry" : undefined}
                                sx={{
                                  width: 6,
                                  height: 6,
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
                              fontSize: "0.68rem",
                            }}
                          />
                          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                            {formatDate(trip.startDate)}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "#f8fafc" }}
                        >
                          {trip.name}
                        </Typography>

                        {trip.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#94a3b8",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebKitLineClamp: 2,
                              WebKitBoxOrient: "vertical",
                            }}
                          >
                            {trip.description}
                          </Typography>
                        )}

                        <Stack
                          direction="row"
                          sx={{
                            pt: 1,
                            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "#818cf8", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}
                          >
                            <NavigationIcon sx={{ fontSize: 13 }} />
                            VIEW COCKPIT
                          </Typography>
                          <ArrowForwardIcon sx={{ fontSize: 14, color: "#818cf8" }} />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Stack>
  );
}