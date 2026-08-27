import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExploreIcon from "@mui/icons-material/Explore";
import MapIcon from "@mui/icons-material/Map";
import RouteIcon from "@mui/icons-material/Route";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAccommodations } from "@/features/accommodations";
import { useTripReadiness } from "@/features/readiness";
import { useTrips } from "@/features/trips";
import { LoadingSpinner } from "@/shared/ui";
import { formatDate } from "@/shared/utils";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: trips = [], isLoading } = useTrips();

  const [selectedTripId, setSelectedTripId] = useState<string>(() => {
    return localStorage.getItem("last_active_trip_id") || "";
  });

  useEffect(() => {
    if (trips.length > 0) {
      const storedId = localStorage.getItem("last_active_trip_id");
      const validStored = trips.find((t) => t.id === (selectedTripId || storedId));
      if (validStored) {
        if (selectedTripId !== validStored.id) {
          setSelectedTripId(validStored.id);
        }
      } else {
        const activeTrip = trips.find((t) => t.status === "Active");
        const defaultId = activeTrip?.id || trips[0].id;
        setSelectedTripId(defaultId);
        localStorage.setItem("last_active_trip_id", defaultId);
      }
    }
  }, [trips, selectedTripId]);

  const activeTrips = trips.filter((t) => t.status === "Active");
  const planningTrips = trips.filter((t) => t.status === "Planning");

  const spotlightTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  // Fetch real readiness and lodging for the selected spotlight trip
  const { data: readiness } = useTripReadiness(spotlightTrip?.id ?? "");
  const { data: accommodations = [] } = useAccommodations(spotlightTrip?.id ?? "");

  const handleSelectTrip = (id: string) => {
    setSelectedTripId(id);
    localStorage.setItem("last_active_trip_id", id);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getPhaseText = (status?: string) => {
    switch (status) {
      case "Active":
        return "EN ROUTE (LIVE)";
      case "Completed":
        return "MISSION COMPLETED";
      default:
        return "ROUTE PLANNING";
    }
  };

  const getPhaseColor = (status?: string) => {
    switch (status) {
      case "Active":
        return "#bef264";
      case "Completed":
        return "#38bdf8";
      default:
        return "#818cf8";
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", width: "100%", pb: 6 }} className="animate-fade-in">
      {/* 1. Display Header with New Mission Trigger */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            The Journal
          </Typography>
          <Typography
            className="font-mono"
            variant="caption"
            sx={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            Motorcycle Expeditions & Field Telemetry Hub
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate("/trips/new")}
          className="glow-indigo"
          sx={{
            bgcolor: "#6366f1",
            color: "#ffffff",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.04em",
            py: 0.9,
            px: 2,
            "&:hover": { bgcolor: "#4f46e5" },
          }}
        >
          Plan New Expedition
        </Button>
      </Stack>

      {/* 2. Top Compact Lifetime Stats Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            className="neo-convex"
            onClick={() => navigate("/trips")}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { borderColor: "#6366f1", transform: "translateY(-1px)" },
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography className="font-mono" sx={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Total Expeditions
                </Typography>
                <Typography className="font-mono" variant="h5" sx={{ fontWeight: 800, color: "#f8fafc", mt: 0.2 }}>
                  {trips.length}
                </Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(99, 102, 241, 0.12)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ExploreIcon sx={{ fontSize: 18 }} />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            className="neo-convex"
            onClick={() => navigate("/trips?status=Active")}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(190, 242, 100, 0.3)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { borderColor: "#bef264", transform: "translateY(-1px)" },
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                  <Box className="pulse-telemetry glow-acid" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#bef264" }} />
                  <Typography className="font-mono" sx={{ color: "#bef264", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Active In Field
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h5" sx={{ fontWeight: 800, color: "#bef264", mt: 0.2 }}>
                  {activeTrips.length}
                </Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(190, 242, 100, 0.15)", color: "#bef264", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TwoWheelerIcon sx={{ fontSize: 18 }} />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            className="neo-convex"
            onClick={() => navigate("/trips?status=Planning")}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { borderColor: "#818cf8", transform: "translateY(-1px)" },
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography className="font-mono" sx={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  In Planning
                </Typography>
                <Typography className="font-mono" variant="h5" sx={{ fontWeight: 800, color: "#818cf8", mt: 0.2 }}>
                  {planningTrips.length}
                </Typography>
              </Box>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "rgba(129, 140, 248, 0.12)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RouteIcon sx={{ fontSize: 18 }} />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Main Bento Grid (Featured Spotlight Card + Expedition Readiness HUD) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left: Featured Expedition Spotlight Card (8 Cols on Desktop) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {spotlightTrip ? (
            <Paper
              className="neo-convex"
              sx={{
                position: "relative",
                minHeight: 380,
                borderRadius: 3,
                overflow: "hidden",
                p: { xs: 2.5, sm: 3.5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "#1a1a1e",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundImage: `radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.2), transparent 50%), radial-gradient(circle at 20% 80%, rgba(190, 242, 100, 0.08), transparent 50%)`,
              }}
            >
              {/* Card Header with Quick Trip Selector */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Chip
                    label={spotlightTrip.status === "Active" ? "LIVE EXPEDITION" : "FEATURED SPOTLIGHT"}
                    size="small"
                    sx={{
                      bgcolor: spotlightTrip.status === "Active" ? "rgba(190, 242, 100, 0.15)" : "rgba(99, 102, 241, 0.2)",
                      color: spotlightTrip.status === "Active" ? "#bef264" : "#818cf8",
                      border: spotlightTrip.status === "Active" ? "1px solid rgba(190, 242, 100, 0.4)" : "1px solid rgba(99, 102, 241, 0.4)",
                      fontWeight: 800,
                      fontSize: "0.65rem",
                      letterSpacing: "0.06em",
                      fontFamily: '"JetBrains Mono", monospace',
                      borderRadius: 1,
                    }}
                  />

                  {/* Switch Expedition Dropdown */}
                  {trips.length > 1 && (
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <Select
                        value={spotlightTrip.id}
                        onChange={(e) => handleSelectTrip(e.target.value)}
                        sx={{
                          height: 26,
                          fontSize: "0.68rem",
                          fontFamily: '"JetBrains Mono", monospace',
                          fontWeight: 700,
                          bgcolor: "#141313",
                          color: "#e4e4e7",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        {trips.map((t) => (
                          <MenuItem key={t.id} value={t.id} sx={{ fontSize: "0.75rem" }}>
                            {t.name} ({t.status})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Stack>

                <Typography className="font-mono" sx={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 700 }}>
                  <CalendarMonthIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5, color: "#818cf8" }} />
                  {formatDate(spotlightTrip.startDate)} – {formatDate(spotlightTrip.endDate)}
                </Typography>
              </Box>

              {/* Spotlight Content */}
              <Box sx={{ my: "auto" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    mb: 1,
                    fontSize: { xs: "1.6rem", sm: "2.2rem" },
                  }}
                >
                  {spotlightTrip.name}
                </Typography>

                {spotlightTrip.description ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#cbd5e1",
                      maxWidth: 620,
                      lineHeight: 1.6,
                      fontSize: "0.88rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {spotlightTrip.description}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "#71717a", fontStyle: "italic", fontSize: "0.82rem" }}>
                    No mission description configured. Click "Open Cockpit" to manage waypoints and logistics.
                  </Typography>
                )}
              </Box>

              {/* High Density Metrics Row */}
              <Box sx={{ pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 4 }}>
                    <Typography className="font-mono" sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.65rem", mb: 0.3 }}>
                      LIFECYCLE STATUS
                    </Typography>
                    <Typography className="font-mono" sx={{ fontSize: "0.95rem", fontWeight: 800, color: spotlightTrip.status === "Active" ? "#bef264" : "#818cf8" }}>
                      {spotlightTrip.status.toUpperCase()}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 4 }}>
                    <Typography className="font-mono" sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.65rem", mb: 0.3 }}>
                      MISSION PHASE
                    </Typography>
                    <Typography className="font-mono" sx={{ fontSize: "0.88rem", fontWeight: 800, color: getPhaseColor(spotlightTrip.status) }}>
                      {getPhaseText(spotlightTrip.status)}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 4 }} sx={{ textAlign: "right" }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/trips/${spotlightTrip.id}`)}
                      className="glow-indigo"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: "#6366f1",
                        color: "#ffffff",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        "&:hover": { bgcolor: "#4f46e5" },
                      }}
                    >
                      Open Cockpit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ) : (
            <Paper className="neo-convex" sx={{ p: 5, borderRadius: 3, textAlign: "center", bgcolor: "#1a1a1e" }}>
              <TwoWheelerIcon sx={{ fontSize: 44, color: "#818cf8", mb: 1.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#f8fafc", mb: 1 }}>
                No Expeditions in Ledger
              </Typography>
              <Button variant="contained" onClick={() => navigate("/trips/new")} sx={{ bgcolor: "#6366f1", mt: 1 }}>
                Plan Your First Mission
              </Button>
            </Paper>
          )}
        </Grid>

        {/* Right: Expedition Readiness & Logistics Action Hub (4 Cols on Desktop) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.8,
              borderRadius: 3,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography className="font-mono" sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Expedition Readiness HUD
                </Typography>
                <Chip
                  label={`${readiness?.scorePercentage ?? 0}% READY`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    fontFamily: '"JetBrains Mono", monospace',
                    bgcolor: (readiness?.scorePercentage ?? 0) >= 80 ? "rgba(190, 242, 100, 0.15)" : "rgba(99, 102, 241, 0.15)",
                    color: (readiness?.scorePercentage ?? 0) >= 80 ? "#bef264" : "#818cf8",
                    border: `1px solid ${(readiness?.scorePercentage ?? 0) >= 80 ? "rgba(190, 242, 100, 0.3)" : "rgba(99, 102, 241, 0.3)"}`,
                  }}
                />
              </Stack>

              {/* Readiness Checks Summary */}
              <Stack spacing={1.2} sx={{ mb: 2.5 }}>
                {(readiness?.items || []).slice(0, 3).map((item) => (
                  <Box
                    key={item.key}
                    className="neo-inset"
                    sx={{
                      p: 1.2,
                      borderRadius: 1.5,
                      bgcolor: "#141313",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      {item.isPassed ? (
                        <CheckCircleIcon sx={{ fontSize: 16, color: "#bef264" }} />
                      ) : (
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #f87171" }} />
                      )}
                      <Typography variant="body2" sx={{ color: "#f8fafc", fontSize: "0.78rem", fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                    </Stack>
                    <Typography className="font-mono" sx={{ fontSize: "0.65rem", color: item.isPassed ? "#bef264" : "#f87171", fontWeight: 700 }}>
                      {item.isPassed ? "PASSED" : "PENDING"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Next Accommodation / Stay Preview */}
            <Box sx={{ pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <Typography className="font-mono" sx={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
                Next Lodging Stay
              </Typography>
              {accommodations.length > 0 ? (
                <Box className="neo-inset" sx={{ p: 1.2, borderRadius: 1.5, bgcolor: "#141313" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.82rem" }}>
                    {accommodations[0].name}
                  </Typography>
                  <Typography className="font-mono" sx={{ color: "#818cf8", fontSize: "0.7rem", mt: 0.2 }}>
                    {formatDate(accommodations[0].checkInDate)} – {formatDate(accommodations[0].checkOutDate)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: "#71717a", fontStyle: "italic" }}>
                  No lodging booked for this mission.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 4. Recent Expeditions Section (Renamed from Archives) */}
      <Paper
        className="neo-convex"
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}>
              Recent Expeditions & Journeys
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Your motorcycle adventure ledger ({trips.length} total logged)
            </Typography>
          </Box>

          <Button
            onClick={() => navigate("/trips")}
            className="font-mono"
            sx={{
              color: "#818cf8",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              "&:hover": { color: "#bef264" },
            }}
          >
            View All Expeditions [{trips.length}] →
          </Button>
        </Stack>

        {trips.length === 0 ? (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              No past expedition records in your ledger.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {trips.slice(0, 4).map((trip) => (
              <Grid key={trip.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  className="neo-inset"
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#141313",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#6366f1",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        bgcolor:
                          trip.status === "Active"
                            ? "rgba(190, 242, 100, 0.12)"
                            : trip.status === "Completed"
                            ? "rgba(56, 189, 248, 0.12)"
                            : "rgba(99, 102, 241, 0.12)",
                        color:
                          trip.status === "Active"
                            ? "#bef264"
                            : trip.status === "Completed"
                            ? "#38bdf8"
                            : "#818cf8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {trip.status === "Active" ? <TwoWheelerIcon sx={{ fontSize: 18 }} /> : <MapIcon sx={{ fontSize: 18 }} />}
                    </Box>

                    <Chip
                      label={trip.status}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        fontFamily: '"JetBrains Mono", monospace',
                        bgcolor:
                          trip.status === "Active"
                            ? "rgba(190, 242, 100, 0.15)"
                            : trip.status === "Completed"
                            ? "rgba(56, 189, 248, 0.15)"
                            : "rgba(99, 102, 241, 0.15)",
                        color:
                          trip.status === "Active"
                            ? "#bef264"
                            : trip.status === "Completed"
                            ? "#38bdf8"
                            : "#818cf8",
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.88rem", lineHeight: 1.2, mb: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {trip.name}
                  </Typography>

                  <Typography className="font-mono" sx={{ color: "#94a3b8", fontSize: "0.68rem" }}>
                    {formatDate(trip.startDate)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}