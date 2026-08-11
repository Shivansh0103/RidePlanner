import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { budgetKeys } from "@/features/budget/api/budgetKeys";
import { tripStopKeys } from "@/features/tripStops/api/tripStopKeys";

import { accommodationKeys } from "../api/accommodationKeys";
import { accommodationsApi } from "../api/accommodationsApi";

export function useDeleteAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accommodationsApi.deleteAccommodation(tripId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accommodationKeys.all(tripId) });
      queryClient.invalidateQueries({ queryKey: tripStopKeys.all(tripId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      toast.success("Accommodation stay removed.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete accommodation stay.");
    },
  });
}
