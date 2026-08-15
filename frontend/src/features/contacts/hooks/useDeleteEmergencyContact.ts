import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      toast.success("Emergency contact removed.");
    },
    onError: () => {
      toast.error("Failed to delete contact.");
    },
  });
}
