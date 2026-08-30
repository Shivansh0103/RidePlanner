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
            <AccountBalanceWalletIcon sx={{ color: "#bef264", fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}>
              Financial Telemetry & Cost Control
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.8rem", mt: 0.2 }}>
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
              bgcolor: "rgba(56, 189, 248, 0.05)",
              borderColor: "rgba(56, 189, 248, 0.3)",
              color: "#38bdf8",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 700,
              px: 1.4,
              py: 0.55,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { borderColor: "#38bdf8", bgcolor: "rgba(56, 189, 248, 0.12)" },
            }}
          >
            Calculate Fuel
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 15 }} />}
            onClick={onEditBudget}
            className="glow-indigo"
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
              px: 1.6,
              py: 0.55,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { bgcolor: "#4f46e5" },
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
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
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
                  color: "#94a3b8",
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
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#e2e8f0",
                }}
              >
                <AccountBalanceWalletIcon sx={{ fontSize: 14 }} />
              </Box>
            </Stack>

            <Box sx={{ my: 0.8 }}>
              <Typography className="font-mono" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "1.3rem" }}>
                {formatCurrency(targetBudget)}
              </Typography>
            </Box>

            <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#71717a" }}>
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
              bgcolor: "#1a1a1e",
              border: isOverAllocated ? "1px solid rgba(251, 191, 36, 0.4)" : "1px solid rgba(129, 140, 248, 0.3)",
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
                  color: "#818cf8",
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
                  bgcolor: "rgba(129, 140, 248, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818cf8",
                }}
              >
                <PriceCheckIcon sx={{ fontSize: 14 }} />
              </Box>
            </Stack>

            <Box sx={{ my: 0.8 }}>
              <Typography className="font-mono" sx={{ fontWeight: 800, color: "#818cf8", fontSize: "1.3rem" }}>
                {formatCurrency(estimatedCost)}
              </Typography>
            </Box>

            <Typography
              className="font-mono"
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: isOverAllocated ? "#fbbf24" : "#94a3b8",
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
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(56, 189, 248, 0.3)",
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
                  color: "#38bdf8",
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
                  bgcolor: "rgba(56, 189, 248, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8",
                }}
              >
                <PaymentsIcon sx={{ fontSize: 14 }} />
              </Box>
            </Stack>

            <Box sx={{ my: 0.8 }}>
              <Typography className="font-mono" sx={{ fontWeight: 800, color: "#38bdf8", fontSize: "1.3rem" }}>
                {formatCurrency(actualCost)}
              </Typography>
            </Box>

            <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8" }}>
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
              bgcolor: "#1a1a1e",
              border: isOverTarget ? "1px solid rgba(248, 113, 113, 0.4)" : "1px solid rgba(190, 242, 100, 0.35)",
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
                  color: isOverTarget ? "#f87171" : "#bef264",
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
                  bgcolor: isOverTarget ? "rgba(248, 113, 113, 0.12)" : "rgba(190, 242, 100, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isOverTarget ? "#f87171" : "#bef264",
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
                  color: isOverTarget ? "#f87171" : "#bef264",
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
                color: isOverTarget ? "#f87171" : "#bef264",
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
