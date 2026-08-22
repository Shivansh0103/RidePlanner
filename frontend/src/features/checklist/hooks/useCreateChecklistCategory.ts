import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

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
      queryClient.invalidateQueries({ queryKey: readinessKeys.tripReadiness(tripId) });
      toast.success("Category added successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add category.");
    },
  });
}
