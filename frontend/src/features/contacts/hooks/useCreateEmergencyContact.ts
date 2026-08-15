import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as contactApi from "../api/contactApi";
import { contactKeys } from "../api/contactKeys";
import type { CreateContactRequest } from "../schemas/contactSchema";

export function useCreateEmergencyContact(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateContactRequest) =>
      contactApi.createEmergencyContact(tripId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.tripContacts(tripId),
      });
      toast.success("Emergency contact added successfully.");
    },
    onError: () => {
      toast.error("Failed to add emergency contact.");
    },
  });
}
