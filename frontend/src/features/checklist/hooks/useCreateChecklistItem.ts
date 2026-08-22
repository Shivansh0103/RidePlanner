import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import { createChecklistItem } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";
import type { CreateItemRequest } from "../schemas/itemSchema";

export function useCreateChecklistItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateItemRequest) =>
      createChecklistItem(tripId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      queryClient.invalidateQueries({ queryKey: readinessKeys.tripReadiness(tripId) });
      toast.success("Item added successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add item.");
    },
  });
}
