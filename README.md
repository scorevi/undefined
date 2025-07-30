# Undefined - Blog Platform

A modern blog platform built with Laravel, React, and Docker.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Run the Application

```bash
git clone https://github.com/scorevi/undefined.git
cd undefined
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Access**: http://localhost:8000

### Stop Services
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## 🐳 Docker Hub

```bash
# Pull from Docker Hub
docker pull seancaintic/undefined-app:latest
```

*Note: Docker Hub image requires full stack setup above for web server and database.*

## ✨ Features

- User Authentication & Management
- Blog Posts with Categories
- Comments & Like System  
- Admin Dashboard
- Responsive Design (Tailwind CSS)
- File Upload Support

## 🛠️ Development

```bash
# Alternative setup
start-all.bat  # Windows
./docker-setup.sh  # Linux/Mac

# Manual setup
cp .env.example .env
docker-compose up -d
docker-compose exec app bash
composer install && npm install
php artisan key:generate && php artisan migrate --seed
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
