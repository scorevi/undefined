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
