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

# Create Laravel user and group
RUN groupadd -g 1000 laravel && \
    useradd -u 1000 -g laravel -m -s /bin/bash laravel && \
    usermod -a -G www-data laravel

# Copy existing application directory contents
COPY --chown=laravel:www-data . /var/www

# Remove Windows-specific storage symlink if it exists
RUN rm -f /var/www/public/storage

# Create Laravel storage directories if they don't exist
RUN mkdir -p /var/www/storage/framework/{sessions,views,cache} \
    /var/www/storage/logs \
    /var/www/storage/app/public

# Set proper permissions
RUN chown -R laravel:www-data /var/www && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Switch to laravel user for dependency installation
USER laravel

# Install PHP dependencies
RUN composer install --optimize-autoloader

# Install Node.js dependencies (don't build in development)
RUN npm ci

# Copy startup script and set permissions (as root)
USER root
COPY docker/scripts/start-laravel.sh /usr/local/bin/start-laravel.sh
RUN chmod +x /usr/local/bin/start-laravel.sh

# Switch back to laravel user for runtime
USER laravel

# Expose ports
EXPOSE 9000 5173

# Start the application
CMD ["/usr/local/bin/start-laravel.sh"]
