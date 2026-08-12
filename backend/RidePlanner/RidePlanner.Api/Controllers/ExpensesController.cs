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
    private readonly GetTripExpensesQueryHandler _getTripExpensesHandler;
    private readonly CreateExpenseCommandHandler _createExpenseHandler;
    private readonly UpdateExpenseCommandHandler _updateExpenseHandler;
    private readonly DeleteExpenseCommandHandler _deleteExpenseHandler;

    public ExpensesController(
        GetTripExpensesQueryHandler getTripExpensesHandler,
        CreateExpenseCommandHandler createExpenseHandler,
        UpdateExpenseCommandHandler updateExpenseHandler,
        DeleteExpenseCommandHandler deleteExpenseHandler)
    {
        _getTripExpensesHandler = getTripExpensesHandler;
        _createExpenseHandler = createExpenseHandler;
        _updateExpenseHandler = updateExpenseHandler;
        _deleteExpenseHandler = deleteExpenseHandler;
    }

    [HttpGet]
    public async Task<IActionResult> GetExpenses(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var expenses = await _getTripExpensesHandler.Handle(
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
        var result = await _createExpenseHandler.Handle(
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
        var result = await _updateExpenseHandler.Handle(
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
        var result = await _deleteExpenseHandler.Handle(
            new DeleteExpenseCommand(tripId, expenseId),
            cancellationToken);

        if (result is null || !result.Value)
        {
            return NotFound();
        }

        return Ok();
    }
}
