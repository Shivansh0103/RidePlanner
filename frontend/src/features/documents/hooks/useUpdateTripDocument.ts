import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as documentApi from "../api/documentApi";
import { documentKeys } from "../api/documentKeys";
import type { UpdateDocumentRequest } from "../schemas/documentSchema";

export function useUpdateTripDocument(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateDocumentRequest }) =>
      documentApi.updateTripDocument(tripId, id, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.tripDocuments(tripId),
      });
      toast.success("Document updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update document.");
    },
  });
}
