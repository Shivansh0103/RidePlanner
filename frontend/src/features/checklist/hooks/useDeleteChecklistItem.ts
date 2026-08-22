import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import { deleteChecklistItem } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";

export function useDeleteChecklistItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteChecklistItem(tripId, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      queryClient.invalidateQueries({ queryKey: readinessKeys.tripReadiness(tripId) });
      toast.success("Item deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete item.");
    },
  });
}
