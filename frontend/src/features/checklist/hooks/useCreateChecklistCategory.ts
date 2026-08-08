import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createChecklistCategory } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";
import type { CreateCategoryRequest } from "../schemas/categorySchema";

export function useCreateChecklistCategory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCategoryRequest) =>
      createChecklistCategory(tripId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      toast.success("Category added successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to add category.";
      toast.error(message);
    },
  });
}
