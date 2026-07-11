using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Trips.DTOs;
using RidePlanner.Infrastructure.Persistence;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly RidePlannerDbContext _dbContext;
    public TripsController(RidePlannerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<ActionResult<TripResponse>> CreateTrip(
    CreateTripRequest request)
    {
        var trip = Trip.Create(
                    request.Name,
                    request.Description,
                    request.StartDate,
                    request.EndDate);

        _dbContext.Trips.Add(trip);

        await _dbContext.SaveChangesAsync();

        var response = new TripResponse(
                    trip.Id,
                    trip.Name,
                    trip.Description,
                    trip.StartDate,
                    trip.EndDate,
                    trip.CreatedAt,
                    trip.UpdatedAt);

        return Created(string.Empty, response);
    }

}