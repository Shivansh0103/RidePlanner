import { useQuery } from "@tanstack/react-query";

import { getTripExpenses } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";

export function useTripExpenses(tripId: string) {
  return useQuery({
    queryKey: budgetKeys.expenses(tripId),
    queryFn: () => getTripExpenses(tripId),
    enabled: Boolean(tripId),
  });
}
