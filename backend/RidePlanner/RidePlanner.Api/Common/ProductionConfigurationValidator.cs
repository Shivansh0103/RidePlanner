namespace RidePlanner.Api.Common;

public static class ProductionConfigurationValidator
{
    public const string DefaultDevJwtSecret = "super_secret_rideplanner_jwt_signing_key_at_least_32_bytes_long!";
    public const string DefaultDevGoogleClientId = "development-placeholder-google-client-id";
    public const string DefaultDevGoogleClientSecret = "development-placeholder-google-client-secret";

    public static void Validate(IConfiguration configuration, IHostEnvironment environment)
    {
        // Validation is strictly enforced in production/staging environments
        if (environment.IsDevelopment() || environment.IsEnvironment("Testing"))
        {
            return;
        }

        var errors = new List<string>();

        // 1. Validate JWT Secret
        var jwtSecret = configuration["Jwt:Secret"];
        if (string.IsNullOrWhiteSpace(jwtSecret))
        {
            errors.Add("Jwt:Secret is required and cannot be empty.");
        }
        else if (jwtSecret.Length < 32)
        {
            errors.Add("Jwt:Secret must be at least 32 characters (256 bits) long.");
        }
        else if (string.Equals(jwtSecret, DefaultDevJwtSecret, StringComparison.Ordinal) ||
                 jwtSecret.Contains("super_secret", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("Jwt:Secret cannot use the default development secret or a known placeholder.");
        }

        // 2. Validate Database Connection String
        var connectionString = configuration.GetConnectionString("RidePlannerDatabase");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            errors.Add("ConnectionStrings:RidePlannerDatabase is required in production.");
        }
        else if (string.Equals(connectionString, "InMemory", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("ConnectionStrings:RidePlannerDatabase cannot be 'InMemory' in production.");
        }

        // 3. Validate Google OAuth if configured
        var googleClientId = configuration["Authentication:Google:ClientId"];
        var googleClientSecret = configuration["Authentication:Google:ClientSecret"];
        if (!string.IsNullOrWhiteSpace(googleClientId) || !string.IsNullOrWhiteSpace(googleClientSecret))
        {
            if (string.Equals(googleClientId, DefaultDevGoogleClientId, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(googleClientSecret, DefaultDevGoogleClientSecret, StringComparison.OrdinalIgnoreCase))
            {
                errors.Add("Authentication:Google credentials cannot use development placeholder values in production.");
            }
        }

        // 4. Validate CORS Allowed Origins
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (allowedOrigins == null || allowedOrigins.Length == 0 || allowedOrigins.All(string.IsNullOrWhiteSpace))
        {
            errors.Add("Cors:AllowedOrigins must specify at least one valid origin in production.");
        }
        else if (allowedOrigins.Length == 1 && string.Equals(allowedOrigins[0], "http://localhost:5173", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("Cors:AllowedOrigins cannot only allow 'http://localhost:5173' in production.");
        }

        // 5. Validate Frontend Base URL
        var frontendBaseUrl = configuration["App:FrontendBaseUrl"];
        if (string.IsNullOrWhiteSpace(frontendBaseUrl))
        {
            errors.Add("App:FrontendBaseUrl is required in production.");
        }
        else if (string.Equals(frontendBaseUrl, "http://localhost:5173", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("App:FrontendBaseUrl cannot be 'http://localhost:5173' in production.");
        }

        if (errors.Count > 0)
        {
            var summary = string.Join(Environment.NewLine + " - ", errors);
            throw new InvalidOperationException($"Production configuration validation failed:{Environment.NewLine} - {summary}");
        }
    }
}
