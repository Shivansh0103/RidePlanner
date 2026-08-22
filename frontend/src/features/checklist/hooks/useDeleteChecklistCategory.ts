import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import { deleteChecklistCategory } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";

export function useDeleteChecklistCategory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      deleteChecklistCategory(tripId, categoryId),
    onSuccess: (data) => {
      queryClient.setQueryData(checklistKeys.detail(tripId), data);
      queryClient.invalidateQueries({ queryKey: readinessKeys.tripReadiness(tripId) });
      toast.success("Category deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category.");
    },
  });
}
