import AnalyticsIcon from "@mui/icons-material/Analytics";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import ErrorState from "@/shared/ui/ErrorState";

import { useCalculateFuelEstimate } from "../hooks/useCalculateFuelEstimate";
import { useCreateBudgetEstimate } from "../hooks/useCreateBudgetEstimate";
import { useCreateExpense } from "../hooks/useCreateExpense";
import { useDeleteBudgetEstimate } from "../hooks/useDeleteBudgetEstimate";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useTripBudget } from "../hooks/useTripBudget";
import { useUpdateBudgetEstimate } from "../hooks/useUpdateBudgetEstimate";
import { useUpdateExpense } from "../hooks/useUpdateExpense";
import { useUpdateTripBudget } from "../hooks/useUpdateTripBudget";
import type { CreateEstimateRequest } from "../schemas/createEstimateSchema";
import type { ExpenseFormValues } from "../schemas/expenseSchemas";
import type { FuelCalculatorRequest } from "../schemas/fuelCalculatorSchema";
import type { UpdateBudgetRequest } from "../schemas/updateBudgetSchema";
import type { UpdateEstimateRequest } from "../schemas/updateEstimateSchema";
import type { BudgetCategoryType, BudgetEstimate, Expense } from "../types/budget";
import BudgetSkeleton from "./BudgetSkeleton";
import BudgetSummaryCards from "./BudgetSummaryCards";
import BudgetVsActualBreakdown from "./BudgetVsActualBreakdown";
import CategoryBreakdown from "./CategoryBreakdown";
import CreateEstimateDialog from "./CreateEstimateDialog";
import DeleteEstimateDialog from "./DeleteEstimateDialog";
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import EditBudgetDialog from "./EditBudgetDialog";
import EditEstimateDialog from "./EditEstimateDialog";
import ExpenseLogTable from "./ExpenseLogTable";
import FuelCalculatorDialog from "./FuelCalculatorDialog";
import LogExpenseDialog from "./LogExpenseDialog";

interface BudgetSectionProps {
  tripId: string;
  routeDistanceKm?: number;
}

type BudgetSubTab = "analysis" | "estimates" | "expenses";

export default function BudgetSection({
  tripId,
  routeDistanceKm = 0,
}: BudgetSectionProps) {
  const { data: budget, isLoading, isError } = useTripBudget(tripId);

  // Sub-tab view state
  const [activeTab, setActiveTab] = useState<BudgetSubTab>("analysis");

  // Budget mutations
  const updateBudgetMutation = useUpdateTripBudget(tripId);
  const createEstimateMutation = useCreateBudgetEstimate(tripId);
  const updateEstimateMutation = useUpdateBudgetEstimate(tripId);
  const deleteEstimateMutation = useDeleteBudgetEstimate(tripId);
  const calculateFuelMutation = useCalculateFuelEstimate(tripId);

  // Expense mutations
  const createExpenseMutation = useCreateExpense(tripId);
  const updateExpenseMutation = useUpdateExpense(tripId);
  const deleteExpenseMutation = useDeleteExpense(tripId);

  // Budget Dialog states
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

  // Expense Dialog states
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [logExpenseCategory, setLogExpenseCategory] =
    useState<BudgetCategoryType>("Fuel");

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  if (isLoading) {
    return <BudgetSkeleton />;
  }

  if (isError || !budget) {
    return <ErrorState message="Unable to load trip budget." />;
  }

  // Extract all expenses across categories
  const allExpenses: Expense[] = budget.categories
    ? budget.categories.flatMap((cat) => cat.expenses || [])
    : [];

  // Handlers for Estimates
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

  // Handlers for Expenses
  const handleOpenAddExpense = (categoryType: BudgetCategoryType = "Fuel") => {
    setLogExpenseCategory(categoryType);
    setEditingExpense(null);
    setIsLogExpenseOpen(true);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsLogExpenseOpen(true);
  };

  const handleOpenDeleteExpense = (expense: Expense) => {
    setDeletingExpense(expense);
    setIsDeleteExpenseOpen(true);
  };

  // Form Submissions
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

  const handleSaveExpense = async (data: ExpenseFormValues) => {
    if (editingExpense) {
      await updateExpenseMutation.mutateAsync({
        expenseId: editingExpense.id,
        request: data,
      });
    } else {
      await createExpenseMutation.mutateAsync(data);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpenseMutation.mutateAsync(expenseId);
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Summary Cards */}
      <BudgetSummaryCards
        targetBudget={budget.targetBudget}
        estimatedCost={budget.estimatedCost}
        actualCost={budget.actualCost}
        remainingTargetBuffer={budget.remainingTargetBuffer}
        onEditBudget={() => setIsEditBudgetOpen(true)}
        onCalculateFuel={() => setIsFuelCalculatorOpen(true)}
      />

      {/* View Switcher Sub-tabs */}
      <Paper variant="outlined" sx={{ borderRadius: 2, mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            icon={<AnalyticsIcon />}
            iconPosition="start"
            label="Budget vs Actual Analysis"
            value="analysis"
            sx={{ fontWeight: 700 }}
          />
          <Tab
            icon={<FormatListBulletedIcon />}
            iconPosition="start"
            label="Planned Estimates"
            value="estimates"
            sx={{ fontWeight: 700 }}
          />
          <Tab
            icon={<ReceiptLongIcon />}
            iconPosition="start"
            label={`Expense Log (${allExpenses.length})`}
            value="expenses"
            sx={{ fontWeight: 700 }}
          />
        </Tabs>
      </Paper>

      {/* Tab 1: Budget vs Actual Analysis */}
      {activeTab === "analysis" && (
        <BudgetVsActualBreakdown categories={budget.categories} />
      )}

      {/* Tab 2: Planned Estimates */}
      {activeTab === "estimates" && (
        <CategoryBreakdown
          categories={budget.categories}
          onAddEstimate={handleOpenAddEstimate}
          onEditEstimate={handleOpenEditEstimate}
          onDeleteEstimate={handleOpenDeleteEstimate}
        />
      )}

      {/* Tab 3: Actual Expense Log */}
      {activeTab === "expenses" && (
        <ExpenseLogTable
          expenses={allExpenses}
          onAddExpense={() => handleOpenAddExpense("Fuel")}
          onEditExpense={handleOpenEditExpense}
          onDeleteExpense={handleOpenDeleteExpense}
        />
      )}

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

      {/* Expense Modals */}
      <LogExpenseDialog
        open={isLogExpenseOpen}
        expense={editingExpense}
        defaultCategory={logExpenseCategory}
        onClose={() => {
          setIsLogExpenseOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSaveExpense}
        isLoading={
          createExpenseMutation.isPending || updateExpenseMutation.isPending
        }
      />

      <DeleteExpenseDialog
        open={isDeleteExpenseOpen}
        expense={deletingExpense}
        onClose={() => {
          setIsDeleteExpenseOpen(false);
          setDeletingExpense(null);
        }}
        onConfirm={handleDeleteExpense}
        isLoading={deleteExpenseMutation.isPending}
      />
    </Box>
  );
}
