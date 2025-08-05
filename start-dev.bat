@echo off
echo ==========================================
echo    Starting Local Development Servers
echo ==========================================

echo.
echo Starting Laravel development server...
start "Laravel Server" cmd /k "php artisan serve"

echo.
echo Waiting 3 seconds for Laravel server to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Vite development server...
start "Vite Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo    Development Servers Started!
echo ==========================================
echo.
echo Your application is now running:
echo   - Backend API: http://localhost:8000
echo   - Frontend: http://localhost:5173
echo.
echo Press any key to continue or close this window...
pause >nul
