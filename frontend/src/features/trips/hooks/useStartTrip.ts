import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as tripApi from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";

export function useStartTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, actualStart }: { id: string; actualStart?: string }) =>
      tripApi.startTrip(id, actualStart),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: tripKeys.detail(data.id),
      });

      toast.success("Trip started! Have a safe journey.");
    },
    onError: () => {
      toast.error("Failed to start trip.");
    },
  });
}
