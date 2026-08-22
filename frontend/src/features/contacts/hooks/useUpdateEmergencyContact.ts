import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import * as contactApi from "../api/contactApi";
import { contactKeys } from "../api/contactKeys";
import type { UpdateContactRequest } from "../schemas/contactSchema";

interface UpdateEmergencyContactParams {
  id: string;
  request: UpdateContactRequest;
}

export function useUpdateEmergencyContact(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: UpdateEmergencyContactParams) =>
      contactApi.updateEmergencyContact(tripId, id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.tripContacts(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(tripId, variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: readinessKeys.tripReadiness(tripId),
      });
      toast.success("Emergency contact updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update emergency contact.");
    },
  });
}
