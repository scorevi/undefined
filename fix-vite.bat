@echo off
echo Fixing Vite development environment...

echo.
echo [1/3] Ensuring Node dependencies are installed...
npm install
if %errorlevel% neq 0 (
    echo ❌ NPM install failed
    pause
    exit /b 1
)

echo.
echo [2/3] Setting up environment file...
if not exist .env (
    copy .env.local .env
    echo ✓ Environment file created
) else (
    echo ✓ Environment file already exists
)

echo.
echo [3/3] Starting Vite development server...
npx vite

pause
