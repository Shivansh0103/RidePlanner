import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Item added successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to add item.";
      toast.error(message);
    },
  });
}
