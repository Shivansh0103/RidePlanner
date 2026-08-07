import { z } from "zod";

export const updateBudgetSchema = z.object({
  targetBudget: z
    .number({ message: "Target budget must be a number" })
    .min(0, "Target budget cannot be negative"),
});

export type UpdateBudgetRequest = z.infer<typeof updateBudgetSchema>;
