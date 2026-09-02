using Microsoft.AspNetCore.Http;

namespace RidePlanner.Api.Common;

public static class AuthCookieHelper
{
    public const string RefreshTokenCookieName = "refreshToken";

    public static void SetRefreshTokenCookie(
        HttpResponse response,
        string refreshToken,
        DateTimeOffset expiresAt,
        bool isHttps)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/api/auth",
            Expires = expiresAt,
            IsEssential = true
        };

        response.Cookies.Append(RefreshTokenCookieName, refreshToken, cookieOptions);
    }

    public static void ClearRefreshTokenCookie(
        HttpResponse response,
        bool isHttps)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/api/auth",
            Expires = DateTimeOffset.UtcNow.AddDays(-1),
            IsEssential = true
        };

        response.Cookies.Append(RefreshTokenCookieName, string.Empty, cookieOptions);
    }
}
