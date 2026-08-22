import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import * as documentApi from "../api/documentApi";
import { documentKeys } from "../api/documentKeys";

export function useDeleteTripDocument(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentApi.deleteTripDocument(tripId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.tripDocuments(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: readinessKeys.tripReadiness(tripId),
      });
      toast.success("Document deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete document.");
    },
  });
}
