import { z } from "zod";

export const expenseSchema = z.object({
  category: z.enum([
    "Fuel",
    "Accommodation",
    "Food",
    "TollsAndPermits",
    "Miscellaneous",
  ]),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  amount: z
    .number({ message: "Amount must be a valid number" })
    .gt(0, "Amount must be greater than zero"),
  expenseDate: z.string().min(1, "Expense date is required"),
  paymentMethod: z
    .enum(["Cash", "UPI", "CreditCard", "DebitCard", "Other"])
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .nullable(),
  accommodationId: z.string().optional().nullable(),
  tripStopId: z.string().optional().nullable(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
