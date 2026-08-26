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
} from "@mui/material";

import { formatDate } from "@/shared/utils/date";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import { useTripSummary } from "../hooks/useTripSummary";

interface TripSummarySectionProps {
  tripId: string;
}

export default function TripSummarySection({ tripId }: TripSummarySectionProps) {
  const { data: summary, isLoading, isError } = useTripSummary(tripId);

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
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssessmentIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}>
                {summary.tripName} – Expedition Debrief
              </Typography>
              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#94a3b8" }}>
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
                bgcolor: "rgba(190, 242, 100, 0.15)",
                color: "#bef264",
                border: "1px solid rgba(190, 242, 100, 0.3)",
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
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "#f8fafc",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.72rem",
                fontWeight: 700,
                "&:hover": { borderColor: "#ffffff", bgcolor: "rgba(255, 255, 255, 0.06)" },
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
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#818cf8" }}>
                  <CalendarMonthIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Duration & Stops
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                  {summary.totalDurationDays} {summary.totalDurationDays === 1 ? "Day" : "Days"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
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
              bgcolor: "#1a1a1e",
              border: isUnderBudget ? "1px solid rgba(190, 242, 100, 0.3)" : "1px solid rgba(248, 113, 113, 0.3)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#38bdf8" }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Budget Spent
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: "#f8fafc" }}>
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
                    bgcolor: isUnderBudget ? "rgba(190, 242, 100, 0.12)" : "rgba(248, 113, 113, 0.12)",
                    color: isUnderBudget ? "#bef264" : "#f87171",
                    border: `1px solid ${isUnderBudget ? "rgba(190, 242, 100, 0.3)" : "rgba(248, 113, 113, 0.3)"}`,
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
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#818cf8" }}>
                  <HotelIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Accommodations
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                  {summary.totalNights} {summary.totalNights === 1 ? "Night" : "Nights"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
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
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#bef264" }}>
                  <ChecklistRtlIcon sx={{ fontSize: 18 }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Gear Readiness
                  </Typography>
                </Stack>
                <Typography className="font-mono" variant="h4" sx={{ fontWeight: 800, color: "#bef264" }}>
                  {summary.checklistCompletionPercentage}%
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
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
