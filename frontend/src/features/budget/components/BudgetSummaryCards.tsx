import EditIcon from "@mui/icons-material/Edit";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
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

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}>
          Financial Telemetry & Cost Control
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LocalGasStationIcon sx={{ fontSize: 16 }} />}
            onClick={onCalculateFuel}
            sx={{
              borderColor: "rgba(190, 242, 100, 0.4)",
              color: "#bef264",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 700,
              "&:hover": { borderColor: "#bef264", bgcolor: "rgba(190, 242, 100, 0.08)" },
            }}
          >
            Calculate Fuel
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={onEditBudget}
            className="glow-indigo"
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
            Edit Target Budget
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {/* Target Budget Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography
              className="font-mono"
              variant="caption"
              sx={{
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.68rem",
              }}
            >
              Target Budget
            </Typography>
            <Typography
              className="font-mono"
              variant="h5"
              sx={{ mt: 0.8, fontWeight: 800, color: "#f8fafc" }}
            >
              {formatCurrency(targetBudget)}
            </Typography>
          </Paper>
        </Grid>

        {/* Planned Cost Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography
              className="font-mono"
              variant="caption"
              sx={{
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.68rem",
              }}
            >
              Planned Estimates
            </Typography>
            <Typography
              className="font-mono"
              variant="h5"
              sx={{ mt: 0.8, fontWeight: 800, color: "#818cf8" }}
            >
              {formatCurrency(estimatedCost)}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Actual Spent Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography
              className="font-mono"
              variant="caption"
              sx={{
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.68rem",
              }}
            >
              Actual Logged Spent
            </Typography>
            <Typography
              className="font-mono"
              variant="h5"
              sx={{ mt: 0.8, fontWeight: 800, color: "#38bdf8" }}
            >
              {formatCurrency(actualCost)}
            </Typography>
          </Paper>
        </Grid>

        {/* Remaining Target Buffer Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: isOverTarget ? "1px solid rgba(248, 113, 113, 0.4)" : "1px solid rgba(190, 242, 100, 0.4)",
            }}
          >
            <Typography
              className="font-mono"
              variant="caption"
              sx={{
                color: isOverTarget ? "#f87171" : "#bef264",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.68rem",
              }}
            >
              {isOverTarget ? "Budget Deficit" : "Remaining Buffer"}
            </Typography>
            <Typography
              className="font-mono"
              variant="h5"
              sx={{ mt: 0.8, fontWeight: 800, color: isOverTarget ? "#f87171" : "#bef264" }}
            >
              {formatCurrency(remainingTargetBuffer)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
