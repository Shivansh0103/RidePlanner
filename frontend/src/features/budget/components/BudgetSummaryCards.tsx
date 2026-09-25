import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EditIcon from "@mui/icons-material/Edit";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PaymentsIcon from "@mui/icons-material/Payments";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/shared/utils/formatters";

interface BudgetSummaryCardsProps {
  targetBudget: number;
  estimatedCost: number;
  actualCost: number;
  remainingTargetBuffer: number;
  onEditBudget: () => void;
  onCalculateFuel: () => void;
}

export default function BudgetSummaryCards({
  targetBudget,
  estimatedCost,
  actualCost,
  remainingTargetBuffer,
  onEditBudget,
  onCalculateFuel,
}: BudgetSummaryCardsProps) {
  const isOverTarget = remainingTargetBuffer < 0;
  const unallocatedBudget = targetBudget - estimatedCost;
  const isOverAllocated = unallocatedBudget < 0;

  const allocationPercent =
    targetBudget > 0 ? Math.min(100, Math.round((estimatedCost / targetBudget) * 100)) : 0;
  const spentPercent =
    targetBudget > 0 ? Math.min(100, Math.round((actualCost / targetBudget) * 100)) : 0;

  return (
    <Stack spacing={2.5}>
      {/* Top Header Row with Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
            <AccountBalanceWalletIcon
              sx={{
                color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "primary.main"),
                fontSize: 22,
              }}
            />
            <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "text.primary" }}>
              Financial Telemetry & Cost Control
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem", mt: 0.2 }}>
            Manage expenditure ceiling, cost allocations, and live road expense receipts.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LocalGasStationIcon sx={{ fontSize: 15 }} />}
            onClick={onCalculateFuel}
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(56, 189, 248, 0.05)" : "rgba(2, 132, 199, 0.05)",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(56, 189, 248, 0.3)" : "rgba(2, 132, 199, 0.3)",
              color: (theme) => (theme.palette.mode === "dark" ? "#38bdf8" : "#0284c7"),
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 700,
              px: 1.4,
              py: 0.55,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                borderColor: (theme) => (theme.palette.mode === "dark" ? "#38bdf8" : "#0284c7"),
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(56, 189, 248, 0.12)" : "rgba(2, 132, 199, 0.1)",
              },
            }}
          >
            Calculate Fuel
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 15 }} />}
            onClick={onEditBudget}
            sx={{
              bgcolor: "primary.main",
              color: "#ffffff",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
              px: 1.6,
              py: 0.55,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Set Target Budget
          </Button>
        </Stack>
      </Box>

      {/* 4 Telemetry Metric Bento Cards */}
      <Grid container spacing={1.8}>
        {/* 1. Target Budget Card */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                className="font-mono"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.66rem",
                }}
              >
                Target Ceiling
              </Typography>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: 1.5,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                }}
              >
                <AccountBalanceWalletIcon sx={{ fontSize: 14 }} />
              </Box>
            </Stack>

            <Box sx={{ my: 0.8 }}>
              <Typography className="font-mono" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.3rem" }}>
                {formatCurrency(targetBudget)}
              </Typography>
            </Box>

            <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "text.secondary" }}>
              Total Expedition Cap
            </Typography>
          </Paper>
        </Grid>

        {/* 2. Planned Estimates Card (With Unallocated Buffer) */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: isOverAllocated
                ? (theme) => (theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.4)" : "rgba(217, 119, 6, 0.4)")
                : "divider",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                className="font-mono"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.66rem",
                }}
              >
                Planned Estimates
              </Typography>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: 1.5,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(129, 140, 248, 0.12)" : "rgba(79, 70, 229, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                <PriceCheckIcon sx={{ fontSize: 14 }} />
              </Box>
            </Stack>

            <Box sx={{ my: 0.8 }}>
              <Typography className="font-mono" sx={{ fontWeight: 800, color: "primary.main", fontSize: "1.3rem" }}>
                {formatCurrency(estimatedCost)}
              </Typography>
            </Box>

            <Typography
              className="font-mono"
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: isOverAllocated
                  ? (theme) => (theme.palette.mode === "dark" ? "#fbbf24" : "#d97706")
                  : "text.secondary",
              }}
            >
              {isOverAllocated
                ? `⚠ ${formatCurrency(Math.abs(unallocatedBudget))} Over Target (${allocationPercent}%)`
                : `Unallocated: ${formatCurrency(unallocatedBudget)} (${100 - allocationPercent}% room)`}
            </Typography>
          </Paper>
        </Grid>

        {/* 3. Actual Spent Card */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                className="font-mono"
                sx={{
                  color: (theme) => (theme.palette.mode === "dark" ? "#38bdf8" : "#0284c7"),
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.66rem",
                }}
              >
                Actual Realized
              </Typography>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: 1.5,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(56, 189, 248, 0.12)" : "rgba(2, 132, 199, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: (theme) => (theme.palette.mode === "dark" ? "#38bdf8" : "#0284c7"),
                }}
              >
                <PaymentsIcon sx={{ fontSize: 14 }} />
              </Box>
            </Stack>

            <Box sx={{ my: 0.8 }}>
              <Typography
                className="font-mono"
                sx={{
                  fontWeight: 800,
                  color: (theme) => (theme.palette.mode === "dark" ? "#38bdf8" : "#0284c7"),
                  fontSize: "1.3rem",
                }}
              >
                {formatCurrency(actualCost)}
              </Typography>
            </Box>

            <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "text.secondary" }}>
              {spentPercent}% of Target Consumed
            </Typography>
          </Paper>
        </Grid>

        {/* 4. Remaining Cash Runway Buffer Card */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.2,
              borderRadius: 2.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: isOverTarget
                ? "error.main"
                : (theme) => (theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.35)" : "divider"),
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                className="font-mono"
                sx={{
                  color: isOverTarget
                    ? "error.main"
                    : (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.66rem",
                }}
              >
                {isOverTarget ? "Budget Deficit" : "Remaining Runway"}
              </Typography>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: 1.5,
                  bgcolor: isOverTarget
                    ? "rgba(248, 113, 113, 0.12)"
                    : (theme) => (theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.12)" : "rgba(5, 150, 105, 0.1)"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isOverTarget
                    ? "error.main"
                    : (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              </Box>
            </Stack>

            <Box sx={{ my: 0.8 }}>
              <Typography
                className="font-mono"
                sx={{
                  fontWeight: 800,
                  color: isOverTarget
                    ? "error.main"
                    : (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                  fontSize: "1.3rem",
                }}
              >
                {formatCurrency(remainingTargetBuffer)}
              </Typography>
            </Box>

            <Typography
              className="font-mono"
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: isOverTarget
                  ? "error.main"
                  : (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
              }}
            >
              {isOverTarget ? "Over Budget Limit" : "Cash Buffer Available"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
