using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Api.IntegrationTests;

public class AuthEndpointIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public AuthEndpointIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            HandleCookies = false
        });
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

        // Validate Refresh Token Cookie
        var refreshCookie = ExtractCookie(response, "refreshToken");
        Assert.False(string.IsNullOrWhiteSpace(refreshCookie));
        Assert.Contains("httponly", response.Headers.GetValues("Set-Cookie").First(), StringComparison.OrdinalIgnoreCase);
        Assert.Contains("path=/api/auth", response.Headers.GetValues("Set-Cookie").First(), StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Refresh_WithValidCookie_RotatesCookie_AndReturnsNewJwt()
    {
        // Arrange: Register and login
        var uniqueEmail = $"refresh_valid_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";
        var registerPayload = new RegisterRequest(uniqueEmail, password);
        await _client.PostAsJsonAsync("/api/auth/register", registerPayload);

        var loginPayload = new LoginRequest(uniqueEmail, password);
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginPayload);
        var initialCookie = ExtractCookie(loginResponse, "refreshToken");
        Assert.False(string.IsNullOrWhiteSpace(initialCookie));

        var initialLoginData = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(initialLoginData);

        // Act: Refresh using initial cookie
        var refreshRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        refreshRequest.Headers.Add("Cookie", $"refreshToken={initialCookie}");
        var refreshResponse = await _client.SendAsync(refreshRequest);

        // Assert: Successful refresh
        Assert.Equal(HttpStatusCode.OK, refreshResponse.StatusCode);
        var refreshData = await refreshResponse.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(refreshData);
        Assert.Equal(initialLoginData.UserId, refreshData.UserId);
        Assert.Equal(uniqueEmail, refreshData.Email);
        Assert.False(string.IsNullOrWhiteSpace(refreshData.AccessToken));

        // Assert rotated cookie
        var rotatedCookie = ExtractCookie(refreshResponse, "refreshToken");
        Assert.False(string.IsNullOrWhiteSpace(rotatedCookie));
        Assert.NotEqual(initialCookie, rotatedCookie);
    }

    [Fact]
    public async Task Refresh_WithOldRotatedToken_FailsWith401()
    {
        // Arrange: Register, login, and perform first refresh (Token A -> Token B)
        var uniqueEmail = $"refresh_old_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(uniqueEmail, password));

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(uniqueEmail, password));
        var tokenA = ExtractCookie(loginResponse, "refreshToken");

        // Rotate Token A -> Token B
        var refreshReq1 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        refreshReq1.Headers.Add("Cookie", $"refreshToken={tokenA}");
        var refreshRes1 = await _client.SendAsync(refreshReq1);
        Assert.Equal(HttpStatusCode.OK, refreshRes1.StatusCode);

        // Act: Attempt to refresh using Token A again
        var refreshReq2 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        refreshReq2.Headers.Add("Cookie", $"refreshToken={tokenA}");
        var refreshRes2 = await _client.SendAsync(refreshReq2);

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, refreshRes2.StatusCode);
        Assert.Equal("application/problem+json", refreshRes2.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Refresh_ReuseDetection_RevokesEntireFamily_MakingNewTokenInvalid()
    {
        // Arrange: Register, login, and rotate Token A -> Token B
        var uniqueEmail = $"reuse_detect_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(uniqueEmail, password));

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(uniqueEmail, password));
        var tokenA = ExtractCookie(loginResponse, "refreshToken");

        // Legitimate refresh: Token A -> Token B
        var refreshReq1 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        refreshReq1.Headers.Add("Cookie", $"refreshToken={tokenA}");
        var refreshRes1 = await _client.SendAsync(refreshReq1);
        Assert.Equal(HttpStatusCode.OK, refreshRes1.StatusCode);
        var tokenB = ExtractCookie(refreshRes1, "refreshToken");

        // Attacker presents consumed Token A: triggers reuse detection
        var attackerReq = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        attackerReq.Headers.Add("Cookie", $"refreshToken={tokenA}");
        var attackerRes = await _client.SendAsync(attackerReq);
        Assert.Equal(HttpStatusCode.Unauthorized, attackerRes.StatusCode);

        // Act: Legitimate client now tries to use Token B
        var legitimateReq2 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        legitimateReq2.Headers.Add("Cookie", $"refreshToken={tokenB}");
        var legitimateRes2 = await _client.SendAsync(legitimateReq2);

        // Assert: Token B is now revoked because the entire family was invalidated!
        Assert.Equal(HttpStatusCode.Unauthorized, legitimateRes2.StatusCode);
    }

    [Fact]
    public async Task Refresh_WithMissingCookie_Returns401Unauthorized()
    {
        // Act: Request refresh with no cookie
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        var response = await _client.SendAsync(request);

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Refresh_WithInvalidToken_Returns401Unauthorized()
    {
        // Act: Request refresh with invalid token
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        request.Headers.Add("Cookie", "refreshToken=invalid-fake-token-value");
        var response = await _client.SendAsync(request);

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Refresh_ConcurrentRequests_OnlyOneSucceeds()
    {
        // Arrange: Register and login
        var uniqueEmail = $"concurrent_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(uniqueEmail, password));

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(uniqueEmail, password));
        var token = ExtractCookie(loginResponse, "refreshToken");

        // Act: Fire 2 concurrent refresh requests with the same token
        var req1 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        req1.Headers.Add("Cookie", $"refreshToken={token}");

        var req2 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        req2.Headers.Add("Cookie", $"refreshToken={token}");

        var task1 = _client.SendAsync(req1);
        var task2 = _client.SendAsync(req2);

        var responses = await Task.WhenAll(task1, task2);

        // Assert: Exactly one succeeds with 200, the other fails with 401
        var statusCodes = responses.Select(r => r.StatusCode).ToList();
        Assert.Contains(HttpStatusCode.OK, statusCodes);
        Assert.Contains(HttpStatusCode.Unauthorized, statusCodes);
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

    [Fact]
    public async Task GetCurrentUser_WithoutToken_Returns401Unauthorized()
    {
        // Act: GET /api/auth/me without Authorization header
        var response = await _client.GetAsync("/api/auth/me");

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCurrentUser_WithValidJwtToken_Returns200Ok_AndCorrectUserIdAndAuthenticated()
    {
        // Arrange: Register and login
        var uniqueEmail = $"current_user_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(uniqueEmail, password));

        var loginRes = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(uniqueEmail, password));
        var loginData = await loginRes.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(loginData);

        // Act: GET /api/auth/me with Bearer token
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", loginData.AccessToken);
        var response = await _client.SendAsync(request);

        // Assert: 200 OK with correct CurrentUserResponse
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var currentUser = await response.Content.ReadFromJsonAsync<CurrentUserResponse>();
        Assert.NotNull(currentUser);
        Assert.True(currentUser.IsAuthenticated);
        Assert.Equal(loginData.UserId, currentUser.UserId);
    }

    [Fact]
    public async Task GetCurrentUser_WithMalformedToken_Returns401Unauthorized()
    {
        // Act: GET /api/auth/me with garbage token
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "not-a-valid-token-format");
        var response = await _client.SendAsync(request);

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCurrentUser_WithTokenSignedByDifferentKey_Returns401Unauthorized()
    {
        // Arrange: Create a token signed by a different secret key
        var differentKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("another_completely_different_signing_key_at_least_32_bytes!"));
        var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(differentKey, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);
        var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: "RidePlanner",
            audience: "RidePlanner",
            claims: new[] { new System.Security.Claims.Claim("sub", Guid.NewGuid().ToString()) },
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds);
        var invalidToken = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(jwt);

        // Act: GET /api/auth/me with improperly signed token
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", invalidToken);
        var response = await _client.SendAsync(request);

        // Assert: 401 Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private static string? ExtractCookie(HttpResponseMessage response, string cookieName)
    {
        if (response.Headers.TryGetValues("Set-Cookie", out var cookies))
        {
            foreach (var cookie in cookies)
            {
                var parts = cookie.Split(';');
                var nameValue = parts[0].Split('=');
                if (nameValue[0].Trim().Equals(cookieName, StringComparison.OrdinalIgnoreCase))
                {
                    return nameValue.Length > 1 ? nameValue[1].Trim() : string.Empty;
                }
            }
        }
        return null;
    }
}
