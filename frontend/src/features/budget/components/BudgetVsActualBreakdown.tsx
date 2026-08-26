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
    <Card
      className="neo-convex"
      sx={{
        borderRadius: 2.5,
        mt: 3,
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}
            >
              Category Variance & Utilization Ledger
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              High-density telemetry comparing planned estimates with real expenditure
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            className="neo-inset"
            sx={{
              borderRadius: 2,
              bgcolor: "#141313",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Table size="medium">
              <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
                <TableRow>
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</TableCell>
                  <TableCell align="right" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Planned Estimate
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Actual Spent
                  </TableCell>
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", width: "30%" }}>
                    Utilization Meter
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                    <TableRow
                      key={cat.category}
                      sx={{
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02)" },
                        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.85rem" }}>
                        {cat.category}
                      </TableCell>

                      <TableCell align="right" className="font-mono" sx={{ fontWeight: 700, color: "#818cf8", fontSize: "0.82rem" }}>
                        {formatCurrency(planned)}
                      </TableCell>

                      <TableCell
                        align="right"
                        className="font-mono"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          color: isOver ? "#f87171" : "#38bdf8",
                        }}
                      >
                        {formatCurrency(actual)}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "rgba(255, 255, 255, 0.08)",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: isOver ? "#f87171" : percentage > 85 ? "#fbbf24" : "#6366f1",
                                borderRadius: 3,
                              },
                            }}
                          />
                          <Typography
                            className="font-mono"
                            sx={{ fontWeight: 700, minWidth: 36, fontSize: "0.72rem", color: "#94a3b8" }}
                          >
                            {percentage}%
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        <Chip
                          label={
                            isOver
                              ? `+${formatCurrency(variance)} (Deficit)`
                              : isUnder
                              ? `${formatCurrency(variance)} (Buffer)`
                              : "On Target (₹0)"
                          }
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            fontFamily: '"JetBrains Mono", monospace',
                            bgcolor: isOver
                              ? "rgba(248, 113, 113, 0.12)"
                              : isUnder
                              ? "rgba(190, 242, 100, 0.12)"
                              : "rgba(255, 255, 255, 0.05)",
                            color: isOver ? "#f87171" : isUnder ? "#bef264" : "#a1a1aa",
                            border: `1px solid ${
                              isOver
                                ? "rgba(248, 113, 113, 0.3)"
                                : isUnder
                                ? "rgba(190, 242, 100, 0.3)"
                                : "rgba(255, 255, 255, 0.08)"
                            }`,
                          }}
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
