# Windows Development Troubleshooting Guide

## Common Issues and Solutions

### 1. "vite is not recognized as internal or external command"

**Cause**: Missing node_modules or platform-specific dependency conflicts

**Solutions**:
```bash
# Quick fix
./fix-vite.bat

# Or manual fix
npm run fresh-install
npm run dev
```

### 2. Platform-specific Rollup dependency errors

**Error**: `npm error notsup Unsupported platform for @rollup/rollup-linux-x64-gnu`

**Solution**: 
```bash
# Clean install to get correct platform binaries
npm run clean
npm install
```

### 3. Permission errors with storage directories

**Solution**:
```bash
# Ensure storage directories exist and are writable
php artisan storage:link
# If issues persist, manually create directories in storage/
```

### 4. Port conflicts

**Symptoms**: "Port 5173 is already in use" or "Port 8000 is already in use"

**Solutions**:
```bash
# Kill processes using the ports
netstat -ano | findstr :5173
netstat -ano | findstr :8000
# Then kill the process with: taskkill /PID <PID_NUMBER> /F

# Or change ports in .env:
# VITE_DEV_SERVER_PORT=5174
```

### 5. Database connection issues

**For SQLite** (default):
```bash
# Ensure SQLite file exists
type nul > database/database.sqlite
php artisan migrate --seed
```

**For MySQL**:
```bash
# Update .env with correct database credentials
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Composer dependency issues

**Solution**:
```bash
# Clear Composer cache and reinstall
composer clear-cache
composer install --no-cache
```

### 7. Node.js version compatibility

**Check version**:
```bash
node --version  # Should be 18+ 
npm --version   # Should be 9+
```

**Upgrade if needed**: Download from [nodejs.org](https://nodejs.org/)

### 8. Environment file issues

**Missing .env**:
```bash
copy .env.local .env
php artisan key:generate
```

**Wrong environment**:
- Use `.env.local` for local development
- Use `.env.docker` for Docker development

### 9. Build/compilation errors

**Clear caches**:
```bash
# Laravel caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Vite cache
npm run dev -- --force
```

### 10. Hot reloading not working

**Solutions**:
1. Check if Vite dev server is running (http://localhost:5173)
2. Ensure proxy settings in `vite.config.js` are correct
3. Try hard refresh (Ctrl+F5) in browser
4. Restart Vite server

## Quick Commands Reference

```bash
# Fresh start everything
./fix-vite.bat

# Or step by step
npm run fresh-install     # Clean install dependencies
copy .env.local .env      # Setup environment
php artisan key:generate  # Generate app key
php artisan migrate       # Setup database
npm run dev              # Start frontend
# In another terminal:
php artisan serve        # Start backend

# Check if services are running
netstat -ano | findstr :5173  # Vite dev server
netstat -ano | findstr :8000  # Laravel server
```

## Getting Help

1. **Check logs**: Look for errors in terminal output
2. **Browser Console**: Check for JavaScript errors (F12)
3. **Laravel Logs**: Check `storage/logs/laravel.log`
4. **Vite Logs**: Look at terminal where `npm run dev` is running

## Performance Tips

1. **Exclude directories from Windows Defender**: Add project folder to exclusions
2. **Use SSD**: Store project on SSD for faster file operations
3. **Close unnecessary programs**: Free up RAM and CPU
4. **Use WSL2**: Consider Windows Subsystem for Linux for better performance
