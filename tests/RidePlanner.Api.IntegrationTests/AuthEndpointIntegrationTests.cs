using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Api.IntegrationTests;

public class AuthEndpointIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthEndpointIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_WithValidCredentials_Returns200Ok_AndUserResponse()
    {
        // Arrange
        var uniqueEmail = $"rider_{Guid.NewGuid():N}@example.com";
        var payload = new RegisterRequest(uniqueEmail, "SecurePassword123!");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", payload);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var registerResponse = await response.Content.ReadFromJsonAsync<RegisterResponse>();
        Assert.NotNull(registerResponse);
        Assert.NotEqual(Guid.Empty, registerResponse.Id);
        Assert.Equal(uniqueEmail, registerResponse.Email);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_Returns409Conflict_ProblemDetails()
    {
        // Arrange
        var duplicateEmail = $"duplicate_{Guid.NewGuid():N}@example.com";
        var payload = new RegisterRequest(duplicateEmail, "SecurePassword123!");

        // First registration
        var firstResponse = await _client.PostAsJsonAsync("/api/auth/register", payload);
        Assert.Equal(HttpStatusCode.OK, firstResponse.StatusCode);

        // Act: Second registration with same email
        var duplicateResponse = await _client.PostAsJsonAsync("/api/auth/register", payload);

        // Assert: 409 Conflict
        Assert.Equal(HttpStatusCode.Conflict, duplicateResponse.StatusCode);
        Assert.Equal("application/problem+json", duplicateResponse.Content.Headers.ContentType?.MediaType);

        var problemDetails = await duplicateResponse.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(409, problemDetails.Status);
        Assert.Equal("Conflict", problemDetails.Title);
    }

    [Fact]
    public async Task Register_WithInvalidEmail_Returns400BadRequest_ValidationProblemDetails()
    {
        // Arrange
        var invalidPayload = new RegisterRequest("not-a-valid-email", "SecurePassword123!");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", invalidPayload);

        // Assert: 400 Bad Request
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(400, problemDetails.Status);
        Assert.True(problemDetails.Errors.ContainsKey("Email"));
    }

    [Fact]
    public async Task Register_WithShortPassword_Returns400BadRequest_ValidationProblemDetails()
    {
        // Arrange
        var invalidPayload = new RegisterRequest("valid_email@example.com", "123");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", invalidPayload);

        // Assert: 400 Bad Request
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(400, problemDetails.Status);
        Assert.True(problemDetails.Errors.ContainsKey("Password"));
    }
}
