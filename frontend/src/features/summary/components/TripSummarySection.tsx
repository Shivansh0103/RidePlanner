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
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper" }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {summary.tripName} – Post-Ride Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summary.startedAt
                  ? `Started: ${formatDate(summary.startedAt)}`
                  : "Trip not started yet"}
                {summary.completedAt ? ` • Completed: ${formatDate(summary.completedAt)}` : ""}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Chip label={summary.status} color="primary" sx={{ fontWeight: 700 }} />
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
              Print Report
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* KPI Metric Cards Grid */}
      <Grid container spacing={2.5}>
        {/* Card 1: Duration & Stops */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <CalendarMonthIcon />
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration & Stops
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {summary.totalDurationDays} {summary.totalDurationDays === 1 ? "Day" : "Days"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {summary.totalStops} planned route stop(s)
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Budget Variance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <AccountBalanceWalletIcon />
                  <Typography variant="subtitle2" color="text.secondary">
                    Budget Spent
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  ₹{summary.totalExpenses.toLocaleString()}
                </Typography>
                <Chip
                  label={
                    isUnderBudget
                      ? `₹${summary.budgetVariance.toLocaleString()} Under Target`
                      : `₹${Math.abs(summary.budgetVariance).toLocaleString()} Over Target`
                  }
                  color={isUnderBudget ? "success" : "error"}
                  size="small"
                  sx={{ width: "fit-content", fontWeight: 700, fontSize: "0.72rem" }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Accommodations */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <HotelIcon />
                  <Typography variant="subtitle2" color="text.secondary">
                    Accommodations
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {summary.totalNights} {summary.totalNights === 1 ? "Night" : "Nights"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{summary.totalAccommodationCost.toLocaleString()} across {summary.totalAccommodations} stay(s)
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Gear Packed Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2.5, height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <ChecklistRtlIcon />
                  <Typography variant="subtitle2" color="text.secondary">
                    Gear Readiness
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {summary.checklistCompletionPercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
