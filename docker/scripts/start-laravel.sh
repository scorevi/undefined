#!/bin/bash

# Laravel startup script for Docker container
echo "Starting Laravel container setup..."

# Wait for database to be available
echo "Waiting for database connection..."
until php artisan migrate:status >/dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 2
done

# Create storage link if it doesn't exist
if [ ! -L "/var/www/public/storage" ]; then
    echo "Creating storage symlink..."
    php artisan storage:link
fi

# Ensure proper permissions for development
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Check if we're in development mode (if node_modules exists and we have dev dependencies)
if [ -d "/var/www/node_modules" ] && [ "$APP_ENV" = "local" ]; then
    echo "Development mode detected..."
    
    # Start Vite dev server in background
    echo "Starting Vite dev server..."
    npm run dev &
    VITE_PID=$!
    
    # Function to handle shutdown
    shutdown() {
        echo "Shutting down services..."
        kill $VITE_PID 2>/dev/null || true
        exit 0
    }
    
    trap shutdown SIGTERM SIGINT
    
    echo "Starting PHP-FPM..."
    php-fpm &
    PHP_FPM_PID=$!
    
    # Wait for either process to exit
    wait $PHP_FPM_PID
else
    echo "Production mode - starting PHP-FPM only..."
    exec php-fpm
fi
