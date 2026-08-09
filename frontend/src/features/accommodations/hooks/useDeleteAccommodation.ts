import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accommodationKeys } from "../api/accommodationKeys";
import { accommodationsApi } from "../api/accommodationsApi";

export function useDeleteAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accommodationsApi.deleteAccommodation(tripId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accommodationKeys.all(tripId) });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "stops"] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "budget"] });
      toast.success("Accommodation stay removed.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete accommodation stay.");
    },
  });
}
