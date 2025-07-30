# ScoreVI - Blog Platform

A modern blog platform built with Laravel, React, and Docker by Erika, Noelle, and Khyle.

## Features

- **User Authentication**: Registration, login, and user management
- **Blog Posts**: Create, edit, and delete blog posts with categories
- **Comments System**: Users can comment on posts
- **Like System**: Users can like posts and comments
- **Admin Dashboard**: Administrative interface for content management
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **File Uploads**: Image upload support for posts
- **Docker Support**: Easy deployment with Docker containers

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Git

### Quick Start (Development)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scorevi
   ```

2. **Start development environment**
   ```bash
   # Windows
   start-all.bat
   
   # Linux/Mac
   ./docker-setup.sh
   ```

3. **Access the application**
   - Website: http://localhost:8000
   - Admin Dashboard: http://localhost:8000/admin

### Manual Development Setup

1. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

2. **Start Docker containers**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies and setup**
   ```bash
   docker-compose exec app bash
   composer install
   npm install
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   npm run dev
   ```

## Production Deployment

### Prerequisites

- Docker and Docker Compose
- Domain name (optional)
- SSL certificate (recommended)

### Production Setup

1. **Prepare environment file**
   ```bash
   cp .env.production .env
   ```
   
2. **Update environment variables**
   - Set `APP_KEY` using `php artisan key:generate`
   - Configure database credentials
   - Set your domain in `APP_URL`
   - Configure mail settings if needed

3. **Deploy to production**
   ```bash
   # Windows
   deploy-production.bat
   
   # Linux/Mac
   chmod +x deploy-production.sh
   ./deploy-production.sh
   ```

4. **Access your application**
   - Production site will be available at http://localhost (or your configured domain)

### Manual Production Deployment

```bash
# Stop development containers
docker-compose down

# Start production containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Setup Laravel for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app bash -c "
    php artisan config:cache &&
    php artisan route:cache &&
    php artisan view:cache &&
    php artisan migrate --force &&
    php artisan storage:link
"

# Build production assets
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec app bash -c "
    npm ci --only=production &&
    npm run build
"
```

## Project Structure

```
├── app/                    # Laravel application code
│   ├── Console/           # Artisan commands
│   ├── Http/              # Controllers and middleware
│   └── Models/            # Eloquent models
├── database/              # Database migrations and seeders
├── docker/                # Docker configuration files
├── resources/             # Frontend assets and views
│   ├── js/               # React components
│   └── css/              # Stylesheets
├── routes/                # Laravel routes
├── public/                # Public web assets
└── storage/               # File storage
```

## Available Commands

### Laravel Artisan Commands

```bash
# Clean up non-admin posts (with confirmation)
docker-compose exec app php artisan posts:cleanup-non-admin --dry-run
docker-compose exec app php artisan posts:cleanup-non-admin

# Generate application key
docker-compose exec app php artisan key:generate

# Run database migrations
docker-compose exec app php artisan migrate

# Clear application caches
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

### Development Commands

```bash
# Install PHP dependencies
docker-compose exec app composer install

# Install Node.js dependencies
docker-compose exec app npm install

# Build assets for development
docker-compose exec app npm run dev

# Build assets for production
docker-compose exec app npm run build

# Watch for changes (development)
docker-compose exec app npm run dev
```

## Environment Variables

Key environment variables for production:

```env
APP_NAME=ScoreVI
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=db
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secure_password

LOG_LEVEL=error
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=your-domain.com
```

## Security Considerations

- Change default database passwords in production
- Use HTTPS in production (set `SESSION_SECURE_COOKIE=true`)
- Set strong passwords for database users
- Regularly update dependencies
- Enable proper firewall rules
- Use environment-specific configuration files

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Development Team**: Erika, Noelle, and Khyle
