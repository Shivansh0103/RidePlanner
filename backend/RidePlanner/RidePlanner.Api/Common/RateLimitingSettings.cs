namespace RidePlanner.Api.Common;

public class RateLimitingSettings
{
    public const string SectionName = "RateLimiting";

    public RateLimitPolicyConfig Login { get; set; } = new() { PermitLimit = 10, WindowSeconds = 60 };
    public RateLimitPolicyConfig Register { get; set; } = new() { PermitLimit = 3, WindowSeconds = 60 };
    public RateLimitPolicyConfig ForgotPassword { get; set; } = new() { PermitLimit = 5, WindowSeconds = 900 };
    public RateLimitPolicyConfig ResetPassword { get; set; } = new() { PermitLimit = 5, WindowSeconds = 900 };
    public RateLimitPolicyConfig ExternalLink { get; set; } = new() { PermitLimit = 10, WindowSeconds = 900 };
}

public class RateLimitPolicyConfig
{
    public int PermitLimit { get; set; }
    public int WindowSeconds { get; set; }
}
