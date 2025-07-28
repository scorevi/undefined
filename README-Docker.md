# Laravel Docker Setup

This project has been containerized using Docker for easy development and deployment.

## 🐳 Docker Architecture

The application uses a multi-container setup:

- **Laravel App** (`app`) - PHP 8.2 with Laravel framework
- **Nginx** (`nginx`) - Web server for serving the application
- **MySQL** (`db`) - Database server
- **Redis** (`redis`) - Cache and session storage
- **Node.js** (`node`) - For building frontend assets (development only)

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose

### Setup Instructions

1. **Clone and navigate to the project:**
   ```bash
   cd your-laravel-project
   ```

2. **Run the setup script:**
   ```bash
   chmod +x docker-setup.sh
   ./docker-setup.sh
   ```

   Or manually:
   ```bash
   # Copy environment file
   cp docker/.env.example .env
   
   # Build and start containers
   docker-compose up -d --build
   
   # Run Laravel setup
   docker-compose exec app php artisan key:generate
   docker-compose exec app php artisan migrate --force
   ```

3. **Access your application:**
   - Main app: http://localhost:8000
   - Database: localhost:3306
   - Redis: localhost:6379

## 📋 Available Commands

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f db

# Rebuild containers
docker-compose up -d --build

# Access container shell
docker-compose exec app bash
docker-compose exec db mysql -u root -p
```

### Laravel Commands
```bash
# Run artisan commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan make:controller ExampleController
docker-compose exec app php artisan cache:clear

# Install dependencies
docker-compose exec app composer install
docker-compose exec app composer update

# Frontend development
docker-compose exec node npm install
docker-compose exec node npm run dev
docker-compose exec node npm run build
```

## 🔧 Configuration

### Environment Variables
The main configuration is in `.env` file. Key variables for Docker:

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

APP_URL=http://localhost:8000
```

### Database
- **Host**: `db` (container name)
- **Port**: 3306
- **Database**: laravel
- **Username**: laravel
- **Password**: secret

### Redis
- **Host**: `redis` (container name)
- **Port**: 6379

## 🛠️ Development

### Adding New Dependencies
```bash
# PHP dependencies
docker-compose exec app composer require package-name

# Node.js dependencies
docker-compose exec node npm install package-name
```

### Database Migrations
```bash
# Run migrations
docker-compose exec app php artisan migrate

# Rollback migrations
docker-compose exec app php artisan migrate:rollback

# Seed database
docker-compose exec app php artisan db:seed
```

### File Permissions
If you encounter permission issues:
```bash
docker-compose exec app chown -R www-data:www-data /var/www/storage
docker-compose exec app chown -R www-data:www-data /var/www/bootstrap/cache
```

## 🚀 Production Deployment

For production, consider:

1. **Environment-specific configuration:**
   ```bash
   # Create production compose file
   cp docker-compose.yml docker-compose.prod.yml
   ```

2. **Security considerations:**
   - Change default passwords
   - Use environment variables for secrets
   - Enable HTTPS
   - Configure proper file permissions

3. **Performance optimizations:**
   - Use Redis for caching
   - Configure proper PHP settings
   - Enable OPcache
   - Use CDN for static assets

## 📁 Project Structure

```
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   └── php/
│       └── local.ini
├── docker-compose.yml
├── docker-compose.override.yml
├── Dockerfile
├── .dockerignore
└── docker-setup.sh
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Change ports in `docker-compose.yml`
   - Check if ports 8000, 3306, 6379 are available

2. **Permission errors:**
   ```bash
   docker-compose exec app chmod -R 775 storage
   docker-compose exec app chmod -R 775 bootstrap/cache
   ```

3. **Database connection issues:**
   - Ensure MySQL container is running
   - Check environment variables
   - Verify network connectivity

4. **Asset build issues:**
   ```bash
   docker-compose exec node npm install
   docker-compose exec node npm run build
   ```

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs nginx
docker-compose logs db
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/) 