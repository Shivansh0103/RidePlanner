import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      toast.success("Document deleted.");
    },
    onError: () => {
      toast.error("Failed to delete document.");
    },
  });
}
