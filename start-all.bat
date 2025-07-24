@echo off
REM Start Laravel backend
start cmd /k "php artisan serve"
REM Start Vite frontend
start cmd /k "npm run dev"