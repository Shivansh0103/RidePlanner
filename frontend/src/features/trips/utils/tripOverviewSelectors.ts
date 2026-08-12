import type { TripBudget } from "@/features/budget/types/budget";
import type { ChecklistItem, ChecklistSummary } from "@/features/checklist/types/checklist";
import type { TripStop } from "@/features/tripStops/types/tripStop";

import type { Trip } from "../types/trip";

export type TripTimeStatus =
  | { type: "Upcoming"; daysUntilStart: number; label: string }
  | { type: "Ongoing"; currentDay: number; totalDays: number; label: string }
  | { type: "Completed"; label: string }
  | { type: "Unscheduled"; label: string };

export type NextStopInfo = {
  stop: TripStop;
  label: string;
  isCompleted: boolean;
};

export type OverviewAlert = {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  message: string;
};

export type PendingChecklistItem = ChecklistItem & {
  categoryName: string;
};

/**
 * Calculates total trip days based on start and end dates.
 */
export function calculateTripDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Computes deterministic trip status based on start and end dates relative to today.
 */
export function calculateTripStatus(startDate?: string, endDate?: string): TripTimeStatus {
  if (!startDate || !endDate) {
    return { type: "Unscheduled", label: "Dates not set" };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { type: "Unscheduled", label: "Invalid dates" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date(end);
  endDay.setHours(23, 59, 59, 999);

  if (today < startDay) {
    const diffMs = startDay.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysUntil === 0) {
      return { type: "Upcoming", daysUntilStart: 0, label: "Starts Today" };
    }
    if (daysUntil === 1) {
      return { type: "Upcoming", daysUntilStart: 1, label: "Starts Tomorrow" };
    }
    return {
      type: "Upcoming",
      daysUntilStart: daysUntil,
      label: `Starts in ${daysUntil} days`,
    };
  }

  if (today >= startDay && today <= endDay) {
    const diffMs = today.getTime() - startDay.getTime();
    const currentDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    const totalMs = endDay.getTime() - startDay.getTime();
    const totalDays = Math.max(1, Math.ceil(totalMs / (1000 * 60 * 60 * 24)));

    return {
      type: "Ongoing",
      currentDay,
      totalDays,
      label: `Day ${currentDay} of ${totalDays}`,
    };
  }

  return { type: "Completed", label: "Trip Completed" };
}

/**
 * Deterministically finds the relevant Next Stop depending on trip state:
 * - Upcoming: Returns the 1st stop (origin / departure point)
 * - Ongoing: Returns current active stop or upcoming stop based on arrival/departure date
 * - Completed: Returns final stop
 */
export function determineNextStop(
  stops: TripStop[] = [],
  startDate?: string,
  endDate?: string
): NextStopInfo | null {
  if (stops.length === 0) return null;

  const sortedStops = [...stops].sort((a, b) => a.displayOrder - b.displayOrder);
  const status = calculateTripStatus(startDate, endDate);

  if (status.type === "Completed") {
    const lastStop = sortedStops[sortedStops.length - 1];
    return {
      stop: lastStop,
      label: "Final Destination",
      isCompleted: true,
    };
  }

  if (status.type === "Upcoming") {
    return {
      stop: sortedStops[0],
      label: sortedStops.length > 1 ? "First Stop (Origin)" : "Destination",
      isCompleted: false,
    };
  }

  // Ongoing or Unscheduled: Find next upcoming stop by date or first incomplete
  const now = new Date();

  for (const stop of sortedStops) {
    if (stop.arrivalDate) {
      const arr = new Date(stop.arrivalDate);
      if (!isNaN(arr.getTime()) && arr >= now) {
        return {
          stop,
          label: "Next Upcoming Stop",
          isCompleted: false,
        };
      }
    }
  }

  // Default to first destination stop if multi-stop, or 2nd stop if origin exists
  const targetStop = sortedStops.length > 1 ? sortedStops[1] : sortedStops[0];
  return {
    stop: targetStop,
    label: "Next Stop",
    isCompleted: false,
  };
}

/**
 * Computes budget metrics and health indicators.
 */
export function calculateBudgetMetrics(budget?: TripBudget | null) {
  if (!budget) {
    return {
      targetBudget: 0,
      estimatedCost: 0,
      actualCost: 0,
      remainingBuffer: 0,
      remainingTargetBuffer: 0,
      utilizationPercentage: 0,
      isOverBudget: false,
      topCategory: null as { name: string; amount: number } | null,
    };
  }

  const {
    targetBudget,
    estimatedCost,
    actualCost = 0,
    remainingBuffer = 0,
    remainingTargetBuffer = 0,
    categories = [],
  } = budget;

  const utilizationPercentage =
    targetBudget > 0
      ? Math.min(100, Math.round((actualCost / targetBudget) * 100))
      : 0;

  const isOverBudget = remainingTargetBuffer < 0;

  let topCategory: { name: string; amount: number } | null = null;
  for (const cat of categories) {
    const amountToUse = (cat.actualAmount ?? 0) > 0 ? cat.actualAmount : cat.estimatedAmount;
    if (amountToUse > 0 && (!topCategory || amountToUse > topCategory.amount)) {
      topCategory = { name: cat.category, amount: amountToUse };
    }
  }

  return {
    targetBudget,
    estimatedCost,
    actualCost,
    remainingBuffer,
    remainingTargetBuffer,
    utilizationPercentage,
    isOverBudget,
    topCategory,
  };
}

/**
 * Computes transparent planning progress percentages.
 */
export function calculatePlanningProgress(
  stops: TripStop[] = [],
  budget?: TripBudget | null,
  checklist?: ChecklistSummary | null
) {
  const checklistPercentage = checklist?.completionPercentage ?? 0;

  const budgetPercentage =
    budget && budget.targetBudget > 0
      ? Math.min(100, Math.round((budget.estimatedCost / budget.targetBudget) * 100))
      : 0;

  const validStopsCount = stops.filter(
    (s) => s.latitude !== null && s.longitude !== null
  ).length;

  let itineraryPercentage = 0;
  if (validStopsCount >= 2) {
    itineraryPercentage = 100;
  } else if (validStopsCount === 1) {
    itineraryPercentage = 50;
  }

  return {
    checklistPercentage,
    budgetPercentage,
    itineraryPercentage,
    validStopsCount,
  };
}

/**
 * Extracts top pending checklist items (up to `limit`).
 */
export function getTopPendingChecklistItems(
  checklist?: ChecklistSummary | null,
  limit = 3
): PendingChecklistItem[] {
  if (!checklist || !checklist.categories) return [];

  const pending: PendingChecklistItem[] = [];

  for (const category of checklist.categories) {
    for (const item of category.items) {
      if (!item.isCompleted) {
        pending.push({
          ...item,
          categoryName: category.name,
        });
        if (pending.length >= limit) return pending;
      }
    }
  }

  return pending;
}

/**
 * Generates conservative smart alerts based on empirical risk conditions.
 */
export function deriveTripAlerts(
  trip?: Trip | null,
  stops: TripStop[] = [],
  budget?: TripBudget | null,
  checklist?: ChecklistSummary | null
): OverviewAlert[] {
  const alerts: OverviewAlert[] = [];

  // 1. Over budget alert
  if (budget && budget.remainingBuffer < 0) {
    const overAmount = Math.abs(budget.remainingBuffer);
    alerts.push({
      id: "alert-over-budget",
      severity: "error",
      title: "Target Budget Exceeded",
      message: `Total estimated cost exceeds your target budget by ₹${overAmount.toLocaleString("en-IN")}.`,
    });
  }

  // 2. Incomplete checklist near departure
  if (trip && checklist) {
    const status = calculateTripStatus(trip.startDate, trip.endDate);
    const incompleteCount = checklist.totalItemsCount - checklist.completedItemsCount;

    if (
      status.type === "Upcoming" &&
      status.daysUntilStart <= 7 &&
      incompleteCount > 0
    ) {
      alerts.push({
        id: "alert-incomplete-checklist",
        severity: "warning",
        title: "Unfinished Preparation Checklist",
        message: `You have ${incompleteCount} pending task(s) with departure ${status.daysUntilStart === 0 ? "today" : `in ${status.daysUntilStart} day(s)`}.`,
      });
    }
  }

  // 3. Attention-worthy itinerary alert (no stops or only 1 stop)
  if (stops.length < 2) {
    alerts.push({
      id: "alert-itinerary-incomplete",
      severity: "info",
      title: "Incomplete Itinerary",
      message:
        stops.length === 0
          ? "No stops added yet. Add stops to calculate your route and travel metrics."
          : "Only 1 stop added. Add at least one more stop to generate your route.",
    });
  }

  return alerts;
}
