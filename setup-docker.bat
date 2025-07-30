@echo off
echo ==========================================
echo    Docker Development Setup
echo ==========================================

echo.
echo [1/5] Copying Docker environment file...
copy .env.docker .env
echo ✓ .env file created from .env.docker

echo.
echo [2/5] Creating storage directories...
if not exist "storage\framework\sessions" mkdir "storage\framework\sessions"
if not exist "storage\framework\views" mkdir "storage\framework\views"
if not exist "storage\framework\cache" mkdir "storage\framework\cache"
if not exist "storage\logs" mkdir "storage\logs"
echo ✓ Storage directories created

echo.
echo [3/5] Building and starting Docker containers...
docker-compose down
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo ❌ Docker setup failed
    pause
    exit /b 1
)
echo ✓ Docker containers started

echo.
echo [4/5] Waiting for services to be ready...
timeout /t 30 /nobreak > nul
echo ✓ Services should be ready

echo.
echo [5/5] Running Laravel setup inside container...
docker-compose exec app php artisan key:generate --force
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan migrate --seed --force
docker-compose exec app php artisan storage:link
echo ✓ Laravel setup completed

echo.
echo ==========================================
echo    Docker Setup Complete!
echo ==========================================
echo.
echo Your application is now running:
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:8000
echo   - Database: localhost:3306
echo.
echo To stop containers: docker-compose down
echo To view logs: docker-compose logs -f
echo To restart: docker-compose restart
echo.
pause
