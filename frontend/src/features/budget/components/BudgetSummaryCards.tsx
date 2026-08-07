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
  remainingBuffer: number;
  onEditBudget: () => void;
  onCalculateFuel: () => void;
}

export default function BudgetSummaryCards({
  targetBudget,
  estimatedCost,
  remainingBuffer,
  onEditBudget,
  onCalculateFuel,
}: BudgetSummaryCardsProps) {
  const isOverBudget = remainingBuffer < 0;

  return (
    <Stack spacing={2}>
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
          Trip Budget
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<LocalGasStationIcon />}
            onClick={onCalculateFuel}
            color="primary"
          >
            Calculate Fuel
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEditBudget}
          >
            Edit Target Budget
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Target Budget Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Target Budget
              </Typography>
              <Typography
                variant="h4"
                color="text.primary"
                sx={{ mt: 1, fontWeight: 700 }}
              >
                {formatCurrency(targetBudget)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Estimated Cost Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Estimated Cost
              </Typography>
              <Typography
                variant="h4"
                color="primary.main"
                sx={{ mt: 1, fontWeight: 700 }}
              >
                {formatCurrency(estimatedCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Remaining Buffer Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              height: "100%",
              borderColor: isOverBudget ? "error.main" : "divider",
              backgroundColor: isOverBudget
                ? "action.hover"
                : "background.paper",
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Remaining Buffer
              </Typography>
              <Typography
                variant="h4"
                color={isOverBudget ? "error.main" : "success.main"}
                sx={{ mt: 1, fontWeight: 700 }}
              >
                {formatCurrency(remainingBuffer)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
