# Undefined - Blog Platform

A modern blog platform built with Laravel and React.

## 🚀 Quick Start

> **📖 For detailed setup instructions, see [DEVELOPMENT.md](DEVELOPMENT.md)**

### Local Development Setup

**Prerequisites:** PHP 8.2+, Composer, Node.js 18+

```bash
git clone https://github.com/scorevi/undefined.git
cd undefined

# Windows
setup-local.bat

# Linux/Mac
./setup-local.sh
```

**Access**: http://localhost:8000 (Backend) • http://localhost:5173 (Frontend)
## 🛠️ Manual Development Setup

If you prefer manual setup:

```bash
# Backend setup
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# Frontend setup
npm install

# Start development servers
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server  
npm run dev
```

**Access**: http://localhost:8000 (Laravel) + http://localhost:5173 (Vite HMR)

## ✨ Features

- User Authentication & Management
- Blog Posts with Categories
- Comments & Like System  
- Admin Dashboard
- Responsive Design (Tailwind CSS)
- File Upload Support

## 🛠️ Development Commands

```bash
# Laravel commands
php artisan migrate:fresh --seed  # Reset database
php artisan tinker                # Laravel REPL
php artisan make:controller UserController  # Generate controller
php artisan make:model Post -mcr  # Generate model with migration, controller, resource

# Frontend commands
npm run build                     # Build for production
npm run preview                   # Preview production build
npm run lint                      # Lint frontend code
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
