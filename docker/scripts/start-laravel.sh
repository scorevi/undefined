#!/bin/bash

# Laravel startup script for Docker container
echo "Starting Laravel container setup..."

# Create storage link if it doesn't exist
if [ ! -L "/var/www/public/storage" ]; then
    echo "Creating storage symlink..."
    php artisan storage:link
fi

# Ensure proper permissions
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Start PHP-FPM
echo "Starting PHP-FPM..."
exec php-fpm
