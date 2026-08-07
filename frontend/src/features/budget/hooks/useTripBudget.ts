import { useQuery } from "@tanstack/react-query";

import { getTripBudget } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";

export function useTripBudget(tripId: string) {
  return useQuery({
    queryKey: budgetKeys.detail(tripId),
    queryFn: () => getTripBudget(tripId),
    enabled: Boolean(tripId),
  });
}
