# Stage 1: Build and publish using .NET 10 SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first for optimized layer caching during restore
COPY RidePlanner/RidePlanner.Api/RidePlanner.Api.csproj RidePlanner/RidePlanner.Api/
COPY RidePlanner/RidePlanner.Application/RidePlanner.Application.csproj RidePlanner/RidePlanner.Application/
COPY RidePlanner/RidePlanner.Domain/RidePlanner.Domain.csproj RidePlanner/RidePlanner.Domain/
COPY RidePlanner/RidePlanner.Infrastructure/RidePlanner.Infrastructure.csproj RidePlanner/RidePlanner.Infrastructure/

# Restore dependencies
RUN dotnet restore RidePlanner/RidePlanner.Api/RidePlanner.Api.csproj

# Copy remaining source code
COPY RidePlanner/ RidePlanner/

# Publish in Release configuration without re-restoring
RUN dotnet publish RidePlanner/RidePlanner.Api/RidePlanner.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# Stage 2: Runtime image using ASP.NET Core 10 runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Configure ASP.NET Core to listen on port 8080
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# Copy published application artifacts from build stage
COPY --from=build /app/publish .

# Run as non-root user (built into official .NET 8+ container images)
USER $APP_UID

# Entrypoint for running the application
ENTRYPOINT ["dotnet", "RidePlanner.Api.dll"]
