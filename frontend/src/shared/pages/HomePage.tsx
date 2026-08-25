import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExploreIcon from "@mui/icons-material/Explore";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import MapIcon from "@mui/icons-material/Map";
import ShieldIcon from "@mui/icons-material/Shield";
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
import { LoadingSpinner } from "@/shared/ui";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return { bg: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "Planning":
        return { bg: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "rgba(37, 99, 235, 0.25)" };
      case "Completed":
        return { bg: "rgba(100, 116, 139, 0.1)", color: "#64748b", border: "rgba(100, 116, 139, 0.2)" };
      default:
        return { bg: "rgba(100, 116, 139, 0.1)", color: "#64748b", border: "rgba(100, 116, 139, 0.2)" };
    }
  };

  return (
    <Stack spacing={4} className="animate-fade-in">
      {/* 1. Hero Adventure Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, sm: 4.5, md: 5.5 },
          borderRadius: 3.5,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          color: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3), 0 8px 10px -6px rgba(15, 23, 42, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Subtle Decorative Gradient Glow */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        <Grid container spacing={3} sx={{ alignItems: "center", position: "relative", zIndex: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
              <Chip
                icon={<TwoWheelerIcon sx={{ color: "#38bdf8 !important", fontSize: 16 }} />}
                label="Motorcycle Expedition Planner"
                size="small"
                sx={{
                  bgcolor: "rgba(56, 189, 248, 0.12)",
                  color: "#38bdf8",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.03em",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                }}
              />
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.025em",
                mb: 1.5,
                fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.8rem" },
                lineHeight: 1.15,
              }}
            >
              Plan, Ride & Chronicle <br />
              <Box component="span" sx={{ color: "#38bdf8" }}>
                Epic Expeditions
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#94a3b8",
                maxWidth: 620,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Turn-by-turn route geometry, automated fuel logs, accommodation budgets, and rider emergency readiness in
              one unified cockpit.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/trips/new")}
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  px: 3,
                  py: 1.25,
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.4)",
                  },
                }}
              >
                Plan New Ride
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/trips")}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  fontWeight: 600,
                  px: 3,
                  py: 1.25,
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                  },
                }}
              >
                Explore All Trips ({trips.length})
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Lifetime Expedition Stats Ribbon */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "rgba(37, 99, 235, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
              }}
            >
              <ExploreIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', lineHeight: 1.1 }}>
                {trips.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
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
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "success.main",
              }}
            >
              <TwoWheelerIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', lineHeight: 1.1 }}>
                {activeTrips.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Rides In Progress
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
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "rgba(245, 158, 11, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "warning.main",
              }}
            >
              <CalendarMonthIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', lineHeight: 1.1 }}>
                {planningTrips.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
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
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "rgba(100, 116, 139, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <CheckCircleIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', lineHeight: 1.1 }}>
                {completedTrips.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Journeys Logged
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Expedition Spotlight */}
      {spotlightTrip && (
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2, justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
                Featured Expedition Spotlight
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Direct access to your currently active or upcoming journey cockpit.
              </Typography>
            </Box>

            <Button onClick={() => navigate("/trips")} endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600 }}>
              View All
            </Button>
          </Stack>

          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: spotlightTrip.status === "Active" ? "rgba(16, 185, 129, 0.4)" : "rgba(37, 99, 235, 0.3)",
              bgcolor: "background.paper",
              boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Grid container spacing={3} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    {(() => {
                      const style = getStatusColor(spotlightTrip.status);
                      return (
                        <Chip
                          label={spotlightTrip.status.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                            fontWeight: 800,
                            fontSize: "0.72rem",
                          }}
                        />
                      );
                    })()}

                    <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CalendarMonthIcon sx={{ fontSize: 15 }} />
                      {formatDate(spotlightTrip.startDate)} – {formatDate(spotlightTrip.endDate)}
                    </Typography>
                  </Stack>

                  <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
                    {spotlightTrip.name}
                  </Typography>

                  {spotlightTrip.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 650 }}>
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
                    px: 3,
                    py: 1.25,
                  }}
                >
                  Open Rider Cockpit
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}

      {/* 4. Feature Capabilities Overview Ribbon */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', mb: 2 }}>
          Expedition Planning Tools
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, height: "100%" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(37, 99, 235, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                  mb: 1.5,
                }}
              >
                <MapIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Google Maps Itinerary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive routing with drag-and-drop stop reordering, elevation, and waypoints.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, height: "100%" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "success.main",
                  mb: 1.5,
                }}
              >
                <LocalGasStationIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Fuel & Expense Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track fuel receipts, food, toll, and maintenance expenses in real time.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, height: "100%" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(245, 158, 11, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "warning.main",
                  mb: 1.5,
                }}
              >
                <CalendarMonthIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Accommodations & Stays
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hotel, homestay, and campsite check-in dates synchronized with your stops.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, height: "100%" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "error.main",
                  mb: 1.5,
                }}
              >
                <ShieldIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Safety & Readiness
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emergency contacts, permits, vehicle insurance, and comprehensive gear checklist.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 5. Recent Expeditions Grid */}
      {trips.length > 1 && (
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2, justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
              Recent Expeditions
            </Typography>
            <Button onClick={() => navigate("/trips")} size="small" endIcon={<ArrowForwardIcon />}>
              All Trips ({trips.length})
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {trips.slice(0, 3).map((trip) => {
              const statusStyle = getStatusColor(trip.status);
              return (
                <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    variant="outlined"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    sx={{
                      height: "100%",
                      borderRadius: 2.5,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Chip
                            label={trip.status}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              border: `1px solid ${statusStyle.border}`,
                              fontWeight: 700,
                              fontSize: "0.7rem",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(trip.startDate)}
                          </Typography>
                        </Stack>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                          {trip.name}
                        </Typography>

                        {trip.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
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