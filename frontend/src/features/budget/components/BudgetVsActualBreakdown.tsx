import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/shared/utils/formatters";

import type { BudgetCategory } from "../types/budget";

interface BudgetVsActualBreakdownProps {
  categories: BudgetCategory[];
}

export default function BudgetVsActualBreakdown({
  categories = [],
}: BudgetVsActualBreakdownProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Budget vs Actual Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Category-level breakdown comparing planned estimates with real expenditure
            </Typography>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="medium">
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Planned Estimate
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Actual Spent
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: "30%" }}>
                    Budget Utilization
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Variance (Actual - Planned)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => {
                  const planned = cat.estimatedAmount;
                  const actual = cat.actualAmount;
                  const variance = cat.variance; // Actual - Planned

                  const percentage =
                    planned > 0
                      ? Math.min(100, Math.round((actual / planned) * 100))
                      : actual > 0
                      ? 100
                      : 0;

                  const isOver = variance > 0;
                  const isUnder = variance < 0;

                  return (
                    <TableRow key={cat.category} hover>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {cat.category}
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(planned)}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: isOver ? "error.main" : "text.primary",
                        }}
                      >
                        {formatCurrency(actual)}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            color={isOver ? "error" : "primary"}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, minWidth: 36 }}
                          >
                            {percentage}%
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        <Chip
                          label={
                            isOver
                              ? `+${formatCurrency(variance)} (Over)`
                              : isUnder
                              ? `${formatCurrency(variance)} (Under)`
                              : "On Budget (₹0)"
                          }
                          size="small"
                          color={isOver ? "error" : isUnder ? "success" : "default"}
                          sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </CardContent>
    </Card>
  );
}
