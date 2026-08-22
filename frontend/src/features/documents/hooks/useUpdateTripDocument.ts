import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import * as documentApi from "../api/documentApi";
import { documentKeys } from "../api/documentKeys";
import type { UpdateDocumentRequest } from "../schemas/documentSchema";

interface UpdateTripDocumentParams {
  id: string;
  request: UpdateDocumentRequest;
}

export function useUpdateTripDocument(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: UpdateTripDocumentParams) =>
      documentApi.updateTripDocument(tripId, id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.tripDocuments(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(tripId, variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: readinessKeys.tripReadiness(tripId),
      });
      toast.success("Document updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update document.");
    },
  });
}
