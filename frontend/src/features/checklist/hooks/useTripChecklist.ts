import { useQuery } from "@tanstack/react-query";

import { getTripChecklist } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";

export function useTripChecklist(tripId: string) {
  return useQuery({
    queryKey: checklistKeys.detail(tripId),
    queryFn: () => getTripChecklist(tripId),
    enabled: Boolean(tripId),
  });
}
