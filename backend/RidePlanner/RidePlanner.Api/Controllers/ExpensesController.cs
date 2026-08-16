using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Expenses.Commands.CreateExpense;
using RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;
using RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Queries.GetTripExpenses;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/expenses")]
public sealed class ExpensesController : ControllerBase
{
    private readonly ISender _sender;

    public ExpensesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetExpenses(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var expenses = await _sender.Send(
            new GetTripExpensesQuery(tripId),
            cancellationToken);

        if (expenses is null)
        {
            return NotFound();
        }

        return Ok(expenses);
    }

    [HttpPost]
    public async Task<IActionResult> CreateExpense(
        Guid tripId,
        [FromBody] CreateExpenseRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new CreateExpenseCommand(
                tripId,
                request.Category,
                request.Title,
                request.Amount,
                request.ExpenseDate,
                request.PaymentMethod,
                request.Notes,
                request.AccommodationId,
                request.TripStopId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPut("{expenseId:guid}")]
    public async Task<IActionResult> UpdateExpense(
        Guid tripId,
        Guid expenseId,
        [FromBody] UpdateExpenseRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateExpenseCommand(
                tripId,
                expenseId,
                request.Category,
                request.Title,
                request.Amount,
                request.ExpenseDate,
                request.PaymentMethod,
                request.Notes,
                request.AccommodationId,
                request.TripStopId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{expenseId:guid}")]
    public async Task<IActionResult> DeleteExpense(
        Guid tripId,
        Guid expenseId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new DeleteExpenseCommand(tripId, expenseId),
            cancellationToken);

        if (result is null || !result.Value)
        {
            return NotFound();
        }

        return Ok();
    }
}
