using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RidePlanner.Application.Exceptions;
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
            if (exception is NotFoundException)
            {
                _logger.LogWarning(exception, "Resource not found: {Message}", exception.Message);
            }
            else if (exception is ValidationException validationException)
            {
                _logger.LogWarning(exception, "Validation failures: {Count}", validationException.Errors.Count);
            }
            else if (exception is DomainException)
            {
                _logger.LogWarning(exception, "Domain validation exception: {Message}", exception.Message);
            }
            else
            {
                _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);
            }

            var statusCode = exception switch
            {
                NotFoundException => StatusCodes.Status404NotFound,
                ValidationException => StatusCodes.Status400BadRequest,
                DomainException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            var title = exception switch
            {
                NotFoundException => "Not Found",
                ValidationException => "One or more validation errors occurred.",
                DomainException => "Bad Request",
                _ => "Internal Server Error"
            };

            var detail = exception switch
            {
                NotFoundException => exception.Message,
                ValidationException => exception.Message,
                DomainException => exception.Message,
                _ => "An unexpected error occurred."
            };

            var type = statusCode switch
            {
                StatusCodes.Status404NotFound => "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                StatusCodes.Status400BadRequest => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                _ => "https://tools.ietf.org/html/rfc7231#section-6.6.1"
            };

            ProblemDetails problemDetails;

            if (exception is ValidationException valEx)
            {
                var valProblemDetails = new HttpValidationProblemDetails(valEx.Errors)
                {
                    Status = statusCode,
                    Title = title,
                    Detail = detail,
                    Type = type,
                    Instance = context.Request.Path
                };
                problemDetails = valProblemDetails;
            }
            else
            {
                problemDetails = new ProblemDetails
                {
                    Status = statusCode,
                    Title = title,
                    Detail = detail,
                    Type = type,
                    Instance = context.Request.Path
                };
            }

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}