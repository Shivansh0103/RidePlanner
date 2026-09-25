import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import EmptyState from "@/shared/ui/EmptyState";
import { formatCurrency } from "@/shared/utils/formatters";

import type { Expense } from "../types/budget";

interface ExpenseLogTableProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: "ALL", label: "All Categories" },
  { value: "Fuel", label: "Fuel" },
  { value: "Accommodation", label: "Accommodation" },
  { value: "Food", label: "Food" },
  { value: "TollsAndPermits", label: "Tolls & Permits" },
  { value: "Miscellaneous", label: "Miscellaneous" },
];

const PAYMENT_METHODS: Array<{ value: string; label: string }> = [
  { value: "ALL", label: "All Payment Modes" },
  { value: "Cash", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CreditCard", label: "Credit Card" },
  { value: "DebitCard", label: "Debit Card" },
  { value: "Other", label: "Other" },
];

export default function ExpenseLogTable({
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}: ExpenseLogTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory =
      categoryFilter === "ALL" || e.category === categoryFilter;
    const matchesPayment =
      paymentFilter === "ALL" || e.paymentMethod === paymentFilter;
    return matchesCategory && matchesPayment;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    return new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime();
  });

  return (
    <Card
      className="neo-convex"
      sx={{
        borderRadius: 2.5,
        mt: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          {/* Header & Controls */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "text.primary" }}
              >
                Operational Expense Ledger
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Real-time financial transactions logged during this expedition
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={onAddExpense}
              sx={{
                bgcolor: "primary.main",
                color: "#ffffff",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                alignSelf: { xs: "stretch", sm: "auto" },
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Log Expense
            </Button>
          </Box>

          {/* Filters */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="category-filter-label" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                Category
              </InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                  color: "text.primary",
                  fontSize: "0.78rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value} sx={{ fontSize: "0.8rem" }}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="payment-filter-label" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                Payment Method
              </InputLabel>
              <Select
                labelId="payment-filter-label"
                value={paymentFilter}
                label="Payment Method"
                onChange={(e) => setPaymentFilter(e.target.value)}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                  color: "text.primary",
                  fontSize: "0.78rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <MenuItem key={pm.value} value={pm.value} sx={{ fontSize: "0.8rem" }}>
                    {pm.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Expenses Data Table */}
          {sortedExpenses.length === 0 ? (
            <EmptyState
              icon={<ReceiptLongIcon sx={{ fontSize: 48, color: "primary.main" }} />}
              title="No Logged Expenses Found"
              description={
                expenses.length === 0
                  ? "Start logging transactions and fuel receipts incurred during your trip."
                  : "No logged expenses match your active category/payment filters."
              }
              action={
                expenses.length === 0 ? (
                  <Button variant="contained" startIcon={<AddIcon />} onClick={onAddExpense} sx={{ bgcolor: "primary.main" }}>
                    Log First Expense
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <TableContainer
              component={Paper}
              className="neo-inset"
              sx={{
                borderRadius: 2,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Table size="medium">
                <TableHead
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment Mode</TableCell>
                    <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Amount
                    </TableCell>
                    <TableCell align="center" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedExpenses.map((expense) => (
                    <TableRow
                      key={expense.id}
                      sx={{
                        "&:hover": { bgcolor: "action.hover" },
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <TableCell className="font-mono" sx={{ whiteSpace: "nowrap", fontSize: "0.78rem", color: "text.secondary" }}>
                        {new Date(expense.expenseDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={expense.category}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.1)",
                            color: "primary.main",
                            border: "1px solid",
                            borderColor: (theme) =>
                              theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.25)",
                            fontFamily: '"JetBrains Mono", monospace',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.82rem" }}>
                          {expense.title}
                        </Typography>
                        {expense.notes && (
                          <Typography
                            variant="caption"
                            sx={{ display: "block", mt: 0.2, color: "text.secondary", fontStyle: "italic" }}
                          >
                            {expense.notes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {expense.paymentMethod ? (
                          <Chip
                            label={expense.paymentMethod}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
                              color: "text.secondary",
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        className="font-mono"
                        sx={{
                          fontWeight: 800,
                          color: (theme) => (theme.palette.mode === "dark" ? "#38bdf8" : "#0284c7"),
                          fontSize: "0.85rem",
                        }}
                      >
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() => onEditExpense(expense)}
                            aria-label="Edit Expense"
                            sx={{ color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "action.hover" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onDeleteExpense(expense)}
                            aria-label="Delete Expense"
                            sx={{ color: "text.secondary", "&:hover": { color: "error.main", bgcolor: "action.hover" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
