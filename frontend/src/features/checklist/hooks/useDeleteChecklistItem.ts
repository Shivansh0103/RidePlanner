import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteChecklistItem } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";

export function useDeleteChecklistItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteChecklistItem(tripId, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      toast.success("Item deleted successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to delete item.";
      toast.error(message);
    },
  });
}
