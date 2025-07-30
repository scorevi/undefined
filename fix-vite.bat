@echo off
echo Fixing Vite development environment...

echo.
echo [1/4] Cleaning up platform-specific dependencies...
if exist "node_modules" (
    echo Removing existing node_modules...
    rmdir /s /q "node_modules" 2>nul
)
if exist "package-lock.json" (
    echo Removing package-lock.json...
    del "package-lock.json" 2>nul
)
echo ✓ Cleanup completed

echo.
echo [2/4] Installing Node dependencies with correct platform binaries...
npm install
if %errorlevel% neq 0 (
    echo ❌ NPM install failed - check for platform-specific dependency conflicts
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully

echo.
echo [3/4] Setting up environment file...
if not exist .env (
    copy .env.local .env
    echo ✓ Environment file created
) else (
    echo ✓ Environment file already exists
)

echo.
echo [4/4] Starting Vite development server...
echo Frontend will be available at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
npx vite

pause
