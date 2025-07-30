@echo off
echo ==========================================
echo    Local Development Setup
echo ==========================================

echo.
echo [1/6] Copying environment file...
if not exist .env (
    copy .env.local .env
    echo ✓ .env file created from .env.local
) else (
    echo ✓ .env file already exists
)

echo.
echo [2/6] Installing PHP dependencies...
composer install --no-interaction --prefer-dist --optimize-autoloader
if %errorlevel% neq 0 (
    echo ❌ Composer install failed
    pause
    exit /b 1
)
echo ✓ PHP dependencies installed

echo.
echo [3/6] Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ NPM install failed
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed

echo.
echo [4/6] Setting up application key...
php artisan key:generate --ansi
echo ✓ Application key generated

echo.
echo [5/6] Setting up database...
if not exist "database\database.sqlite" (
    type nul > "database\database.sqlite"
    echo ✓ SQLite database file created
)

php artisan migrate --seed --force
if %errorlevel% neq 0 (
    echo ❌ Database migration failed
    pause
    exit /b 1
)
echo ✓ Database migrated and seeded

echo.
echo [6/6] Creating storage link...
php artisan storage:link
echo ✓ Storage link created

echo.
echo ==========================================
echo    Setup Complete!
echo ==========================================
echo.
echo To start development servers:
echo   - Run: start-dev.bat
echo   - Or manually:
echo     • Backend: php artisan serve
echo     • Frontend: npm run dev
echo.
echo Access your application at:
echo   - Backend API: http://localhost:8000
echo   - Frontend: http://localhost:5173
echo.
pause
