# Local Development Setup

This project is now configured to run locally without Docker using SQLite as the database.

## Quick Start

1. **Setup the project for local development:**
   ```bash
   setup-local.bat
   ```

2. **Start development servers:**
   ```bash
   start-dev.bat
   ```

## Manual Setup (if needed)

If you prefer to set up manually:

1. **Configure environment:**
   ```bash
   copy .env.local .env
   ```

2. **Install dependencies:**
   ```bash
   php composer.phar install
   npm install
   ```

3. **Set up database:**
   ```bash
   # Create SQLite database file
   echo. > database\database.sqlite
   
   # Run migrations and seeders
   php artisan migrate --seed
   ```

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Create storage link:**
   ```bash
   php artisan storage:link
   ```

6. **Start servers:**
   ```bash
   # Backend (Laravel)
   php artisan serve
   
   # Frontend (Vite) - in another terminal
   npm run dev
   ```

## Access URLs

- **Backend API:** http://localhost:8000
- **Frontend:** http://localhost:5173

## Database

The project uses SQLite for local development, stored in `database/database.sqlite`. This eliminates the need for MySQL setup and makes the project portable.

## Environment Configuration

The `.env.local` file is configured for local development with:
- SQLite database
- Local mail logging
- Debug mode enabled
- Vite development server settings

## Switching to MySQL (Optional)

If you prefer MySQL for local development, update your `.env` file:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

Make sure you have MySQL installed and running locally.
