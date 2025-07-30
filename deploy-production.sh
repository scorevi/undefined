#!/bin/bash

# Production deployment script for ScoreVI
echo "Starting production deployment..."

# Stop any running containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Build and start production containers
echo "Building and starting production containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 15

# Run Laravel production setup
echo "Running Laravel production setup..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app bash -c "
    php artisan storage:link &&
    php artisan config:cache &&
    php artisan route:cache &&
    php artisan view:cache &&
    php artisan migrate --force &&
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public/storage
"

echo "Production deployment completed!"
echo "Application should be available at http://localhost"
