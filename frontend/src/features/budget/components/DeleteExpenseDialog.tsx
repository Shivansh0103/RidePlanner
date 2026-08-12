import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Expense } from "../types/budget";

interface DeleteExpenseDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onConfirm: (expenseId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function DeleteExpenseDialog({
  open,
  expense,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteExpenseDialogProps) {
  if (!expense) return null;

  const handleConfirm = async () => {
    await onConfirm(expense.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Delete Expense</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the expense entry{" "}
          <strong>"{expense.title}"</strong> (₹
          {expense.amount.toLocaleString("en-IN")})? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete Expense"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
