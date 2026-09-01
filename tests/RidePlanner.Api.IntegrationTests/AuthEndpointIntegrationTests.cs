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

    [Fact]
    public async Task Login_WithValidCredentials_Returns200Ok_AndJwtToken()
    {
        // Arrange: Register user first
        var uniqueEmail = $"login_user_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";
        var registerPayload = new RegisterRequest(uniqueEmail, password);
        var registerRes = await _client.PostAsJsonAsync("/api/auth/register", registerPayload);
        Assert.Equal(HttpStatusCode.OK, registerRes.StatusCode);
        var registerData = await registerRes.Content.ReadFromJsonAsync<RegisterResponse>();
        Assert.NotNull(registerData);

        var loginPayload = new LoginRequest(uniqueEmail, password);

        // Act: Login
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginPayload);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(loginResponse);
        Assert.Equal(registerData.Id, loginResponse.UserId);
        Assert.Equal(uniqueEmail, loginResponse.Email);
        Assert.Equal("Bearer", loginResponse.TokenType);
        Assert.Equal(900, loginResponse.ExpiresIn);
        Assert.False(string.IsNullOrWhiteSpace(loginResponse.AccessToken));

        // Validate JWT structure (header.payload.signature)
        var parts = loginResponse.AccessToken.Split('.');
        Assert.Equal(3, parts.Length);
    }

    [Fact]
    public async Task Login_WithNonExistentEmail_Returns401Unauthorized_ProblemDetails()
    {
        // Arrange
        var loginPayload = new LoginRequest("nonexistent@example.com", "SecurePassword123!");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginPayload);

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(401, problemDetails.Status);
        Assert.Equal("Unauthorized", problemDetails.Title);
        Assert.Equal("Invalid email or password.", problemDetails.Detail);
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401Unauthorized_ProblemDetails()
    {
        // Arrange: Register user first
        var uniqueEmail = $"wrong_pwd_{Guid.NewGuid():N}@example.com";
        var registerPayload = new RegisterRequest(uniqueEmail, "CorrectPassword123!");
        var registerRes = await _client.PostAsJsonAsync("/api/auth/register", registerPayload);
        Assert.Equal(HttpStatusCode.OK, registerRes.StatusCode);

        var loginPayload = new LoginRequest(uniqueEmail, "WrongPassword123!");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginPayload);

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(401, problemDetails.Status);
        Assert.Equal("Unauthorized", problemDetails.Title);
        Assert.Equal("Invalid email or password.", problemDetails.Detail);
    }

    [Fact]
    public async Task Login_WithInvalidEmail_Returns400BadRequest_ValidationProblemDetails()
    {
        // Arrange
        var loginPayload = new LoginRequest("not-an-email", "SomePassword123!");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginPayload);

        // Assert: 400 Bad Request
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(400, problemDetails.Status);
        Assert.True(problemDetails.Errors.ContainsKey("Email"));
    }

    [Fact]
    public async Task Login_WithEmptyPassword_Returns400BadRequest_ValidationProblemDetails()
    {
        // Arrange
        var loginPayload = new LoginRequest("user@example.com", "");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginPayload);

        // Assert: 400 Bad Request
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(400, problemDetails.Status);
        Assert.True(problemDetails.Errors.ContainsKey("Password"));
    }

    [Fact]
    public async Task Login_WhenUserIsLockedOutAfterMaxFailedAttempts_Returns401Unauthorized_GenericProblemDetails()
    {
        // Arrange: Register user
        var uniqueEmail = $"lockout_user_{Guid.NewGuid():N}@example.com";
        var correctPassword = "CorrectPassword123!";
        var registerPayload = new RegisterRequest(uniqueEmail, correctPassword);
        var registerRes = await _client.PostAsJsonAsync("/api/auth/register", registerPayload);
        Assert.Equal(HttpStatusCode.OK, registerRes.StatusCode);

        var wrongPayload = new LoginRequest(uniqueEmail, "WrongPassword123!");
        var correctPayload = new LoginRequest(uniqueEmail, correctPassword);

        // Act: 5 consecutive failed login attempts to trigger lockout
        for (int i = 0; i < 5; i++)
        {
            var failedResponse = await _client.PostAsJsonAsync("/api/auth/login", wrongPayload);
            Assert.Equal(HttpStatusCode.Unauthorized, failedResponse.StatusCode);
        }

        // 6th attempt with the CORRECT password while account is locked out
        var lockedOutResponse = await _client.PostAsJsonAsync("/api/auth/login", correctPayload);

        // Assert: Still returns 401 Unauthorized with generic ProblemDetails
        Assert.Equal(HttpStatusCode.Unauthorized, lockedOutResponse.StatusCode);
        Assert.Equal("application/problem+json", lockedOutResponse.Content.Headers.ContentType?.MediaType);

        var problemDetails = await lockedOutResponse.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(401, problemDetails.Status);
        Assert.Equal("Unauthorized", problemDetails.Title);
        Assert.Equal("Invalid email or password.", problemDetails.Detail);
    }
}
