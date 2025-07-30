#!/bin/bash

echo "=========================================="
echo "    Starting Local Development Servers"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo
echo -e "${YELLOW}Starting Laravel backend server...${NC}"
php artisan serve &
LARAVEL_PID=$!

echo
echo -e "${YELLOW}Waiting 3 seconds for backend to start...${NC}"
sleep 3

echo
echo -e "${YELLOW}Starting Vite frontend server...${NC}"
npm run dev &
VITE_PID=$!

# Function to handle shutdown
shutdown() {
    echo
    echo -e "${YELLOW}Shutting down development servers...${NC}"
    kill $LARAVEL_PID 2>/dev/null || true
    kill $VITE_PID 2>/dev/null || true
    exit 0
}

trap shutdown SIGTERM SIGINT

echo
echo "=========================================="
echo "    Development Servers Started"
echo "=========================================="
echo
echo -e "${GREEN}Backend is available at: http://localhost:8000${NC}"
echo -e "${GREEN}Frontend is available at: http://localhost:5173${NC}"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for either process to exit
wait
