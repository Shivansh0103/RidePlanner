namespace RidePlanner.Api.Common;

public static class RateLimitPolicies
{
    public const string Login = "LoginRateLimit";
    public const string Register = "RegisterRateLimit";
    public const string ForgotPassword = "ForgotPasswordRateLimit";
    public const string ResetPassword = "ResetPasswordRateLimit";
    public const string ExternalLink = "ExternalLinkRateLimit";
}
