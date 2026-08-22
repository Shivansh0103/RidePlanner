import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import * as contactApi from "../api/contactApi";
import { contactKeys } from "../api/contactKeys";

export function useDeleteEmergencyContact(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactApi.deleteEmergencyContact(tripId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.tripContacts(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: readinessKeys.tripReadiness(tripId),
      });
      toast.success("Emergency contact deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete emergency contact.");
    },
  });
}
