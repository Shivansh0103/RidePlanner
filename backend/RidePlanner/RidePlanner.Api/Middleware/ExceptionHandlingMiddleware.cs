using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            if (exception is DomainException)
            {
                _logger.LogWarning(exception, "A domain exception occurred: {Message}", exception.Message);
            }
            else
            {
                _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);
            }

            var statusCode = exception switch
            {
                DomainException => StatusCodes.Status400BadRequest,

                _ => StatusCodes.Status500InternalServerError
            };

            var message = exception switch
            {
                DomainException => exception.Message,

                _ => "An unexpected error occurred."
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                Error = message
            });
        }
    }
}