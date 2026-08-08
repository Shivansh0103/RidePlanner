using Microsoft.EntityFrameworkCore;
using RidePlanner.Api.Middleware;
using RidePlanner.Application;
using RidePlanner.Infrastructure;
using RidePlanner.Infrastructure.Persistence;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddApplication();

builder.Services.AddOpenApi();

builder.Services.AddInfrastructure(
    builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<RidePlannerDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    app.MapOpenApi();

    app.MapScalarApiReference();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();