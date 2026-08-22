import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as tripApi from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tripApi.deleteTrip(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });

      toast.success("Trip deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete trip.");
    },
  });
}