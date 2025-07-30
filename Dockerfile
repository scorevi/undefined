FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm \
    bash \
    vim \
    nano \
    procps \
    htop

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents (excluding problematic symlinks)
COPY --chown=www-data:www-data . /var/www

# Remove Windows-specific storage symlink if it exists
RUN rm -f /var/www/public/storage

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node.js dependencies and build assets
RUN npm ci && npm run build

# Create Laravel storage directories if they don't exist
RUN mkdir -p /var/www/storage/app/public

# Copy and set permissions for startup script
COPY docker/scripts/start-laravel.sh /usr/local/bin/start-laravel.sh
RUN chmod +x /usr/local/bin/start-laravel.sh

# Create a development user with proper shell access
RUN groupadd -g 1000 laravel && \
    useradd -u 1000 -g laravel -m -s /bin/bash laravel && \
    usermod -a -G www-data laravel

# Set proper ownership for development
# Laravel user owns the files, but www-data group has access for web server
RUN chown -R laravel:www-data /var/www && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# For development, we'll run as the laravel user instead of www-data
# This allows for proper terminal access in VS Code
USER laravel

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["/usr/local/bin/start-laravel.sh"]
