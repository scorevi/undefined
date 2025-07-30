@echo off
echo ==========================================
echo    Starting Local Development Servers
echo ==========================================

echo.
echo Starting Laravel backend server...
start "Laravel Backend" cmd /k "echo Laravel Backend Server && php artisan serve"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Vite frontend server...
start "Vite Frontend" cmd /k "echo Vite Frontend Server && npm run dev"

echo.
echo ==========================================
echo    Development Servers Starting...
echo ==========================================
echo.
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to continue...
pause > nul
