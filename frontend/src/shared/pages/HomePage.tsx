import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BuildIcon from "@mui/icons-material/Build";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExploreIcon from "@mui/icons-material/Explore";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import MapIcon from "@mui/icons-material/Map";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RouteIcon from "@mui/icons-material/Route";
import ShieldIcon from "@mui/icons-material/Shield";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Box,
  Button,
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

  // Spotlight active trip, next planned trip, or most recent trip
  const spotlightTrip = activeTrips[0] || planningTrips[0] || trips[0];

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", width: "100%", pb: 6 }} className="animate-fade-in">
      {/* 1. The Journal Display Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 4 }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            The Journal
          </Typography>
          <Typography
            className="font-mono"
            variant="caption"
            sx={{ color: "#94a3b8", fontSize: "0.74rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Tactical Operations & Terrestrial Ledger
          </Typography>
        </Box>

        {/* Systems Nominal Status HUD Pill */}
        <Box
          className="neo-inset"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1,
            borderRadius: 9999,
          }}
        >
          <Box
            className="pulse-telemetry glow-acid"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#bef264",
            }}
          />
          <Typography
            className="font-mono"
            sx={{
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "#bef264",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Systems Nominal
          </Typography>
        </Box>
      </Stack>

      {/* 2. Top Bento Grid (Hero 2-Col + Telemetry Stats 1-Col) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Hero Featured Expedition (2 Cols on Desktop) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {spotlightTrip ? (
            <Paper
              className="neo-convex neo-hover"
              onClick={() => navigate(`/trips/${spotlightTrip.id}`)}
              sx={{
                position: "relative",
                minHeight: { xs: 400, md: 440 },
                borderRadius: 3.5,
                overflow: "hidden",
                cursor: "pointer",
                p: { xs: 3, sm: 4.5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                bgcolor: "#1c1b1b",
              }}
            >
              {/* Cinematic Gradient & Landscape Background */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  backgroundImage: `radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.25), transparent 50%), radial-gradient(circle at 20% 80%, rgba(190, 242, 100, 0.1), transparent 50%), linear-gradient(180deg, rgba(20, 19, 19, 0.4) 0%, rgba(20, 19, 19, 0.95) 85%)`,
                }}
              />

              {/* Decorative Compass / Terrain Lines */}
              <Box
                sx={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Chip
                  label={spotlightTrip.status === "Active" ? "ACTIVE IN MOTION" : "FEATURED EXPEDITION"}
                  size="small"
                  sx={{
                    bgcolor: spotlightTrip.status === "Active" ? "rgba(190, 242, 100, 0.15)" : "rgba(99, 102, 241, 0.2)",
                    color: spotlightTrip.status === "Active" ? "#bef264" : "#818cf8",
                    border: spotlightTrip.status === "Active" ? "1px solid rgba(190, 242, 100, 0.4)" : "1px solid rgba(99, 102, 241, 0.4)",
                    fontWeight: 800,
                    fontSize: "0.68rem",
                    letterSpacing: "0.06em",
                    fontFamily: '"JetBrains Mono", monospace',
                    borderRadius: 9999,
                    boxShadow: spotlightTrip.status === "Active" ? "0 0 12px rgba(190, 242, 100, 0.3)" : "0 0 12px rgba(99, 102, 241, 0.3)",
                  }}
                />
              </Box>

              {/* Hero Content */}
              <Box sx={{ position: "relative", zIndex: 1, mt: "auto" }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                  <Typography
                    className="font-mono"
                    variant="caption"
                    sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
                  >
                    <CalendarMonthIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />
                    {formatDate(spotlightTrip.startDate)} – {formatDate(spotlightTrip.endDate)}
                  </Typography>
                </Stack>

                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    mb: 1.5,
                    fontSize: { xs: "1.8rem", sm: "2.4rem", md: "2.8rem" },
                  }}
                >
                  {spotlightTrip.name}
                </Typography>

                {spotlightTrip.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#c7c6ca",
                      maxWidth: 650,
                      mb: 3,
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {spotlightTrip.description}
                  </Typography>
                )}

                {/* High Density Metrics Row */}
                <Box
                  sx={{
                    pt: 2.5,
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <Typography
                        className="font-mono"
                        variant="caption"
                        sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", display: "block", mb: 0.5 }}
                      >
                        STATUS
                      </Typography>
                      <Typography
                        className="font-mono"
                        sx={{
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                          fontWeight: 800,
                          color: spotlightTrip.status === "Active" ? "#bef264" : "#818cf8",
                        }}
                      >
                        {spotlightTrip.status.toUpperCase()}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography
                        className="font-mono"
                        variant="caption"
                        sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", display: "block", mb: 0.5 }}
                      >
                        PHASE
                      </Typography>
                      <Typography
                        className="font-mono"
                        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, fontWeight: 800, color: "#f8fafc" }}
                      >
                        TERRESTRIAL
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography
                        className="font-mono"
                        variant="caption"
                        sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", display: "block", mb: 0.5 }}
                      >
                        ACTION
                      </Typography>
                      <Typography
                        className="font-mono"
                        sx={{
                          fontSize: { xs: "0.85rem", sm: "1.05rem" },
                          fontWeight: 800,
                          color: "#818cf8",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        OPEN COCKPIT <ArrowForwardIcon sx={{ fontSize: 16 }} />
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Progress Line */}
                  <Box
                    className="neo-inset"
                    sx={{
                      mt: 3,
                      width: "100%",
                      height: 6,
                      borderRadius: 9999,
                      overflow: "hidden",
                      bgcolor: "#141313",
                    }}
                  >
                    <Box
                      className="glow-indigo"
                      sx={{
                        height: "100%",
                        width: spotlightTrip.status === "Completed" ? "100%" : spotlightTrip.status === "Active" ? "60%" : "25%",
                        bgcolor: spotlightTrip.status === "Active" ? "#bef264" : "#6366f1",
                        borderRadius: 9999,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Paper
              className="neo-convex"
              sx={{
                p: 6,
                borderRadius: 3.5,
                textAlign: "center",
                bgcolor: "#1c1b1b",
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TwoWheelerIcon sx={{ fontSize: 48, color: "#818cf8", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#f8fafc", mb: 1 }}>
                No Active Missions
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", maxWidth: 420, mb: 3 }}>
                Initialize your first terrestrial expedition to generate waypoint trajectories, fuel logs, and telemetry.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/trips/new")}
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: "#6366f1",
                  color: "#ffffff",
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
                }}
              >
                Plan First Mission
              </Button>
            </Paper>
          )}
        </Grid>

        {/* Right Telemetry Column (2 Stacked Neomorphic Stat Cards) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} sx={{ height: "100%" }}>
            {/* Stat Card 1: Total Expeditions */}
            <Paper
              className="neo-convex"
              onClick={() => navigate("/trips")}
              sx={{
                p: 3.5,
                borderRadius: 3,
                bgcolor: "#1c1b1b",
                flex: 1,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: "#6366f1",
                  boxShadow: "8px 8px 18px #0e0e11, -8px -8px 18px #22222a",
                },
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "rgba(99, 102, 241, 0.12)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                  }}
                >
                  <ExploreIcon fontSize="medium" />
                </Box>
                <Typography
                  className="font-mono"
                  variant="caption"
                  sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  EXPEDITIONS
                </Typography>
              </Stack>

              <Typography
                className="font-mono"
                variant="h2"
                sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1, mb: 1 }}
              >
                {trips.length}
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Total logged journeys across your motorcycle ledger.
              </Typography>
            </Paper>

            {/* Stat Card 2: Active Rides */}
            <Paper
              className="neo-convex"
              onClick={() => {
                if (activeTrips.length > 0) navigate(`/trips/${activeTrips[0].id}`);
                else navigate("/trips");
              }}
              sx={{
                p: 3.5,
                borderRadius: 3,
                bgcolor: "#1c1b1b",
                flex: 1,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: "#bef264",
                  boxShadow: "8px 8px 18px #0e0e11, -8px -8px 18px #22222a",
                },
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "rgba(190, 242, 100, 0.12)",
                    border: "1px solid rgba(190, 242, 100, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bef264",
                  }}
                >
                  <TwoWheelerIcon fontSize="medium" />
                </Box>
                <Typography
                  className="font-mono"
                  variant="caption"
                  sx={{ color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  ACTIVE RIDES
                </Typography>
              </Stack>

              <Typography
                className="font-mono"
                variant="h2"
                sx={{ fontWeight: 800, color: "#bef264", lineHeight: 1, mb: 1 }}
              >
                {activeTrips.length}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                  className="pulse-telemetry glow-acid"
                  sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#bef264" }}
                />
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  {activeTrips.length > 0 ? "Currently tracking in field" : "All expeditions currently docked"}
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* 3. Bottom Bento Row (Instruments 1-Col + Archives 2-Cols) */}
      <Grid container spacing={3}>
        {/* Instruments / Operational Tools (1 Column) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 3.5,
              borderRadius: 3,
              bgcolor: "#1c1b1b",
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc", mb: 3 }}
            >
              Instruments
            </Typography>

            <Grid container spacing={2}>
              {/* Tool 1: Route Gen */}
              <Grid size={{ xs: 6 }}>
                <Box
                  className="neo-convex"
                  onClick={() => {
                    if (spotlightTrip) navigate(`/trips/${spotlightTrip.id}?tab=itinerary`);
                    else navigate("/trips/new");
                  }}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#1f1f24",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#818cf8",
                      boxShadow: "0 0 16px rgba(99, 102, 241, 0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <RouteIcon sx={{ fontSize: 28, mb: 1, color: "#818cf8" }} />
                  <Typography
                    className="font-mono"
                    sx={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    Route Gen
                  </Typography>
                </Box>
              </Grid>

              {/* Tool 2: Budget & Fuel */}
              <Grid size={{ xs: 6 }}>
                <Box
                  className="neo-convex"
                  onClick={() => {
                    if (spotlightTrip) navigate(`/trips/${spotlightTrip.id}?tab=budget`);
                    else navigate("/trips");
                  }}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#1f1f24",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#bef264",
                      boxShadow: "0 0 16px rgba(190, 242, 100, 0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <LocalGasStationIcon sx={{ fontSize: 28, mb: 1, color: "#bef264" }} />
                  <Typography
                    className="font-mono"
                    sx={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    Fuel Log
                  </Typography>
                </Box>
              </Grid>

              {/* Tool 3: Loadout & Gear */}
              <Grid size={{ xs: 6 }}>
                <Box
                  className="neo-convex"
                  onClick={() => {
                    if (spotlightTrip) navigate(`/trips/${spotlightTrip.id}?tab=checklist`);
                    else navigate("/trips");
                  }}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#1f1f24",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#fbbf24",
                      boxShadow: "0 0 16px rgba(251, 191, 36, 0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <BuildIcon sx={{ fontSize: 28, mb: 1, color: "#fbbf24" }} />
                  <Typography
                    className="font-mono"
                    sx={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    Loadout
                  </Typography>
                </Box>
              </Grid>

              {/* Tool 4: Safety & Emergency */}
              <Grid size={{ xs: 6 }}>
                <Box
                  className="neo-convex"
                  onClick={() => {
                    if (spotlightTrip) navigate(`/trips/${spotlightTrip.id}?tab=contacts`);
                    else navigate("/trips");
                  }}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "#1f1f24",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#f87171",
                      boxShadow: "0 0 16px rgba(248, 113, 113, 0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <ShieldIcon sx={{ fontSize: 28, mb: 1, color: "#f87171" }} />
                  <Typography
                    className="font-mono"
                    sx={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    Safety ICE
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Archives / Recent Expeditions List (2 Columns) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 3.5,
              borderRadius: 3,
              bgcolor: "#1c1b1b",
              height: "100%",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography
                variant="h5"
                sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}
              >
                Archives
              </Typography>
              <Button
                onClick={() => navigate("/trips")}
                className="font-mono"
                sx={{
                  color: "#818cf8",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  "&:hover": { color: "#bef264" },
                }}
              >
                View All [{trips.length}]
              </Button>
            </Stack>

            {trips.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  No past expedition records in memory bank.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {trips.slice(0, 3).map((trip) => (
                  <Box
                    key={trip.id}
                    className="neo-inset"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#2b2a2a",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                      <Box
                        className="neo-convex"
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 1.5,
                          bgcolor: "#201f1f",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: trip.status === "Active" ? "#bef264" : trip.status === "Planning" ? "#818cf8" : "#94a3b8",
                        }}
                      >
                        {trip.status === "Active" ? (
                          <TwoWheelerIcon fontSize="small" />
                        ) : (
                          <MapIcon fontSize="small" />
                        )}
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.2, mb: 0.3 }}
                        >
                          {trip.name}
                        </Typography>
                        <Typography
                          className="font-mono"
                          variant="caption"
                          sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
                        >
                          {trip.status} • {formatDate(trip.startDate)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Typography
                        className="font-mono"
                        sx={{ color: "#818cf8", fontSize: "0.75rem", fontWeight: 800 }}
                      >
                        OPEN
                      </Typography>
                      <OpenInNewIcon sx={{ fontSize: 16, color: "#818cf8" }} />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}