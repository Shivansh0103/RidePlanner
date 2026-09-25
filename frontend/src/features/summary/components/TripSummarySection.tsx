import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import HotelIcon from "@mui/icons-material/Hotel";
import PrintIcon from "@mui/icons-material/Print";
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
  useTheme,
} from "@mui/material";

import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { formatDate } from "@/shared/utils/date";

import { useTripSummary } from "../hooks/useTripSummary";

interface TripSummarySectionProps {
  tripId: string;
}

export default function TripSummarySection({ tripId }: TripSummarySectionProps) {
  const { data: summary, isLoading, isError } = useTripSummary(tripId);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !summary) {
    return <ErrorState message="Failed to load trip summary." />;
  }

  const handlePrint = () => {
    window.print();
  };

  const isUnderBudget = summary.budgetVariance >= 0;

  return (
    <Stack spacing={3}>
      {/* Printable Header Banner */}
      <Paper
        className="neo-convex"
        sx={{
          p: 3,
          borderRadius: 2.5,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.12)",
                color: isDark ? "#818cf8" : "#4f46e5",
                border: "1px solid",
                borderColor: isDark ? "rgba(99, 102, 241, 0.35)" : "rgba(79, 70, 229, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssessmentIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "text.primary" }}>
                {summary.tripName} – Expedition Debrief
              </Typography>
              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
                {summary.startedAt
                  ? `Started: ${formatDate(summary.startedAt)}`
                  : "Trip not started yet"}
                {summary.completedAt ? ` • Completed: ${formatDate(summary.completedAt)}` : ""}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Chip
              label={summary.status}
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(190, 242, 100, 0.15)" : "rgba(5, 150, 105, 0.12)",
                color: isDark ? "#bef264" : "#059669",
                border: "1px solid",
                borderColor: isDark ? "rgba(190, 242, 100, 0.3)" : "rgba(5, 150, 105, 0.3)",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 800,
                fontSize: "0.7rem",
              }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<PrintIcon sx={{ fontSize: 16 }} />}
              onClick={handlePrint}
              sx={{
                borderColor: "divider",
                color: "text.secondary",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.72rem",
                fontWeight: 700,
                "&:hover": { borderColor: "primary.main", color: "primary.main" },
              }}
            >
              Print Report
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* KPI Metric Cards Grid */}
      <Grid container spacing={2.5}>
        {/* Card 1: Duration & Stops */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            className="neo-convex"
            sx={{
              borderRadius: 2.5,
              height: "100%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <CalendarMonthIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Duration & Stops
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
                  {summary.totalDurationDays} {summary.totalDurationDays === 1 ? "Day" : "Days"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {summary.totalStops} planned route stop(s)
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Budget Variance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            className="neo-convex"
            sx={{
              borderRadius: 2.5,
              height: "100%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: isUnderBudget
                ? (isDark ? "rgba(190, 242, 100, 0.3)" : "rgba(5, 150, 105, 0.3)")
                : "rgba(248, 113, 113, 0.3)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: isDark ? "#38bdf8" : "#0284c7" }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Budget Spent
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
                  ₹{summary.totalExpenses.toLocaleString()}
                </Typography>
                <Chip
                  label={
                    isUnderBudget
                      ? `₹${summary.budgetVariance.toLocaleString()} Under Target`
                      : `₹${Math.abs(summary.budgetVariance).toLocaleString()} Over Target`
                  }
                  size="small"
                  sx={{
                    width: "fit-content",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    bgcolor: isUnderBudget
                      ? (isDark ? "rgba(190, 242, 100, 0.12)" : "rgba(5, 150, 105, 0.12)")
                      : "rgba(248, 113, 113, 0.12)",
                    color: isUnderBudget ? (isDark ? "#bef264" : "#059669") : "#f87171",
                    border: `1px solid ${isUnderBudget ? (isDark ? "rgba(190, 242, 100, 0.3)" : "rgba(5, 150, 105, 0.3)") : "rgba(248, 113, 113, 0.3)"}`,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Accommodations */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            className="neo-convex"
            sx={{
              borderRadius: 2.5,
              height: "100%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <HotelIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Accommodations
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
                  {summary.totalNights} {summary.totalNights === 1 ? "Night" : "Nights"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  ₹{summary.totalAccommodationCost.toLocaleString()} across {summary.totalAccommodations} stay(s)
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Gear Packed Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            className="neo-convex"
            sx={{
              borderRadius: 2.5,
              height: "100%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: isDark ? "#bef264" : "#059669" }}>
                  <ChecklistRtlIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Gear Readiness
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: isDark ? "#bef264" : "#059669" }}>
                  {summary.checklistCompletionPercentage}%
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {summary.completedChecklistItems} of {summary.totalChecklistItems} items packed
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
