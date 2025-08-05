# Development Environment Setup

This project is configured for **Local Development** with SQLite as the database for simplicity and portability.

## � Local Development Setup

### Prerequisites
- **PHP 8.2+** with extensions: `sqlite3`, `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`
- **Composer** (PHP package manager)
- **Node.js 18+** and **npm**
- **Git**

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/scorevi/undefined.git
cd undefined

# Run the local setup script
./setup-local.bat    # Windows
# or
./setup-local.sh     # Linux/Mac

# Start development servers
./start-dev.bat      # Windows (starts both Laravel and Vite)
# or manually:
php artisan serve    # Terminal 1 (Laravel backend)
npm run dev          # Terminal 2 (Vite frontend)
```

### Access Points
- **Frontend (Vite + React)**: http://localhost:5173
- **Backend API (Laravel)**: http://localhost:8000
- **Database**: SQLite file at `database/database.sqlite`

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
./start-dev.bat      # Windows (starts both Laravel and Vite)
# or manually:
php artisan serve    # Terminal 1 (Laravel backend)
npm run dev          # Terminal 2 (Vite frontend)
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
└── .env.*              # Environment configuration files
```

### Key Configuration Files
- **`.env.local`** - Local development environment variables
- **`vite.config.js`** - Vite configuration for frontend build
- **`composer.json`** - PHP dependencies
- **`package.json`** - Node.js dependencies

### Making Changes
1. **Backend (Laravel/PHP)**: Edit files in `app/`, `routes/`, etc. - auto-reloaded with `php artisan serve`
2. **Frontend (React)**: Edit files in `resources/js/` - hot module replacement with `npm run dev`
3. **Styles**: Edit `resources/css/app.css` - auto-compiled with Tailwind CSS
4. **Database**: Create migrations with `php artisan make:migration`

### Environment Variables
The project automatically detects whether you're running in Docker or locally and adjusts configuration accordingly:

- **Vite Dev Server**: Binds to `0.0.0.0:5173` in Docker, `localhost:5173` locally
### Environment Configuration
- **Database**: Uses SQLite for local development (portable and simple)
- **Hot Reload**: Both backend and frontend support hot reloading
- **API Proxy**: Vite automatically proxies `/api` requests to Laravel backend

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
- Ensure SQLite file exists: `database/database.sqlite`
- Run migrations: `php artisan migrate --seed`
- Check `.env` file uses correct database configuration

**Port conflicts**
- **5173**: Vite dev server port
- **8000**: Laravel backend port

**Composer not found**
- Use local composer: `php composer.phar install`
- Or install Composer globally: https://getcomposer.org/

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

For production deployment:

```bash
# Build frontend assets
npm run build

# Optimize backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set up production environment
cp .env.production .env
php artisan key:generate
php artisan migrate --force
```

This disables development features and enables production optimizations.
