@echo off
echo ==========================================
echo    Starting Docker Development
echo ==========================================

echo.
echo Starting Docker containers...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ❌ Failed to start Docker containers
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)

echo ✓ Docker containers started successfully

echo.
echo ==========================================
echo    Docker Services Running
echo ==========================================
echo.
echo Your application is available at:
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:8000
echo   - Database: localhost:3306
echo.
echo Useful commands:
echo   - View logs: docker-compose logs -f
echo   - Stop services: docker-compose down
echo   - Restart services: docker-compose restart
echo.
echo Press any key to continue...
pause > nul
