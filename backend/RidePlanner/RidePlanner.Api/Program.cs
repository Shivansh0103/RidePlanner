using Microsoft.EntityFrameworkCore;
using RidePlanner.Api.Middleware;
using RidePlanner.Infrastructure;
using RidePlanner.Application;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddApplication();

builder.Services.AddOpenApi();

builder.Services.AddInfrastructure(
    builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();