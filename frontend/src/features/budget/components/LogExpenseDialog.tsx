import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  expenseSchema,
  type ExpenseFormValues,
} from "../schemas/expenseSchemas";
import type { BudgetCategoryType, Expense, PaymentMethod } from "../types/budget";

interface LogExpenseDialogProps {
  open: boolean;
  expense?: Expense | null;
  defaultCategory?: BudgetCategoryType;
  accommodations?: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (data: ExpenseFormValues) => Promise<void>;
  isLoading?: boolean;
}

const CATEGORIES: BudgetCategoryType[] = [
  "Fuel",
  "Accommodation",
  "Food",
  "TollsAndPermits",
  "Miscellaneous",
];

const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string }> = [
  { value: "Cash", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CreditCard", label: "Credit Card" },
  { value: "DebitCard", label: "Debit Card" },
  { value: "Other", label: "Other" },
];

export default function LogExpenseDialog({
  open,
  expense,
  defaultCategory = "Fuel",
  accommodations = [],
  onClose,
  onSubmit,
  isLoading = false,
}: LogExpenseDialogProps) {
  const isEditing = Boolean(expense);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: defaultCategory,
      title: "",
      amount: 0,
      expenseDate: new Date().toISOString().split("T")[0],
      paymentMethod: "UPI",
      notes: "",
      accommodationId: null,
      tripStopId: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (expense) {
        reset({
          category: expense.category,
          title: expense.title,
          amount: expense.amount,
          expenseDate: expense.expenseDate,
          paymentMethod: expense.paymentMethod ?? "UPI",
          notes: expense.notes ?? "",
          accommodationId: expense.accommodationId ?? null,
          tripStopId: expense.tripStopId ?? null,
        });
      } else {
        reset({
          category: defaultCategory,
          title: "",
          amount: 0,
          expenseDate: new Date().toISOString().split("T")[0],
          paymentMethod: "UPI",
          notes: "",
          accommodationId: null,
          tripStopId: null,
        });
      }
    }
  }, [open, expense, defaultCategory, reset]);

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    const sanitizedData: ExpenseFormValues = {
      ...data,
      accommodationId: data.accommodationId && data.accommodationId.trim() !== "" ? data.accommodationId : null,
      tripStopId: data.tripStopId && data.tripStopId.trim() !== "" ? data.tripStopId : null,
      notes: data.notes && data.notes.trim() !== "" ? data.notes : null,
    };
    await onSubmit(sanitizedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditing ? "Edit Actual Expense" : "Log Actual Expense"}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Category */}
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.category)}>
                  <InputLabel id="expense-category-label">Category</InputLabel>
                  <Select
                    {...field}
                    labelId="expense-category-label"
                    label="Category"
                  >
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Title */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description / Title"
                  placeholder="e.g. Petrol at IOCL Ambala, Dinner at Dhaba"
                  fullWidth
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              )}
            />

            {/* Amount */}
            <Controller
              name="amount"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  label="Amount (₹)"
                  type="number"
                  fullWidth
                  value={value === 0 ? "" : value}
                  onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                  error={Boolean(errors.amount)}
                  helperText={errors.amount?.message}
                  slotProps={{ htmlInput: { min: 0, step: "any" } }}
                />
              )}
            />

            {/* Expense Date */}
            <Controller
              name="expenseDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Expense Date"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={Boolean(errors.expenseDate)}
                  helperText={errors.expenseDate?.message}
                />
              )}
            />

            {/* Payment Method */}
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.paymentMethod)}>
                  <InputLabel id="payment-method-label">Payment Method</InputLabel>
                  <Select
                    {...field}
                    value={field.value ?? ""}
                    labelId="payment-method-label"
                    label="Payment Method"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <MenuItem key={pm.value} value={pm.value}>
                        {pm.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {/* Optional Accommodation Linker */}
            {accommodations.length > 0 && (
              <Controller
                name="accommodationId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="accommodation-link-label">
                      Link to Accommodation (Optional)
                    </InputLabel>
                    <Select
                      {...field}
                      value={field.value ?? ""}
                      labelId="accommodation-link-label"
                      label="Link to Accommodation (Optional)"
                    >
                      <MenuItem value="">
                        <em>None (Unlinked Expense)</em>
                      </MenuItem>
                      {accommodations.map((acc) => (
                        <MenuItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}

            {/* Notes */}
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Notes (Optional)"
                  placeholder="Receipt details, transaction ID, comments..."
                  multiline
                  rows={2}
                  fullWidth
                  error={Boolean(errors.notes)}
                  helperText={errors.notes?.message}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ fontWeight: 600 }}
          >
            {isLoading ? "Saving..." : isEditing ? "Update Expense" : "Log Expense"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
