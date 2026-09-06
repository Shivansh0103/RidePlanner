namespace RidePlanner.Api.Common;

public static class ReturnUrlValidator
{
    public static bool IsValidLocalUrl(string? returnUrl)
    {
        if (string.IsNullOrWhiteSpace(returnUrl))
        {
            return false;
        }

        // Must start with '/' and not start with '//' (protocol-relative) or '/\'
        if (!returnUrl.StartsWith('/') || returnUrl.StartsWith("//", StringComparison.Ordinal) || returnUrl.StartsWith("/\\", StringComparison.Ordinal))
        {
            return false;
        }

        // Must not contain any control characters or whitespace
        if (returnUrl.Any(c => char.IsControl(c) || char.IsWhiteSpace(c)))
        {
            return false;
        }

        return true;
    }

    public static string Sanitize(string? returnUrl, string fallback = "/trips")
    {
        if (IsValidLocalUrl(returnUrl))
        {
            return returnUrl!;
        }

        return fallback;
    }
}
