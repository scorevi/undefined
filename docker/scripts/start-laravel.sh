#!/bin/bash

# Laravel startup script for Docker container
echo "Starting Laravel container setup..."

# Create storage link if it doesn't exist
if [ ! -L "/var/www/public/storage" ]; then
    echo "Creating storage symlink..."
    php artisan storage:link
fi

# Ensure proper permissions for development
# Files are already owned by laravel:www-data from Dockerfile
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
