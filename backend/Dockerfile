# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /repo

# Set build arguments for commit hash and build timestamp
ARG APP_COMMIT=
ARG APP_BUILT_AT=

# Version passed from CI (calculated from git tags)
ARG VERSION=0.0.0-local

# Copy solution and project files
COPY backend/WaifuApi.slnx backend/

COPY backend/WaifuApi.Web/WaifuApi.Web.csproj backend/WaifuApi.Web/
COPY backend/WaifuApi.Application/WaifuApi.Application.csproj backend/WaifuApi.Application/
COPY backend/WaifuApi.Domain/WaifuApi.Domain.csproj backend/WaifuApi.Domain/
COPY backend/WaifuApi.Infrastructure/WaifuApi.Infrastructure.csproj backend/WaifuApi.Infrastructure/

# Restore dependencies
RUN dotnet restore "WaifuApi.Web/WaifuApi.Web.csproj"

# Copy the rest of the source code
COPY . .

# Build and publish with explicit version
WORKDIR "/repo/backend/WaifuApi.Web"
RUN set -eu; COMMIT="$(git -C /repo rev-parse --verify HEAD 2>/dev/null | cut -c1-7 || true)"; \
    BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"; \
    dotnet publish "WaifuApi.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:Version=${VERSION} /p:OpenApiGenerateDocumentsOnBuild=false /p:AppCommit="${COMMIT}" /p:AppBuiltAt="${BUILD_TIME}"
    

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Install Kerberos library to suppress Npgsql GSSAPI warning
RUN apt-get update && apt-get install -y --no-install-recommends libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WaifuApi.Web.dll"]
