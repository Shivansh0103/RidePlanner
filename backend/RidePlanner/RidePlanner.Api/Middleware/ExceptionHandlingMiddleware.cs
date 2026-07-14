using Microsoft.AspNetCore.Http;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
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