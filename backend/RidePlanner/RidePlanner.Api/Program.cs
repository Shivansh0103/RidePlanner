using Microsoft.EntityFrameworkCore;
using RidePlanner.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddInfrastructure(
    builder.Configuration);

var app = builder.Build();