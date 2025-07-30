@echo off
REM Test Environment Setup Script for Windows
echo 🚀 Setting up test environment for Scorevi Blog...

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Composer is available
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Composer is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ PHP and Composer found

REM Install dependencies if vendor directory doesn't exist
if not exist "vendor" (
    echo 📦 Installing Composer dependencies...
    composer install --no-interaction --prefer-dist --optimize-autoloader
)

REM Check if .env file exists, if not copy from .env.example
if not exist ".env" (
    if exist ".env.example" (
        echo 📄 Creating .env file from .env.example...
        copy ".env.example" ".env"
    ) else (
        echo ⚠️  No .env.example file found. Creating basic .env file...
        (
        echo APP_NAME=Laravel
        echo APP_ENV=testing
        echo APP_KEY=
        echo APP_DEBUG=true
        echo APP_URL=http://localhost
        echo.
        echo LOG_CHANNEL=stack
        echo LOG_DEPRECATIONS_CHANNEL=null
        echo LOG_LEVEL=debug
        echo.
        echo DB_CONNECTION=sqlite
        echo DB_DATABASE=:memory:
        echo.
        echo BROADCAST_DRIVER=log
        echo CACHE_DRIVER=array
        echo FILESYSTEM_DRIVER=local
        echo QUEUE_CONNECTION=sync
        echo SESSION_DRIVER=array
        echo SESSION_LIFETIME=120
        echo.
        echo REDIS_HOST=127.0.0.1
        echo REDIS_PASSWORD=null
        echo REDIS_PORT=6379
        echo.
        echo MAIL_MAILER=array
        ) > .env
    )
)

REM Generate application key if not set
findstr /C:"APP_KEY=base64:" .env >nul
if %errorlevel% neq 0 (
    echo 🔑 Generating application key...
    php artisan key:generate --ansi
)

REM Clear cache
echo 🧹 Clearing caches...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

REM Run migrations for testing
echo 📊 Running database migrations...
php artisan migrate:fresh --seed --force

echo ✅ Test environment setup complete!
echo.
echo 🧪 You can now run tests using:
echo    php artisan test
echo    php artisan test:comprehensive
echo    vendor\bin\phpunit
echo.
echo 📊 For detailed test results with coverage:
echo    php artisan test:comprehensive --coverage

pause
