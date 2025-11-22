<#
One-click setup script for the Laravel scaffold in this workspace.

What it does:
  - Creates a Laravel app via Composer if not present
  - Copies scaffold files from `laravel-backend` into the app
  - Updates `.env` DB credentials
  - Attempts to create DB with `mysql` CLI (if available)
  - Runs `composer install`, `php artisan key:generate`, and `php artisan migrate --seed`

How to run (PowerShell):
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process; .\setup-laravel.ps1

You can override DB values by passing parameters, e.g.
  .\setup-laravel.ps1 -DbUser myuser -DbPass mypass -DbName mydb

#>
param(
    [string]$WorkspaceRoot = "C:\Users\Admin\Desktop\vendor-catalog-system",
    [string]$LaravelDir = "$WorkspaceRoot\laravel-app",
    [string]$DbHost = '127.0.0.1',
    [int]$DbPort = 3306,
    [string]$DbUser = 'root',
    [string]$DbPass = 'Sidd@3185',
    [string]$DbName = 'vendor_catalog'
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }
function Write-Ok($msg){ Write-Host "[OK] $msg" -ForegroundColor Green }

Try {
    Write-Info "Workspace root: $WorkspaceRoot"
    Write-Info "Laravel app path: $LaravelDir"

    if (-not (Test-Path $WorkspaceRoot)){
        throw "Workspace root not found: $WorkspaceRoot"
    }

    Push-Location $WorkspaceRoot

    if (-not (Test-Path $LaravelDir)){
        Write-Info "Laravel app not found. Creating with Composer (may take several minutes)..."
        & composer create-project laravel/laravel $LaravelDir '^10.0'
        if ($LASTEXITCODE -ne 0){ throw "composer create-project failed with exit code $LASTEXITCODE" }
        Write-Ok "Laravel app created"
    } else {
        Write-Info "Laravel app already exists — skipping create-project"
    }

    Write-Info "Copying scaffold files into Laravel app (using robocopy)"
    robocopy "$WorkspaceRoot\laravel-backend\app" "$LaravelDir\app" /E | Out-Null
    robocopy "$WorkspaceRoot\laravel-backend\database" "$LaravelDir\database" /E | Out-Null
    robocopy "$WorkspaceRoot\laravel-backend\resources" "$LaravelDir\resources" /E | Out-Null
    Copy-Item -Path "$WorkspaceRoot\laravel-backend\routes-web-snippet.txt" -Destination "$LaravelDir\routes\web.php" -Force
    Write-Ok "Scaffold copied"

    Write-Info "Copying public assets (this may overwrite files in laravel-app/public)"
    robocopy "$WorkspaceRoot\public" "$LaravelDir\public" /E | Out-Null
    if (Test-Path "$WorkspaceRoot\vendor-catalog-node\public"){
        robocopy "$WorkspaceRoot\vendor-catalog-node\public" "$LaravelDir\public" /E | Out-Null
    }
    Write-Ok "Public assets copied"

    $envFile = Join-Path $LaravelDir '.env'
    if (-not (Test-Path $envFile)){
        Write-Info ".env file not found at $envFile — creating from .env.example"
        Copy-Item -Path (Join-Path $LaravelDir '.env.example') -Destination $envFile -Force
    }

    Write-Info "Updating .env with DB credentials"
    $envText = Get-Content $envFile -Raw

    $envText = if ($envText -match 'DB_CONNECTION=') { $envText -replace 'DB_CONNECTION=.*', "DB_CONNECTION=mysql" } else { $envText + "`nDB_CONNECTION=mysql" }
    $envText = if ($envText -match 'DB_HOST=') { $envText -replace 'DB_HOST=.*', "DB_HOST=$DbHost" } else { $envText + "`nDB_HOST=$DbHost" }
    $envText = if ($envText -match 'DB_PORT=') { $envText -replace 'DB_PORT=.*', "DB_PORT=$DbPort" } else { $envText + "`nDB_PORT=$DbPort" }
    $envText = if ($envText -match 'DB_DATABASE=') { $envText -replace 'DB_DATABASE=.*', "DB_DATABASE=$DbName" } else { $envText + "`nDB_DATABASE=$DbName" }
    $envText = if ($envText -match 'DB_USERNAME=') { $envText -replace 'DB_USERNAME=.*', "DB_USERNAME=$DbUser" } else { $envText + "`nDB_USERNAME=$DbUser" }
    $safePass = $DbPass -replace '\\','\\\\'
    $envText = if ($envText -match 'DB_PASSWORD=') { $envText -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$safePass" } else { $envText + "`nDB_PASSWORD=$safePass" }

    Set-Content -Path $envFile -Value $envText -Force
    Write-Ok ".env updated"

    $mysqlExe = Get-Command mysql -ErrorAction SilentlyContinue
    if ($mysqlExe) {
        Write-Info "Found mysql CLI. Attempting to create database '$DbName' (may require entering password)."
        & mysql -u $DbUser -p$DbPass -e "CREATE DATABASE IF NOT EXISTS `$DbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Ok ("Database ensured: {0}" -f $DbName)
        } else {
            Write-Err ("mysql CLI returned non-zero exit code ({0}). You may create DB manually." -f $LASTEXITCODE)
        }
    } else {
        Write-Info "mysql CLI not found in PATH — skipping DB create. Please create database '$DbName' manually if needed."
    }

    Push-Location $LaravelDir
    Write-Info "Running composer install (this may download dependencies)..."
    iex "composer install"
    if ($LASTEXITCODE -ne 0){ throw "composer install failed with exit code $LASTEXITCODE" }

    Write-Info "Generating app key"
    iex "php artisan key:generate"
    if ($LASTEXITCODE -ne 0){ throw "php artisan key:generate failed with exit code $LASTEXITCODE" }

    Write-Info "Running migrations and seeders"
    iex "php artisan migrate --seed"
    if ($LASTEXITCODE -ne 0){ throw "php artisan migrate --seed failed with exit code $LASTEXITCODE" }
    Write-Ok "Migrations and seeders finished"

    Write-Info "Setup complete. To run the app: php artisan serve (inside $LaravelDir)"
    Pop-Location
    Pop-Location
} Catch {
    Write-Err "Setup failed: $($_.Exception.Message)"
    Write-Err "StackTrace: $($_.Exception.StackTrace)"
    Pop-Location -ErrorAction SilentlyContinue
}

Write-Ok "Script finished"
<#
One-click setup script for the Laravel scaffold in this workspace.

What it does:

How to run (PowerShell):
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
    .\setup-laravel.ps1

You can override DB values by passing parameters, e.g.
  .\setup-laravel.ps1 -DbUser myuser -DbPass mypass -DbName mydb

#>
param(
    [string]$WorkspaceRoot = "C:\Users\Admin\Desktop\vendor-catalog-system",
    [string]$LaravelDir = "$WorkspaceRoot\laravel-app",
    [string]$DbHost = '127.0.0.1',
    [int]$DbPort = 3306,
    [string]$DbUser = 'root',
    [string]$DbPass = 'Sidd@3185',
    [string]$DbName = 'vendor_catalog'
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }
function Write-Ok($msg){ Write-Host "[OK] $msg" -ForegroundColor Green }

Try {
    Write-Info "Workspace root: $WorkspaceRoot"
    Write-Info "Laravel app path: $LaravelDir"

    # Ensure workspace exists
    if (-not (Test-Path $WorkspaceRoot)){
        throw "Workspace root not found: $WorkspaceRoot";
    }

    Push-Location $WorkspaceRoot

    # 1) Create Laravel app if missing
    if (-not (Test-Path $LaravelDir)){
        Write-Info "Laravel app not found. Creating with Composer (may take several minutes)..."
        # Use the call operator to avoid quoting issues
        & composer create-project laravel/laravel $LaravelDir '^10.0'
        if ($LASTEXITCODE -ne 0){ throw "composer create-project failed with exit code $LASTEXITCODE" }
        Write-Ok "Laravel app created"
    } else {
        Write-Info "Laravel app already exists — skipping create-project"
    }

    # 2) Copy scaffold files into laravel app
    Write-Info "Copying scaffold files into Laravel app (using robocopy)"
    robocopy "$WorkspaceRoot\laravel-backend\app" "$LaravelDir\app" /E | Out-Null
    robocopy "$WorkspaceRoot\laravel-backend\database" "$LaravelDir\database" /E | Out-Null
    robocopy "$WorkspaceRoot\laravel-backend\resources" "$LaravelDir\resources" /E | Out-Null
    # copy route snippet to web.php
    Copy-Item -Path "$WorkspaceRoot\laravel-backend\routes-web-snippet.txt" -Destination "$LaravelDir\routes\web.php" -Force
    Write-Ok "Scaffold copied"

    # 3) Copy public assets
    Write-Info "Copying public assets (this may overwrite files in laravel-app/public)"
    robocopy "$WorkspaceRoot\public" "$LaravelDir\public" /E | Out-Null
    if (Test-Path "$WorkspaceRoot\vendor-catalog-node\public"){
        robocopy "$WorkspaceRoot\vendor-catalog-node\public" "$LaravelDir\public" /E | Out-Null
    }
    Write-Ok "Public assets copied"

    # 4) Update .env file values
    $envFile = Join-Path $LaravelDir '.env'
    if (-not (Test-Path $envFile)){
        Write-Err ".env file not found at $envFile — creating from .env.example"
        Copy-Item -Path (Join-Path $LaravelDir '.env.example') -Destination $envFile -Force
    }

    Write-Info "Updating .env with DB credentials"
    $envText = Get-Content $envFile -Raw

    $envText = if ($envText -match 'DB_CONNECTION=') { $envText -replace 'DB_CONNECTION=.*', "DB_CONNECTION=mysql" } else { $envText + "`nDB_CONNECTION=mysql" }
    $envText = if ($envText -match 'DB_HOST=') { $envText -replace 'DB_HOST=.*', "DB_HOST=$DbHost" } else { $envText + "`nDB_HOST=$DbHost" }
    $envText = if ($envText -match 'DB_PORT=') { $envText -replace 'DB_PORT=.*', "DB_PORT=$DbPort" } else { $envText + "`nDB_PORT=$DbPort" }
    $envText = if ($envText -match 'DB_DATABASE=') { $envText -replace 'DB_DATABASE=.*', "DB_DATABASE=$DbName" } else { $envText + "`nDB_DATABASE=$DbName" }
    $envText = if ($envText -match 'DB_USERNAME=') { $envText -replace 'DB_USERNAME=.*', "DB_USERNAME=$DbUser" } else { $envText + "`nDB_USERNAME=$DbUser" }
    # Escape backslashes in password if present
    $safePass = $DbPass -replace '\\','\\\\'
    $envText = if ($envText -match 'DB_PASSWORD=') { $envText -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$safePass" } else { $envText + "`nDB_PASSWORD=$safePass" }

    Set-Content -Path $envFile -Value $envText -Force
    Write-Ok ".env updated"

    # 5) Attempt to create the database using mysql CLI (if available)
    $mysqlExe = Get-Command mysql -ErrorAction SilentlyContinue
    if ($mysqlExe) {
        Write-Info "Found mysql CLI. Attempting to create database '$DbName' (may require entering password)."
        # Use -p with password; note this exposes password on process list (acceptable for local dev)
        & mysql -u $DbUser -p$DbPass -e "CREATE DATABASE IF NOT EXISTS `$DbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
        if ($LASTEXITCODE -eq 0) { Write-Ok "Database ensured: $DbName" } else { Write-Err "mysql CLI returned non-zero exit code ($LASTEXITCODE). You may create DB manually." }
    } else {
        Write-Info "mysql CLI not found in PATH — skipping DB create. Please create database '$DbName' manually if needed."
    }

    # 6) Install composer deps and run migrations/seeds
    Push-Location $LaravelDir
    Write-Info "Running composer install (this may download dependencies)..."
    iex "composer install"
    if ($LASTEXITCODE -ne 0){ throw "composer install failed with exit code $LASTEXITCODE" }

    Write-Info "Generating app key"
    iex "php artisan key:generate"
    if ($LASTEXITCODE -ne 0){ throw "php artisan key:generate failed with exit code $LASTEXITCODE" }

    Write-Info "Running migrations and seeders"
    iex "php artisan migrate --seed"
    if ($LASTEXITCODE -ne 0){ throw "php artisan migrate --seed failed with exit code $LASTEXITCODE" }
    Write-Ok "Migrations and seeders finished"

    Write-Info "Setup complete. To run the app: php artisan serve (inside $LaravelDir)"
    Pop-Location
    Pop-Location
} Catch {
    Write-Err "Setup failed: $($_.Exception.Message)"
    Write-Err "StackTrace: $($_.Exception.StackTrace)"
    Pop-Location -ErrorAction SilentlyContinue
}

Write-Ok "Script finished"
