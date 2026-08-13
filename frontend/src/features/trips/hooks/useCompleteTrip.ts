import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as tripApi from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";

export function useCompleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, actualCompletion }: { id: string; actualCompletion?: string }) =>
      tripApi.completeTrip(id, actualCompletion),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: tripKeys.detail(data.id),
      });

      toast.success("Trip marked as completed! Congratulations.");
    },
    onError: () => {
      toast.error("Failed to complete trip.");
    },
  });
}
