import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateChecklistItem } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";
import type { UpdateItemRequest } from "../schemas/itemSchema";

export function useUpdateChecklistItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      request,
    }: {
      itemId: string;
      request: UpdateItemRequest;
    }) => updateChecklistItem(tripId, itemId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      toast.success("Item updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to update item.";
      toast.error(message);
    },
  });
}
