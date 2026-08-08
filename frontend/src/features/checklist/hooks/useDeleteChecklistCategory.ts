import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteChecklistCategory } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";

export function useDeleteChecklistCategory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      deleteChecklistCategory(tripId, categoryId),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      toast.success("Category deleted successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to delete category.";
      toast.error(message);
    },
  });
}
