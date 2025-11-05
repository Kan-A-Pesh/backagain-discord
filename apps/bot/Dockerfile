# syntax=docker/dockerfile:1

# Base stage - setup pnpm and Node.js
FROM node:20-alpine AS base

# Install pnpm and bash (needed for startup script)
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && \
    apk add --no-cache bash

# Set working directory
WORKDIR /app

# Dependencies stage - install all dependencies
FROM base AS dependencies

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./

# Copy all package.json files from workspace
COPY apps/bot/package.json ./apps/bot/
COPY packages/database/package.json ./packages/database/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage - copy source and build
FROM dependencies AS build

# Copy source files
COPY apps/bot ./apps/bot
COPY packages/database ./packages/database
COPY packages/typescript-config ./packages/typescript-config

# Build the bot application (will compile TypeScript to JavaScript)
RUN pnpm --filter bot build

# Production stage - minimal runtime image
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install bash (alpine doesn't have it by default)
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./

# Copy package.json files
COPY apps/bot/package.json ./apps/bot/
COPY packages/database/package.json ./packages/database/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install production dependencies
# Note: Keep devDependencies for @repo/database since it's distributed as TypeScript source
RUN pnpm install --frozen-lockfile

# Copy built application from build stage
COPY --from=build /app/apps/bot/dist ./apps/bot/dist

# Copy TypeScript configuration for tsx path resolution
COPY --from=build /app/apps/bot/tsconfig.json ./apps/bot/

# Copy source files (needed for tsx to resolve @/ path aliases)
COPY --from=build /app/apps/bot/src ./apps/bot/src

# Copy and make startup script executable
COPY --from=build /app/apps/bot/start.sh ./apps/bot/
RUN chmod +x ./apps/bot/start.sh

# Copy database package TypeScript source files (needed at runtime for Drizzle and migrations)
# The database package is consumed as TypeScript source by the compiled bot code
COPY --from=build /app/packages/database ./packages/database

# Copy typescript-config package (needed for tsconfig.json extends)
COPY --from=build /app/packages/typescript-config ./packages/typescript-config

# Note: Environment variables are provided by docker-compose via env_file
# The dotenv.config() calls in code will not find ../../.env, but docker-compose
# injects environment variables directly, making the .env file unnecessary

# Use the startup script to run migrations and start the bot
WORKDIR /app/apps/bot
CMD ["./start.sh"]
