#!/bin/bash

echo "=========================================="
echo "    Docker Development Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo
echo -e "${YELLOW}[1/5] Copying Docker environment file...${NC}"
cp .env.docker .env
echo -e "${GREEN}✓ .env file created from .env.docker${NC}"

echo
echo -e "${YELLOW}[2/5] Creating storage directories...${NC}"
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
echo -e "${GREEN}✓ Storage directories created${NC}"

echo
echo -e "${YELLOW}[3/5] Building and starting Docker containers...${NC}"
docker-compose down
if ! docker-compose up -d --build; then
    echo -e "${RED}❌ Docker setup failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker containers started${NC}"

echo
echo -e "${YELLOW}[4/5] Waiting for services to be ready...${NC}"
sleep 30
echo -e "${GREEN}✓ Services should be ready${NC}"

echo
echo -e "${YELLOW}[5/5] Running Laravel setup inside container...${NC}"
docker-compose exec app php artisan key:generate --force
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan migrate --seed --force
docker-compose exec app php artisan storage:link
echo -e "${GREEN}✓ Laravel setup completed${NC}"

echo
echo "=========================================="
echo "    Docker Setup Complete!"
echo "=========================================="
echo
echo "Your application is now running:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend API: http://localhost:8000"
echo "  - Database: localhost:3306"
echo
echo "To stop containers: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo "To restart: docker-compose restart"
echo
