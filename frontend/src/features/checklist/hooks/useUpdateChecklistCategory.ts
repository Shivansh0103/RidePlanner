import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateChecklistCategory } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";
import type { UpdateCategoryRequest } from "../schemas/categorySchema";

export function useUpdateChecklistCategory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      request,
    }: {
      categoryId: string;
      request: UpdateCategoryRequest;
    }) => updateChecklistCategory(tripId, categoryId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      toast.success("Category updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to update category.";
      toast.error(message);
    },
  });
}
