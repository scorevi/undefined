#!/bin/bash

echo "🚀 Setting up Laravel Docker environment..."

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp docker/.env.example .env
fi

# Create storage directories with proper permissions
echo "📁 Setting up storage directories..."
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Build and start containers
echo "🐳 Building and starting Docker containers..."
docker-compose up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 30

# Run Laravel setup commands
echo "🔧 Running Laravel setup commands..."
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan migrate --force

echo "✅ Setup complete! Your Laravel application is running at http://localhost:8000"
echo ""
echo "📋 Available commands:"
echo "  docker-compose up -d          # Start all services"
echo "  docker-compose down           # Stop all services"
echo "  docker-compose logs -f app    # View Laravel logs"
echo "  docker-compose exec app php artisan migrate    # Run migrations"
echo "  docker-compose exec app composer install       # Install PHP dependencies"
echo "  docker-compose exec node npm install          # Install Node.js dependencies" 