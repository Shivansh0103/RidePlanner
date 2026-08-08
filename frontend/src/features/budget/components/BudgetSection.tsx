import { Box } from "@mui/material";
import { useState } from "react";

import ErrorState from "@/shared/ui/ErrorState";

import { useCalculateFuelEstimate } from "../hooks/useCalculateFuelEstimate";
import { useCreateBudgetEstimate } from "../hooks/useCreateBudgetEstimate";
import { useDeleteBudgetEstimate } from "../hooks/useDeleteBudgetEstimate";
import { useTripBudget } from "../hooks/useTripBudget";
import { useUpdateBudgetEstimate } from "../hooks/useUpdateBudgetEstimate";
import { useUpdateTripBudget } from "../hooks/useUpdateTripBudget";
import type { CreateEstimateRequest } from "../schemas/createEstimateSchema";
import type { FuelCalculatorRequest } from "../schemas/fuelCalculatorSchema";
import type { UpdateBudgetRequest } from "../schemas/updateBudgetSchema";
import type { UpdateEstimateRequest } from "../schemas/updateEstimateSchema";
import type { BudgetCategoryType, BudgetEstimate } from "../types/budget";
import BudgetSkeleton from "./BudgetSkeleton";
import BudgetSummaryCards from "./BudgetSummaryCards";
import CategoryBreakdown from "./CategoryBreakdown";
import CreateEstimateDialog from "./CreateEstimateDialog";
import DeleteEstimateDialog from "./DeleteEstimateDialog";
import EditBudgetDialog from "./EditBudgetDialog";
import EditEstimateDialog from "./EditEstimateDialog";
import FuelCalculatorDialog from "./FuelCalculatorDialog";

interface BudgetSectionProps {
  tripId: string;
  routeDistanceKm?: number;
}

export default function BudgetSection({
  tripId,
  routeDistanceKm = 0,
}: BudgetSectionProps) {
  const { data: budget, isLoading, isError } = useTripBudget(tripId);

  const updateBudgetMutation = useUpdateTripBudget(tripId);
  const createEstimateMutation = useCreateBudgetEstimate(tripId);
  const updateEstimateMutation = useUpdateBudgetEstimate(tripId);
  const deleteEstimateMutation = useDeleteBudgetEstimate(tripId);
  const calculateFuelMutation = useCalculateFuelEstimate(tripId);

  // Dialog states
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);

  const [isCreateEstimateOpen, setIsCreateEstimateOpen] = useState(false);
  const [createEstimateCategory, setCreateEstimateCategory] =
    useState<BudgetCategoryType>("Fuel");

  const [isEditEstimateOpen, setIsEditEstimateOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] =
    useState<BudgetEstimate | null>(null);

  const [isDeleteEstimateOpen, setIsDeleteEstimateOpen] = useState(false);
  const [deletingEstimate, setDeletingEstimate] =
    useState<BudgetEstimate | null>(null);

  const [isFuelCalculatorOpen, setIsFuelCalculatorOpen] = useState(false);

  if (isLoading) {
    return <BudgetSkeleton />;
  }

  if (isError || !budget) {
    return <ErrorState message="Unable to load trip budget." />;
  }

  // Handlers raised by presentation components
  const handleOpenAddEstimate = (categoryType: BudgetCategoryType) => {
    setCreateEstimateCategory(categoryType);
    setIsCreateEstimateOpen(true);
  };

  const handleOpenEditEstimate = (estimate: BudgetEstimate) => {
    setEditingEstimate(estimate);
    setIsEditEstimateOpen(true);
  };

  const handleOpenDeleteEstimate = (estimate: BudgetEstimate) => {
    setDeletingEstimate(estimate);
    setIsDeleteEstimateOpen(true);
  };

  // Form Submission handlers
  const handleUpdateBudget = async (data: UpdateBudgetRequest) => {
    await updateBudgetMutation.mutateAsync(data);
  };

  const handleCreateEstimate = async (data: CreateEstimateRequest) => {
    await createEstimateMutation.mutateAsync(data);
  };

  const handleUpdateEstimate = async (
    estimateId: string,
    data: UpdateEstimateRequest
  ) => {
    await updateEstimateMutation.mutateAsync({ estimateId, request: data });
  };

  const handleDeleteEstimate = async (estimateId: string) => {
    await deleteEstimateMutation.mutateAsync(estimateId);
  };

  const handleCalculateFuel = async (data: FuelCalculatorRequest) => {
    await calculateFuelMutation.mutateAsync(data);
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Summary Cards */}
      <BudgetSummaryCards
        targetBudget={budget.targetBudget}
        estimatedCost={budget.estimatedCost}
        remainingBuffer={budget.remainingBuffer}
        onEditBudget={() => setIsEditBudgetOpen(true)}
        onCalculateFuel={() => setIsFuelCalculatorOpen(true)}
      />

      {/* Category Breakdown */}
      <CategoryBreakdown
        categories={budget.categories}
        onAddEstimate={handleOpenAddEstimate}
        onEditEstimate={handleOpenEditEstimate}
        onDeleteEstimate={handleOpenDeleteEstimate}
      />

      {/* Modals owned by BudgetSection */}
      <EditBudgetDialog
        open={isEditBudgetOpen}
        initialTargetBudget={budget.targetBudget}
        onClose={() => setIsEditBudgetOpen(false)}
        onSubmit={handleUpdateBudget}
        isLoading={updateBudgetMutation.isPending}
      />

      <CreateEstimateDialog
        open={isCreateEstimateOpen}
        defaultCategory={createEstimateCategory}
        onClose={() => setIsCreateEstimateOpen(false)}
        onSubmit={handleCreateEstimate}
        isLoading={createEstimateMutation.isPending}
      />

      <EditEstimateDialog
        open={isEditEstimateOpen}
        estimate={editingEstimate}
        onClose={() => {
          setIsEditEstimateOpen(false);
          setEditingEstimate(null);
        }}
        onSubmit={handleUpdateEstimate}
        isLoading={updateEstimateMutation.isPending}
      />

      <DeleteEstimateDialog
        open={isDeleteEstimateOpen}
        estimate={deletingEstimate}
        onClose={() => {
          setIsDeleteEstimateOpen(false);
          setDeletingEstimate(null);
        }}
        onConfirm={handleDeleteEstimate}
        isLoading={deleteEstimateMutation.isPending}
      />

      <FuelCalculatorDialog
        open={isFuelCalculatorOpen}
        routeDistanceKm={routeDistanceKm}
        onClose={() => setIsFuelCalculatorOpen(false)}
        onSubmit={handleCalculateFuel}
        isLoading={calculateFuelMutation.isPending}
      />
    </Box>
  );
}
