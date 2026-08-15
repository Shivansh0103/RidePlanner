using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Summary.DTOs;

public sealed class TripSummaryDto
{
    public Guid TripId { get; set; }
    public string TripName { get; set; } = string.Empty;
    public TripStatus Status { get; set; }
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public double TotalDurationDays { get; set; }
    public int TotalStops { get; set; }
    public double TotalDistanceKm { get; set; }
    public decimal TargetBudget { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal BudgetVariance { get; set; }
    public int TotalAccommodations { get; set; }
    public int TotalNights { get; set; }
    public decimal TotalAccommodationCost { get; set; }
    public int TotalChecklistItems { get; set; }
    public int CompletedChecklistItems { get; set; }
    public double ChecklistCompletionPercentage { get; set; }
}
