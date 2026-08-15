import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as contactApi from "../api/contactApi";
import { contactKeys } from "../api/contactKeys";
import type { UpdateContactRequest } from "../schemas/contactSchema";

export function useUpdateEmergencyContact(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateContactRequest }) =>
      contactApi.updateEmergencyContact(tripId, id, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.tripContacts(tripId),
      });
      toast.success("Emergency contact updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update emergency contact.");
    },
  });
}
