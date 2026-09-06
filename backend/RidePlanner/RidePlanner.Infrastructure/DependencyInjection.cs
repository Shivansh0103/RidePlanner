using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Notifications;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Infrastructure.Identity;
using RidePlanner.Infrastructure.Notifications;
using RidePlanner.Infrastructure.Persistence;
using RidePlanner.Infrastructure.Persistence.Repositories;

namespace RidePlanner.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("RidePlannerDatabase");

        if (string.IsNullOrWhiteSpace(connectionString) || string.Equals(connectionString, "InMemory", StringComparison.OrdinalIgnoreCase))
        {
            services.AddDbContext<RidePlannerDbContext>(options =>
                options.UseInMemoryDatabase("RidePlannerDb"));
        }
        else
        {
            services.AddDbContext<RidePlannerDbContext>(options =>
                options.UseNpgsql(connectionString));
        }

        services.AddDataProtection();
        services.AddMemoryCache();
        services.AddHttpContextAccessor();

        var jwtSettings = configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>() ?? new JwtSettings();
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        var authBuilder = services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                ValidateIssuer = !string.IsNullOrWhiteSpace(jwtSettings.Issuer),
                ValidIssuer = jwtSettings.Issuer,
                ValidateAudience = !string.IsNullOrWhiteSpace(jwtSettings.Audience),
                ValidAudience = jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        })
        .AddCookie(IdentityConstants.ExternalScheme, options =>
        {
            options.Cookie.Name = "RidePlanner.External";
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Lax;
            options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
            options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
        });

        var googleClientId = configuration["Authentication:Google:ClientId"];
        var googleClientSecret = configuration["Authentication:Google:ClientSecret"];
        if (string.IsNullOrWhiteSpace(googleClientId) || string.IsNullOrWhiteSpace(googleClientSecret))
        {
            googleClientId = "development-placeholder-google-client-id";
            googleClientSecret = "development-placeholder-google-client-secret";
        }

        authBuilder.AddGoogle(options =>
        {
            options.ClientId = googleClientId;
            options.ClientSecret = googleClientSecret;
            options.SignInScheme = IdentityConstants.ExternalScheme;
            options.SaveTokens = false;
        });

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            options.User.RequireUniqueEmail = true;

            // Lockout settings
            options.Lockout.AllowedForNewUsers = true;
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<RidePlannerDbContext>()
        .AddSignInManager()
        .AddDefaultTokenProviders();

        var resetTokenHours = configuration.GetValue<double>("Identity:PasswordResetTokenLifespanHours", 2);
        services.Configure<DataProtectionTokenProviderOptions>(options =>
        {
            options.TokenLifespan = TimeSpan.FromHours(resetTokenHours);
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<ITripRepository, TripRepository>();
        services.AddScoped<ITripStopRepository, TripStopRepository>();
        services.AddScoped<IChecklistRepository, ChecklistRepository>();
        services.AddScoped<IAccommodationRepository, AccommodationRepository>();
        services.AddScoped<IExpenseRepository, ExpenseRepository>();
        services.AddScoped<ITripDocumentRepository, TripDocumentRepository>();
        services.AddScoped<IEmergencyContactRepository, EmergencyContactRepository>();
        services.AddScoped<ITripMemoryRepository, TripMemoryRepository>();
        services.AddScoped<IUserProfileRepository, UserProfileRepository>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddTransient<IEmailSender, DevelopmentEmailSender>();
        return services;
    }
}