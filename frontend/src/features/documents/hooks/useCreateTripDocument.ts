import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { readinessKeys } from "@/features/readiness/api/readinessKeys";

import * as documentApi from "../api/documentApi";
import { documentKeys } from "../api/documentKeys";
import type { CreateDocumentRequest } from "../schemas/documentSchema";

export function useCreateTripDocument(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateDocumentRequest) =>
      documentApi.createTripDocument(tripId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.tripDocuments(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: readinessKeys.tripReadiness(tripId),
      });
      toast.success("Document added successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add document.");
    },
  });
}
