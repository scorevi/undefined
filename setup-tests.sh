#!/bin/bash

# Test Environment Setup Script
echo "🚀 Setting up test environment for Scorevi Blog..."

# Check if PHP is available
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed or not in PATH"
    exit 1
fi

# Check if Composer is available
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed or not in PATH"
    exit 1
fi

echo "✅ PHP and Composer found"

# Install dependencies if vendor directory doesn't exist
if [ ! -d "vendor" ]; then
    echo "📦 Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Check if .env file exists, if not copy from .env.example
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📄 Creating .env file from .env.example..."
        cp .env.example .env
    else
        echo "⚠️  No .env.example file found. Creating basic .env file..."
        cat > .env << EOL
APP_NAME=Laravel
APP_ENV=testing
APP_KEY=base64:$(php -r "echo base64_encode(random_bytes(32));")
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=:memory:

BROADCAST_DRIVER=log
CACHE_DRIVER=array
FILESYSTEM_DRIVER=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=array
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=array
EOL
    fi
fi

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Generating application key..."
    php artisan key:generate --ansi
fi

# Create database directory if using SQLite
if grep -q "DB_CONNECTION=sqlite" .env; then
    DB_PATH=$(grep "DB_DATABASE=" .env | cut -d'=' -f2)
    if [ "$DB_PATH" != ":memory:" ] && [ ! -f "$DB_PATH" ]; then
        echo "📊 Creating SQLite database..."
        mkdir -p $(dirname "$DB_PATH")
        touch "$DB_PATH"
    fi
fi

# Clear cache
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run migrations for testing
echo "📊 Running database migrations..."
php artisan migrate:fresh --seed --force

echo "✅ Test environment setup complete!"
echo ""
echo "🧪 You can now run tests using:"
echo "   php artisan test"
echo "   php artisan test:comprehensive"
echo "   vendor/bin/phpunit"
echo ""
echo "📊 For detailed test results with coverage:"
echo "   php artisan test:comprehensive --coverage"
