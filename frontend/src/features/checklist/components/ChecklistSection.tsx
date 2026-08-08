import AddIcon from "@mui/icons-material/Add";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import ErrorState from "@/shared/ui/ErrorState";

import { useCreateChecklistCategory } from "../hooks/useCreateChecklistCategory";
import { useCreateChecklistItem } from "../hooks/useCreateChecklistItem";
import { useDeleteChecklistCategory } from "../hooks/useDeleteChecklistCategory";
import { useDeleteChecklistItem } from "../hooks/useDeleteChecklistItem";
import { useToggleChecklistItem } from "../hooks/useToggleChecklistItem";
import { useTripChecklist } from "../hooks/useTripChecklist";
import { useUpdateChecklistCategory } from "../hooks/useUpdateChecklistCategory";
import { useUpdateChecklistItem } from "../hooks/useUpdateChecklistItem";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "../schemas/categorySchema";
import type { CreateItemRequest, UpdateItemRequest } from "../schemas/itemSchema";
import type { ChecklistCategory, ChecklistItem } from "../types/checklist";
import AddCategoryDialog from "./AddCategoryDialog";
import AddItemDialog from "./AddItemDialog";
import ChecklistCategoryCard from "./ChecklistCategoryCard";
import ChecklistOverview from "./ChecklistOverview";
import ChecklistSkeleton from "./ChecklistSkeleton";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import EditItemDialog from "./EditItemDialog";

interface ChecklistSectionProps {
  tripId: string;
}

export default function ChecklistSection({ tripId }: ChecklistSectionProps) {
  const { data: checklist, isLoading, isError } = useTripChecklist(tripId);

  const createCategoryMutation = useCreateChecklistCategory(tripId);
  const updateCategoryMutation = useUpdateChecklistCategory(tripId);
  const deleteCategoryMutation = useDeleteChecklistCategory(tripId);

  const createItemMutation = useCreateChecklistItem(tripId);
  const updateItemMutation = useUpdateChecklistItem(tripId);
  const toggleItemMutation = useToggleChecklistItem(tripId);
  const deleteItemMutation = useDeleteChecklistItem(tripId);

  // Dialog State
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ChecklistCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ChecklistCategory | null>(null);

  const [addItemCategoryId, setAddItemCategoryId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ChecklistItem | null>(null);

  if (isLoading) {
    return <ChecklistSkeleton />;
  }

  if (isError || !checklist) {
    return <ErrorState message="Failed to load preparation checklist." />;
  }

  // Handlers
  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    await createCategoryMutation.mutateAsync(data);
  };

  const handleUpdateCategory = async (categoryId: string, data: UpdateCategoryRequest) => {
    await updateCategoryMutation.mutateAsync({ categoryId, request: data });
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    await deleteCategoryMutation.mutateAsync(deletingCategory.id);
  };

  const handleCreateItem = async (data: CreateItemRequest) => {
    await createItemMutation.mutateAsync(data);
  };

  const handleUpdateItem = async (itemId: string, data: UpdateItemRequest) => {
    await updateItemMutation.mutateAsync({ itemId, request: data });
  };

  const handleToggleItem = (itemId: string, isCompleted: boolean) => {
    toggleItemMutation.mutate({ itemId, isCompleted });
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    await deleteItemMutation.mutateAsync(deletingItem.id);
  };

  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Trip Preparation Checklist
        </Typography>

        <ChecklistOverview
          completedItemsCount={checklist.completedItemsCount}
          totalItemsCount={checklist.totalItemsCount}
          completionPercentage={checklist.completionPercentage}
          onAddCategory={() => setIsAddCategoryOpen(true)}
        />

        {checklist.categories.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.02)"
                  : "rgba(0, 0, 0, 0.01)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <PlaylistAddCheckIcon sx={{ fontSize: 48, color: "text.secondary" }} />
              <Typography variant="h6" color="text.secondary">
                No categories found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                Get started by creating your first checklist category (e.g. Packing, Vehicle, Documents).
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddCategoryOpen(true)}
              >
                Add First Category
              </Button>
            </Box>
          </Paper>
        ) : (
          <Stack spacing={2.5}>
            {checklist.categories.map((category) => (
              <ChecklistCategoryCard
                key={category.id}
                category={category}
                onToggleItem={handleToggleItem}
                onAddItem={(catId) => setAddItemCategoryId(catId)}
                onEditItem={(item) => setEditingItem(item)}
                onDeleteItem={(item) => setDeletingItem(item)}
                onEditCategory={(cat) => setEditingCategory(cat)}
                onDeleteCategory={(cat) => setDeletingCategory(cat)}
              />
            ))}
          </Stack>
        )}
      </Stack>

      {/* Dialogs */}
      <AddCategoryDialog
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleCreateCategory}
        isLoading={createCategoryMutation.isPending}
      />

      <EditCategoryDialog
        open={Boolean(editingCategory)}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleUpdateCategory}
        isLoading={updateCategoryMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingCategory)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? All items in this category will also be deleted.`}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        isLoading={deleteCategoryMutation.isPending}
      />

      <AddItemDialog
        open={Boolean(addItemCategoryId)}
        categories={checklist.categories}
        defaultCategoryId={addItemCategoryId}
        onClose={() => setAddItemCategoryId(null)}
        onSubmit={handleCreateItem}
        isLoading={createItemMutation.isPending}
      />

      <EditItemDialog
        open={Boolean(editingItem)}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleUpdateItem}
        isLoading={updateItemMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingItem)}
        title="Delete Item"
        description={`Are you sure you want to delete "${deletingItem?.title}"?`}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteItem}
        isLoading={deleteItemMutation.isPending}
      />
    </Box>
  );
}
