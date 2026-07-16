using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Trips.DTOs;
using RidePlanner.Application.Trips.Mappings;
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

        return Created(string.Empty, trip.ToResponse());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TripResponse>> GetTrip(Guid id)
    {
        var trip = await _dbContext.Trips.FindAsync(id);

        if (trip == null)
            return NotFound();

        return Ok(trip.ToResponse());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripResponse>>> GetTrips()
    {
        var trips = await _dbContext.Trips.ToListAsync();

        IEnumerable<TripResponse> response = trips.Select(trip => trip.ToResponse());

        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TripResponse>> UpdateTrip(
    Guid id,
    UpdateTripRequest request)
    {
        var trip = await _dbContext.Trips.FindAsync(id);

        if (trip == null)
            return NotFound();

        trip.Update(request.Name,
                    request.Description,
                    request.StartDate,
                    request.EndDate);

        await _dbContext.SaveChangesAsync();

        return Ok(trip.ToResponse());
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteTrip(
    Guid id)
    {
        var trip = await _dbContext.Trips.FindAsync(id);

        if (trip == null)
            return NotFound();

        _dbContext.Trips.Remove(trip);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}