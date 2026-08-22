import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import { updateChecklistItem } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";
import type { UpdateItemRequest } from "../schemas/itemSchema";

interface UpdateItemParams {
  itemId: string;
  request: UpdateItemRequest;
}

export function useUpdateChecklistItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, request }: UpdateItemParams) =>
      updateChecklistItem(tripId, itemId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      queryClient.invalidateQueries({ queryKey: readinessKeys.tripReadiness(tripId) });
      toast.success("Item updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update item.");
    },
  });
}
