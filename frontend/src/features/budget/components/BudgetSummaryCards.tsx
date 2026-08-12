import EditIcon from "@mui/icons-material/Edit";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Trip Budget & Costs
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<LocalGasStationIcon />}
            onClick={onCalculateFuel}
            color="primary"
            aria-label="Calculate Fuel Cost"
          >
            Calculate Fuel
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEditBudget}
            aria-label="Edit Target Budget"
          >
            Edit Target Budget
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {/* Target Budget Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Target Budget
              </Typography>
              <Typography
                variant="h5"
                color="text.primary"
                sx={{ mt: 0.5, fontWeight: 800 }}
              >
                {formatCurrency(targetBudget)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Planned Cost Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Planned Cost
              </Typography>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ mt: 0.5, fontWeight: 800 }}
              >
                {formatCurrency(estimatedCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Actual Spent Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Total Actual Spent
              </Typography>
              <Typography
                variant="h5"
                color="info.main"
                sx={{ mt: 0.5, fontWeight: 800 }}
              >
                {formatCurrency(actualCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Remaining Target Buffer Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              height: "100%",
              borderColor: isOverTarget ? "error.main" : "divider",
              backgroundColor: isOverTarget ? "action.hover" : "background.paper",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Remaining Target Buffer
              </Typography>
              <Typography
                variant="h5"
                color={isOverTarget ? "error.main" : "success.main"}
                sx={{ mt: 0.5, fontWeight: 800 }}
              >
                {formatCurrency(remainingTargetBuffer)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
