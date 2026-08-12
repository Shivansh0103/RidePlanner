import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";

import type { TripBudget } from "@/features/budget/types/budget";
import { calculateBudgetMetrics } from "@/features/trips/utils/tripOverviewSelectors";
import { formatCurrency } from "@/shared/utils/formatters";

interface OverviewBudgetCardProps {
  budget?: TripBudget | null;
  onEditBudget?: () => void;
}

export default function OverviewBudgetCard({ budget, onEditBudget }: OverviewBudgetCardProps) {
  const metrics = calculateBudgetMetrics(budget);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Budget & Expenses Overview
            </Typography>
            {onEditBudget && (
              <IconButton size="small" onClick={onEditBudget} aria-label="Edit Budget">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Target Budget
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {formatCurrency(metrics.targetBudget)}
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Actual Spent
              </Typography>
              <Typography variant="subtitle1" color="info.main" sx={{ fontWeight: 800 }}>
                {formatCurrency(metrics.actualCost)}
              </Typography>
            </Box>
          </Box>

          {/* Buffer & Top Category Banner */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: metrics.isOverBudget ? "error.50" : "success.50",
              border: "1px solid",
              borderColor: metrics.isOverBudget ? "error.main" : "success.main",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: metrics.isOverBudget ? "error.dark" : "success.dark",
              }}
            >
              {metrics.isOverBudget ? "Target Exceeded" : "Remaining Target Buffer"}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: metrics.isOverBudget ? "error.dark" : "success.dark",
              }}
            >
              {formatCurrency(metrics.remainingTargetBuffer)}
            </Typography>
          </Box>

          {metrics.topCategory && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Top Category:
              </Typography>
              <Chip
                label={`${metrics.topCategory.name} (${formatCurrency(metrics.topCategory.amount)})`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
