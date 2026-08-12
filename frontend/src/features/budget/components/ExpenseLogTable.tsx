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
    <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
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
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Actual Expense Log
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track every monetary transaction logged for this trip
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddExpense}
              sx={{ fontWeight: 600, alignSelf: { xs: "stretch", sm: "auto" } }}
            >
              Log Expense
            </Button>
          </Box>

          {/* Filters */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="category-filter-label">Filter Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                label="Filter Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="payment-filter-label">Payment Mode</InputLabel>
              <Select
                labelId="payment-filter-label"
                value={paymentFilter}
                label="Payment Mode"
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <MenuItem key={pm.value} value={pm.value}>
                    {pm.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Expenses Data Table */}
          {sortedExpenses.length === 0 ? (
            <EmptyState
              icon={<ReceiptLongIcon sx={{ fontSize: 48, color: "text.secondary" }} />}
              title="No Actual Expenses Found"
              description={
                expenses.length === 0
                  ? "Start logging expenses incurred during or for your trip."
                  : "No expenses match your selected category/payment filters."
              }
              action={
                expenses.length === 0 ? (
                  <Button variant="contained" startIcon={<AddIcon />} onClick={onAddExpense}>
                    Log First Expense
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="medium">
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Payment Mode</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Amount
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedExpenses.map((expense) => (
                    <TableRow key={expense.id} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
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
                          variant="outlined"
                          color="primary"
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {expense.title}
                        </Typography>
                        {expense.notes && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.25 }}
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
                            sx={{ fontSize: "0.7rem" }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() => onEditExpense(expense)}
                            aria-label="Edit Expense"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteExpense(expense)}
                            aria-label="Delete Expense"
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
