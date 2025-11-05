#!/bin/bash

# Startup script for the Discord bot
# This script:
# 1. Runs database migrations
# 2. Starts the bot with proper path alias resolution using tsx

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting bot initialization...${NC}"

# Get the project root directory (2 levels up from apps/bot)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${YELLOW}📂 Project root: ${PROJECT_ROOT}${NC}"

# Change to project root for migration
cd "$PROJECT_ROOT"

# Run database migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
if pnpm --filter @repo/database db:migrate; then
    echo -e "${GREEN}✅ Database migrations completed successfully${NC}"
else
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
fi

# Change to bot directory
cd "$SCRIPT_DIR"

# Start the bot with tsx for path alias support
echo -e "${YELLOW}🤖 Starting Discord bot...${NC}"
if npx tsx --tsconfig tsconfig.json src/index.ts; then
    echo -e "${GREEN}✅ Bot stopped gracefully${NC}"
else
    echo -e "${RED}❌ Bot exited with error${NC}"
    exit 1
fi
