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
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc", fontSize: "1.05rem" }}
            >
              Category Variance & Utilization Ledger
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.78rem" }}>
              Live comparison between planned estimates and realized expenditure per category
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
            <Table size="small">
              <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
                <TableRow>
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.2 }}>
                    Category
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.2 }}>
                    Planned Estimate
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.2 }}>
                    Actual Spent
                  </TableCell>
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", width: "28%", py: 1.2 }}>
                    Utilization
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", py: 1.2 }}>
                    Budget Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => {
                  const planned = cat.estimatedAmount;
                  const actual = cat.actualAmount;
                  const variance = planned - actual; // Positive = Under budget (money left), Negative = Over budget (deficit)

                  const percentage =
                    planned > 0
                      ? Math.round((actual / planned) * 100)
                      : actual > 0
                      ? 100
                      : 0;

                  const isOver = actual > planned;
                  const isUnder = actual < planned;
                  const hasAllocation = planned > 0 || actual > 0;

                  return (
                    <TableRow
                      key={cat.category}
                      sx={{
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.02)" },
                        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.82rem", py: 1.4 }}>
                        {cat.category}
                      </TableCell>

                      <TableCell align="right" className="font-mono" sx={{ fontWeight: 700, color: "#818cf8", fontSize: "0.8rem", py: 1.4 }}>
                        {formatCurrency(planned)}
                      </TableCell>

                      <TableCell
                        align="right"
                        className="font-mono"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          color: isOver ? "#f87171" : "#38bdf8",
                          py: 1.4,
                        }}
                      >
                        {formatCurrency(actual)}
                      </TableCell>

                      <TableCell sx={{ py: 1.4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, percentage)}
                            sx={{
                              flexGrow: 1,
                              height: 5,
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
                            sx={{ fontWeight: 700, minWidth: 32, fontSize: "0.68rem", color: "#94a3b8" }}
                          >
                            {percentage}%
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="right" sx={{ py: 1.4 }}>
                        {!hasAllocation ? (
                          <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#71717a" }}>
                            — Unbudgeted
                          </Typography>
                        ) : isOver ? (
                          <Chip
                            label={`⚠ ${formatCurrency(actual - planned)} Over`}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.66rem",
                              fontFamily: '"JetBrains Mono", monospace',
                              bgcolor: "rgba(248, 113, 113, 0.12)",
                              color: "#f87171",
                              border: "1px solid rgba(248, 113, 113, 0.35)",
                              height: 22,
                            }}
                          />
                        ) : isUnder ? (
                          <Chip
                            label={`✓ ${formatCurrency(variance)} Left`}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.66rem",
                              fontFamily: '"JetBrains Mono", monospace',
                              bgcolor: "rgba(190, 242, 100, 0.12)",
                              color: "#bef264",
                              border: "1px solid rgba(190, 242, 100, 0.35)",
                              height: 22,
                            }}
                          />
                        ) : (
                          <Chip
                            label="✓ On Budget"
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.66rem",
                              fontFamily: '"JetBrains Mono", monospace',
                              bgcolor: "rgba(129, 140, 248, 0.12)",
                              color: "#818cf8",
                              border: "1px solid rgba(129, 140, 248, 0.3)",
                              height: 22,
                            }}
                          />
                        )}
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
