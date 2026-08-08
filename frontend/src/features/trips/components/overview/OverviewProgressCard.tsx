import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MapIcon from "@mui/icons-material/Map";
import { Box, Card, CardContent, LinearProgress, Stack, Typography } from "@mui/material";

import { formatCurrency } from "@/shared/utils/formatters";

interface OverviewProgressCardProps {
  checklistPercentage: number;
  completedItemsCount: number;
  totalItemsCount: number;
  budgetPercentage: number;
  estimatedCost: number;
  targetBudget: number;
  itineraryPercentage: number;
  validStopsCount: number;
}

export default function OverviewProgressCard({
  checklistPercentage,
  completedItemsCount,
  totalItemsCount,
  budgetPercentage,
  estimatedCost,
  targetBudget,
  itineraryPercentage,
  validStopsCount,
}: OverviewProgressCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2.5}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Planning Progress
          </Typography>

          {/* Checklist Progress */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AssignmentTurnedInIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Preparation Checklist
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }} color="text.secondary">
                {checklistPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={checklistPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor: checklistPercentage === 100 ? "success.main" : "primary.main",
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {completedItemsCount} of {totalItemsCount} items ready
            </Typography>
          </Box>

          {/* Budget Utilization Progress */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletIcon fontSize="small" color="info" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Budget Utilization
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }} color="text.secondary">
                {targetBudget > 0 ? `${budgetPercentage}%` : "Not set"}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={budgetPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor:
                    estimatedCost > targetBudget && targetBudget > 0
                      ? "error.main"
                      : "info.main",
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {targetBudget > 0
                ? `${formatCurrency(estimatedCost)} of ${formatCurrency(targetBudget)} allocated`
                : "Target budget not configured yet"}
            </Typography>
          </Box>

          {/* Itinerary Completeness Progress */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MapIcon fontSize="small" color="success" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Route Completeness
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }} color="text.secondary">
                {itineraryPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={itineraryPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor: "success.main",
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {validStopsCount >= 2
                ? `${validStopsCount} stops mapped on route`
                : validStopsCount === 1
                  ? "1 stop added (add at least 1 more for route)"
                  : "No stops added yet"}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
