import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteTrip } from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrip,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });

      toast.success("Trip deleted successfully.");
    },
  });
}