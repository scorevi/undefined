#!/bin/bash

echo "=========================================="
echo "    Starting Docker Development"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo
echo -e "${YELLOW}Starting Docker containers...${NC}"
if ! docker-compose up -d; then
    echo -e "${RED}❌ Failed to start Docker containers${NC}"
    echo "Make sure Docker is running"
    exit 1
fi

echo -e "${GREEN}✓ Docker containers started successfully${NC}"

echo
echo "=========================================="
echo "    Docker Services Running"
echo "=========================================="
echo
echo "Your application is available at:"
echo -e "${GREEN}  - Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}  - Backend API: http://localhost:8000${NC}"
echo -e "${GREEN}  - Database: localhost:3306${NC}"
echo
echo "Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo
