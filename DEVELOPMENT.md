# Development Environment Setup

This project supports both **Docker** and **Local** development environments. Choose the approach that best fits your workflow.

## 🐳 Docker Development (Recommended)

Docker provides a consistent development environment across all platforms and handles all dependencies automatically.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac/Linux)
- Git

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/scorevi/undefined.git
cd undefined

# Run the Docker setup script
./setup-docker.bat    # Windows
# or
./setup-docker.sh     # Linux/Mac

# Start development environment
./start-docker.bat    # Windows
# or
docker-compose up -d  # All platforms
```

### Access Points
- **Frontend (Vite + React)**: http://localhost:5173
- **Backend API (Laravel)**: http://localhost:8000
- **Database (MySQL)**: localhost:3306

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Access container shell
docker-compose exec app bash

# Run Laravel commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan tinker

# Rebuild containers (after dependency changes)
docker-compose up -d --build
```

---

## 💻 Local Development

Local development gives you direct control over all services and dependencies.

### Prerequisites
- **PHP 8.2+** with extensions: `mbstring`, `exif`, `pcntl`, `bcmath`, `gd`, `zip`, `pdo_sqlite`/`pdo_mysql`
- **Composer** (PHP package manager)
- **Node.js 18+** and **npm**
- **MySQL 8.0+** (optional, SQLite is used by default)

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/scorevi/undefined.git
cd undefined

# Run the local setup script
./setup-local.bat     # Windows
# or
./setup-local.sh      # Linux/Mac

# Start development servers
./start-all.bat       # Windows
# or
npm run start:local   # All platforms
```

### Manual Setup (Alternative)
```bash
# 1. Install dependencies
composer install
npm install

# 2. Environment setup
copy .env.local .env        # Windows
# or
cp .env.local .env          # Linux/Mac

php artisan key:generate

# 3. Database setup (SQLite - default)
touch database/database.sqlite  # Linux/Mac
# On Windows, create empty file: database/database.sqlite

php artisan migrate --seed
php artisan storage:link

# 4. Start development servers
# Terminal 1: Backend
php artisan serve

# Terminal 2: Frontend
npm run dev
```

### Access Points
- **Frontend (Vite + React)**: http://localhost:5173
- **Backend API (Laravel)**: http://localhost:8000
- **Database (SQLite)**: `database/database.sqlite`

---

## 🔧 Development Workflow

### Project Structure
```
├── app/                 # Laravel application code
├── resources/js/        # React frontend components
├── resources/css/       # Stylesheets (Tailwind CSS)
├── routes/             # API and web routes
├── database/           # Migrations, seeders, SQLite file
├── public/             # Public assets and compiled files
├── docker/             # Docker configuration files
└── .env.*              # Environment configuration files
```

### Key Configuration Files
- **`.env.local`** - Local development environment variables
- **`.env.docker`** - Docker development environment variables
- **`vite.config.js`** - Vite configuration (auto-detects environment)
- **`docker-compose.yml`** - Docker services configuration

### Making Changes
1. **Backend (Laravel/PHP)**: Edit files in `app/`, `routes/`, etc. - auto-reloaded
2. **Frontend (React)**: Edit files in `resources/js/` - hot module replacement
3. **Styles**: Edit `resources/css/app.css` - auto-compiled
4. **Database**: Create migrations with `php artisan make:migration`

### Environment Variables
The project automatically detects whether you're running in Docker or locally and adjusts configuration accordingly:

- **Vite Dev Server**: Binds to `0.0.0.0:5173` in Docker, `localhost:5173` locally
- **Database**: Uses MySQL in Docker, SQLite locally (configurable)
- **API Proxy**: Routes `/api` requests to appropriate backend URL

---

## 🚀 Switching Between Environments

You can easily switch between Docker and local development:

### From Local to Docker
```bash
# Stop local servers (Ctrl+C in terminals)
# Copy Docker environment
copy .env.docker .env        # Windows
cp .env.docker .env          # Linux/Mac

# Start Docker
docker-compose up -d
```

### From Docker to Local
```bash
# Stop Docker
docker-compose down

# Copy local environment
copy .env.local .env         # Windows
cp .env.local .env           # Linux/Mac

# Start local servers
./start-all.bat              # Windows
php artisan serve & npm run dev  # Linux/Mac
```

---

## 🛠️ Troubleshooting

### Common Issues

**"vite is not recognized" (Windows)**
```bash
# Install dependencies
npm install

# Use npx
npx vite

# Or run the full command
./node_modules/.bin/vite
```

**Database connection errors**
- **Docker**: Wait for database container to be ready (~30 seconds after first start)
- **Local**: Ensure SQLite file exists or MySQL is running

**Port conflicts**
- **5173**: Vite dev server port
- **8000**: Laravel backend port
- **3306**: MySQL port (Docker only)

Change ports in `.env` files if needed.

**Permission issues (Docker on Windows)**
```bash
# Reset file permissions
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

### Logs and Debugging
```bash
# Docker logs
docker-compose logs -f app
docker-compose logs -f nginx

# Laravel logs
tail -f storage/logs/laravel.log    # Local
docker-compose exec app tail -f storage/logs/laravel.log  # Docker

# Vite logs
# Check the terminal where you ran npm run dev
```

---

## 📦 Production Deployment

For production deployment, use the production Docker configuration:

```bash
# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

This disables development features like hot reloading and enables production optimizations.
