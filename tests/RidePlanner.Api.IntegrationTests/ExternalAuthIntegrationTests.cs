using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.WebUtilities;
using RidePlanner.Api.Common;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Api.IntegrationTests;

public class ExternalAuthIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public ExternalAuthIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            HandleCookies = false,
            AllowAutoRedirect = false
        });
    }

    [Fact]
    public async Task GoogleStart_WithValidReturnUrl_ReturnsChallengeRedirect()
    {
        // Act
        var response = await _client.GetAsync("/api/auth/external/google/start?returnUrl=/trips/sample-123");

        // Assert: 302 or challenge response
        Assert.True(
            response.StatusCode == HttpStatusCode.Redirect ||
            response.StatusCode == HttpStatusCode.Found ||
            response.StatusCode == HttpStatusCode.Unauthorized,
            $"Expected redirect or challenge, but got {response.StatusCode}");
    }

    [Fact]
    public async Task GoogleCallback_NewUser_CreatesUser_SetsRefreshCookie_RedirectsToSpa_AndSpaBootstrapsSession()
    {
        // Arrange: Generate unique Google user claims
        var uniqueSub = $"google_sub_{Guid.NewGuid():N}";
        var uniqueEmail = $"google_rider_{Guid.NewGuid():N}@gmail.com";

        // 1. Issue external cookie via test endpoint
        var signInReq = new TestExternalSignInRequest(uniqueSub, uniqueEmail, "Google Rider", "/trips");
        var signInRes = await _client.PostAsJsonAsync("/api/test/signin-external", signInReq);
        Assert.Equal(HttpStatusCode.OK, signInRes.StatusCode);

        var externalCookie = ExtractCookie(signInRes, "RidePlanner.External");
        Assert.NotNull(externalCookie);

        // 2. Call callback endpoint with external cookie
        var callbackReq = new HttpRequestMessage(HttpMethod.Get, "/api/auth/external/google/callback?returnUrl=/trips");
        callbackReq.Headers.Add("Cookie", $"RidePlanner.External={externalCookie}");

        var callbackRes = await _client.SendAsync(callbackReq);

        // Assert: Redirect to SPA callback
        Assert.Equal(HttpStatusCode.Redirect, callbackRes.StatusCode);
        var location = callbackRes.Headers.Location?.ToString();
        Assert.NotNull(location);
        Assert.Contains("/auth/callback", location);
        Assert.Contains("status=success", location);
        Assert.Contains("returnUrl=%2Ftrips", location);

        // Assert: Refresh token cookie is set
        var refreshCookie = ExtractCookie(callbackRes, AuthCookieHelper.RefreshTokenCookieName);
        Assert.NotNull(refreshCookie);

        // 3. SPA session bootstrap: POST /api/auth/refresh using the refresh cookie
        var refreshReq = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        refreshReq.Headers.Add("Cookie", $"{AuthCookieHelper.RefreshTokenCookieName}={refreshCookie}");

        var refreshRes = await _client.SendAsync(refreshReq);
        Assert.Equal(HttpStatusCode.OK, refreshRes.StatusCode);

        var loginResponse = await refreshRes.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(loginResponse);
        Assert.NotEmpty(loginResponse.AccessToken);
        Assert.Equal("Bearer", loginResponse.TokenType);
        Assert.Equal(uniqueEmail, loginResponse.Email);
        Assert.NotEqual(Guid.Empty, loginResponse.UserId);

        // 4. Verify user can access authenticated endpoint
        var meReq = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        meReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", loginResponse.AccessToken);

        var meRes = await _client.SendAsync(meReq);
        Assert.Equal(HttpStatusCode.OK, meRes.StatusCode);
        var meData = await meRes.Content.ReadFromJsonAsync<CurrentUserResponse>();
        Assert.NotNull(meData);
        Assert.True(meData.IsAuthenticated);
        Assert.Equal(loginResponse.UserId, meData.UserId);
    }

    [Fact]
    public async Task GoogleCallback_AlreadyLinkedUser_DirectSignIn_SetsRefreshCookie()
    {
        // Arrange: Create and link account first
        var uniqueSub = $"google_sub_{Guid.NewGuid():N}";
        var uniqueEmail = $"linked_rider_{Guid.NewGuid():N}@gmail.com";

        var signInReq = new TestExternalSignInRequest(uniqueSub, uniqueEmail, "Linked Rider", "/trips");
        var signInRes = await _client.PostAsJsonAsync("/api/test/signin-external", signInReq);
        var externalCookie1 = ExtractCookie(signInRes, "RidePlanner.External");

        var callbackReq1 = new HttpRequestMessage(HttpMethod.Get, "/api/auth/external/google/callback?returnUrl=/trips");
        callbackReq1.Headers.Add("Cookie", $"RidePlanner.External={externalCookie1}");
        var callbackRes1 = await _client.SendAsync(callbackReq1);
        Assert.Equal(HttpStatusCode.Redirect, callbackRes1.StatusCode);

        // Act: Sign in second time with identical Google identity
        var signInRes2 = await _client.PostAsJsonAsync("/api/test/signin-external", signInReq);
        var externalCookie2 = ExtractCookie(signInRes2, "RidePlanner.External");

        var callbackReq2 = new HttpRequestMessage(HttpMethod.Get, "/api/auth/external/google/callback?returnUrl=/trips");
        callbackReq2.Headers.Add("Cookie", $"RidePlanner.External={externalCookie2}");
        var callbackRes2 = await _client.SendAsync(callbackReq2);

        // Assert: Signs in directly
        Assert.Equal(HttpStatusCode.Redirect, callbackRes2.StatusCode);
        var location = callbackRes2.Headers.Location?.ToString();
        Assert.NotNull(location);
        Assert.Contains("/auth/callback", location);
        Assert.Contains("status=success", location);

        var refreshCookie = ExtractCookie(callbackRes2, AuthCookieHelper.RefreshTokenCookieName);
        Assert.NotNull(refreshCookie);
    }

    [Fact]
    public async Task GoogleCallback_ExistingLocalAccount_RequiresLinking_WithoutEmailInUrl()
    {
        // Arrange: Register standard local account
        var localEmail = $"local_rider_{Guid.NewGuid():N}@example.com";
        var localPassword = "SecurePassword123!";
        var registerRes = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(localEmail, localPassword));
        Assert.Equal(HttpStatusCode.OK, registerRes.StatusCode);

        // External sign-in attempt with the same email
        var googleSub = $"google_sub_{Guid.NewGuid():N}";
        var signInReq = new TestExternalSignInRequest(googleSub, localEmail, "Google Rider", "/trips");
        var signInRes = await _client.PostAsJsonAsync("/api/test/signin-external", signInReq);
        var externalCookie = ExtractCookie(signInRes, "RidePlanner.External");

        // Act: Invoke callback
        var callbackReq = new HttpRequestMessage(HttpMethod.Get, "/api/auth/external/google/callback?returnUrl=/trips");
        callbackReq.Headers.Add("Cookie", $"RidePlanner.External={externalCookie}");
        var callbackRes = await _client.SendAsync(callbackReq);

        // Assert: Redirect to /auth/link-account without email in URL
        Assert.Equal(HttpStatusCode.Redirect, callbackRes.StatusCode);
        var location = callbackRes.Headers.Location?.ToString();
        Assert.NotNull(location);
        Assert.Contains("/auth/link-account", location);
        Assert.Contains("ticket=", location);
        Assert.DoesNotContain("email=", location, StringComparison.OrdinalIgnoreCase);

        // Refresh token must NOT be set yet
        var refreshCookie = ExtractCookie(callbackRes, AuthCookieHelper.RefreshTokenCookieName);
        Assert.Null(refreshCookie);
    }

    [Fact]
    public async Task AccountLinking_FullLifecycle_VerifiesProofOfControl_AndAntiReplay()
    {
        // 1. Create existing user
        var email = $"link_test_{Guid.NewGuid():N}@example.com";
        var password = "CorrectPassword123!";
        var regRes = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, password));
        Assert.Equal(HttpStatusCode.OK, regRes.StatusCode);

        // 2. Google sign-in triggers linking ticket
        var googleSub = $"google_sub_{Guid.NewGuid():N}";
        var signInReq = new TestExternalSignInRequest(googleSub, email, "Linker", "/trips");
        var signInRes = await _client.PostAsJsonAsync("/api/test/signin-external", signInReq);
        var extCookie = ExtractCookie(signInRes, "RidePlanner.External");

        var callbackReq = new HttpRequestMessage(HttpMethod.Get, "/api/auth/external/google/callback?returnUrl=/trips");
        callbackReq.Headers.Add("Cookie", $"RidePlanner.External={extCookie}");
        var callbackRes = await _client.SendAsync(callbackReq);

        var location = callbackRes.Headers.Location?.ToString();
        Assert.NotNull(location);
        var uri = new Uri(location);
        var query = QueryHelpers.ParseQuery(uri.Query);
        var ticket = query["ticket"].ToString();
        Assert.NotEmpty(ticket);

        // 3. Test link-info endpoint
        var infoRes = await _client.GetAsync($"/api/auth/external/link-info?ticket={Uri.EscapeDataString(ticket)}");
        Assert.Equal(HttpStatusCode.OK, infoRes.StatusCode);
        var linkInfo = await infoRes.Content.ReadFromJsonAsync<ExternalLinkInfo>();
        Assert.NotNull(linkInfo);
        Assert.Equal("Google", linkInfo.Provider);
        Assert.Contains("***", linkInfo.MaskedEmail);

        // 4. Test linking with WRONG password -> 401 Unauthorized
        var wrongPassReq = new LinkExternalAccountRequest(ticket, "WrongPassword!");
        var wrongPassRes = await _client.PostAsJsonAsync("/api/auth/external/link", wrongPassReq);
        Assert.Equal(HttpStatusCode.Unauthorized, wrongPassRes.StatusCode);

        // 5. Test linking with CORRECT password -> 200 OK & sets refresh cookie
        var correctPassReq = new LinkExternalAccountRequest(ticket, password);
        var correctPassRes = await _client.PostAsJsonAsync("/api/auth/external/link", correctPassReq);
        Assert.Equal(HttpStatusCode.OK, correctPassRes.StatusCode);

        var loginRes = await correctPassRes.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(loginRes);
        Assert.NotEmpty(loginRes.AccessToken);
        Assert.Equal(email, loginRes.Email);

        var refreshCookie = ExtractCookie(correctPassRes, AuthCookieHelper.RefreshTokenCookieName);
        Assert.NotNull(refreshCookie);

        // 6. Test anti-replay: Reusing the same ticket fails with 401 Unauthorized
        var replayRes = await _client.PostAsJsonAsync("/api/auth/external/link", correctPassReq);
        Assert.Equal(HttpStatusCode.Unauthorized, replayRes.StatusCode);

        // 7. Verify Google account is now linked: next Google sign in signs in directly
        var nextSignInRes = await _client.PostAsJsonAsync("/api/test/signin-external", signInReq);
        var nextExtCookie = ExtractCookie(nextSignInRes, "RidePlanner.External");

        var nextCallbackReq = new HttpRequestMessage(HttpMethod.Get, "/api/auth/external/google/callback?returnUrl=/trips");
        nextCallbackReq.Headers.Add("Cookie", $"RidePlanner.External={nextExtCookie}");
        var nextCallbackRes = await _client.SendAsync(nextCallbackReq);

        Assert.Equal(HttpStatusCode.Redirect, nextCallbackRes.StatusCode);
        var nextLocation = nextCallbackRes.Headers.Location?.ToString();
        Assert.NotNull(nextLocation);
        Assert.Contains("/auth/callback", nextLocation);
        Assert.Contains("status=success", nextLocation);
    }

    [Fact]
    public async Task AccountLinking_WithTamperedTicket_Returns401Unauthorized()
    {
        var request = new LinkExternalAccountRequest("invalid_or_tampered_ticket_content", "SomePassword123!");
        var response = await _client.PostAsJsonAsync("/api/auth/external/link", request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private static string? ExtractCookie(HttpResponseMessage response, string cookieName)
    {
        if (!response.Headers.TryGetValues("Set-Cookie", out var cookieHeaders))
        {
            return null;
        }

        foreach (var header in cookieHeaders)
        {
            var parts = header.Split(';');
            if (parts.Length > 0)
            {
                var keyValue = parts[0].Split('=');
                if (keyValue.Length == 2 && keyValue[0].Trim().Equals(cookieName, StringComparison.OrdinalIgnoreCase))
                {
                    return keyValue[1].Trim();
                }
            }
        }

        return null;
    }
}
