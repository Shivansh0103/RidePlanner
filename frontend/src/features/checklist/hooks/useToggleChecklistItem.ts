import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleChecklistItem } from "../api/checklistApi";
import { checklistKeys } from "../api/checklistKeys";
import type { ChecklistSummary } from "../types/checklist";

export function useToggleChecklistItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      isCompleted,
    }: {
      itemId: string;
      isCompleted?: boolean;
    }) => toggleChecklistItem(tripId, itemId, isCompleted),
    onMutate: async ({ itemId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: checklistKeys.detail(tripId) });
      const previousChecklist = queryClient.getQueryData<ChecklistSummary>(
        checklistKeys.detail(tripId)
      );

      if (previousChecklist) {
        const updatedCategories = previousChecklist.categories.map((category) => {
          const updatedItems = category.items.map((item) => {
            if (item.id === itemId) {
              const nextCompletedState =
                isCompleted !== undefined ? isCompleted : !item.isCompleted;
              return { ...item, isCompleted: nextCompletedState };
            }
            return item;
          });

          const totalItemsCount = updatedItems.length;
          const completedItemsCount = updatedItems.filter((i) => i.isCompleted).length;

          return {
            ...category,
            totalItemsCount,
            completedItemsCount,
            items: updatedItems,
          };
        });

        const totalItemsCount = updatedCategories.reduce(
          (acc, cat) => acc + cat.totalItemsCount,
          0
        );
        const completedItemsCount = updatedCategories.reduce(
          (acc, cat) => acc + cat.completedItemsCount,
          0
        );
        const completionPercentage =
          totalItemsCount > 0
            ? Math.round((completedItemsCount / totalItemsCount) * 100 * 10) / 10
            : 0;

        queryClient.setQueryData<ChecklistSummary>(checklistKeys.detail(tripId), {
          ...previousChecklist,
          totalItemsCount,
          completedItemsCount,
          completionPercentage,
          categories: updatedCategories,
        });
      }

      return { previousChecklist };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousChecklist) {
        queryClient.setQueryData(
          checklistKeys.detail(tripId),
          context.previousChecklist
        );
      }
      const message =
        error?.response?.data?.Error || "Failed to update item state.";
      toast.error(message);
    },
    onSettled: (data) => {
      if (data) {
        queryClient.setQueryData(checklistKeys.detail(tripId), data);
      } else {
        queryClient.invalidateQueries({ queryKey: checklistKeys.detail(tripId) });
      }
    },
  });
}
