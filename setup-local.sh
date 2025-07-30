#!/bin/bash

echo "=========================================="
echo "    Local Development Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo
echo -e "${YELLOW}[1/6] Copying environment file...${NC}"
if [ ! -f .env ]; then
    cp .env.local .env
    echo -e "${GREEN}✓ .env file created from .env.local${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo
echo -e "${YELLOW}[2/6] Installing PHP dependencies...${NC}"
if ! composer install --no-interaction --prefer-dist --optimize-autoloader; then
    echo -e "${RED}❌ Composer install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PHP dependencies installed${NC}"

echo
echo -e "${YELLOW}[3/6] Installing Node.js dependencies...${NC}"
if ! npm install; then
    echo -e "${RED}❌ NPM install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js dependencies installed${NC}"

echo
echo -e "${YELLOW}[4/6] Setting up application key...${NC}"
php artisan key:generate --ansi
echo -e "${GREEN}✓ Application key generated${NC}"

echo
echo -e "${YELLOW}[5/6] Setting up database...${NC}"
if [ ! -f "database/database.sqlite" ]; then
    touch "database/database.sqlite"
    echo -e "${GREEN}✓ SQLite database file created${NC}"
fi

if ! php artisan migrate --seed --force; then
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Database migrated and seeded${NC}"

echo
echo -e "${YELLOW}[6/6] Creating storage link...${NC}"
php artisan storage:link
echo -e "${GREEN}✓ Storage link created${NC}"

echo
echo "=========================================="
echo "    Setup Complete!"
echo "=========================================="
echo
echo "To start development servers:"
echo "  - Run: ./start-all.sh"
echo "  - Or manually:"
echo "    • Backend: php artisan serve"
echo "    • Frontend: npm run dev"
echo
echo "Access your application at:"
echo "  - Backend API: http://localhost:8000"
echo "  - Frontend: http://localhost:5173"
echo
