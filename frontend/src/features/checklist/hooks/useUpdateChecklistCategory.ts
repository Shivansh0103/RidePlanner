import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateChecklistCategory } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";
import type { UpdateCategoryRequest } from "../schemas/categorySchema";

interface UpdateCategoryParams {
  categoryId: string;
  request: UpdateCategoryRequest;
}

export function useUpdateChecklistCategory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, request }: UpdateCategoryParams) =>
      updateChecklistCategory(tripId, categoryId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      toast.success("Category updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category.");
    },
  });
}
