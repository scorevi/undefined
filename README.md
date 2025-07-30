# Undefined - Blog Platform

A modern blog platform built with Laravel, React, and Docker.

## 🚀 Quick Start

> **📖 For detailed setup instructions, see [DEVELOPMENT.md](DEVELOPMENT.md)**

### Option 1: Docker (Recommended)

**Prerequisites:** Docker Desktop and Git

```bash
git clone https://github.com/scorevi/undefined.git
cd undefined

# Windows
setup-docker.bat

# Linux/Mac
./setup-docker.sh
```

**Access**: http://localhost:5173 (Frontend) • http://localhost:8000 (API)

### Option 2: Local Development

**Prerequisites:** PHP 8.2+, Composer, Node.js 18+

```bash
git clone https://github.com/scorevi/undefined.git
cd undefined

# Windows
setup-local.bat

# Linux/Mac
./setup-local.sh
```

**Access**: http://localhost:5173 (Frontend) • http://localhost:8000 (API)
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server  
npm run dev
```

**Access**: http://localhost:8000 (Laravel) + http://localhost:5173 (Vite HMR)

## 🐳 Docker Hub

```bash
# Pull from Docker Hub
docker pull seancaintic/undefined-app:latest
```

*Note: Docker Hub image requires full stack setup above for web server and database.*

## ⚡ Development Approaches

| Method | Pros | Cons |
|--------|------|------|
| **Docker** | ✅ Consistent environment<br>✅ Includes DB/Redis<br>✅ Easy deployment | ❌ Slower startup<br>❌ Resource heavy |
| **Local** | ✅ Faster development<br>✅ Native performance<br>✅ Direct debugging | ❌ Environment differences<br>❌ Manual DB setup |

**Recommendation**: Use **Local** for development, **Docker** for deployment.

## ✨ Features

- User Authentication & Management
- Blog Posts with Categories
- Comments & Like System  
- Admin Dashboard
- Responsive Design (Tailwind CSS)
- File Upload Support

## 🛠️ Development Commands

### Docker Development
```bash
# Alternative Docker setup
start-all.bat  # Windows
./docker-setup.sh  # Linux/Mac

# Manual Docker setup
docker-compose up -d
docker-compose exec app composer install
docker-compose exec app npm install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --seed
docker-compose exec app npm run dev  # In container
```

### Local Development
```bash
# Install/update dependencies
composer install
npm install

# Laravel commands
php artisan migrate:fresh --seed
php artisan cache:clear
php artisan config:clear

# Asset building
npm run dev    # Development with HMR
npm run build  # Production build
npm run watch  # Watch for changes

# Testing
php artisan test
```

## 📁 Project Structure

```
├── app/           # Laravel application
├── resources/js/  # React components  
├── docker/        # Docker configuration
└── database/      # Migrations & seeders
```

## 🔧 Key Commands

```bash
# Laravel
php artisan posts:cleanup-non-admin
php artisan cache:clear

# Assets
npm run dev    # Development
npm run build  # Production
```

---

**Team**: Erika, Noelle, and Khyle | **License**: MIT
