import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as tripApi from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tripApi.createTrip,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });

      toast.success("Trip created successfully.");
    },
  });
}