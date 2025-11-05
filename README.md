# Turbo Template

A modern full-stack web application built with Next.js and organized as a monorepo using Turborepo. This project features authentication, database integration, and a scalable architecture designed for rapid development.

## Tech Stack

- **[Next.js 16](https://nextjs.org/)** - React framework for production
- **[Turborepo](https://turbo.build/repo)** - High-performance build system for monorepos
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication library
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for SQL databases
- **[PostgreSQL 17](https://www.postgresql.org/)** - Robust relational database
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library built with Radix UI and Tailwind CSS
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io)** - Code formatting

## Project Structure

This is a Turborepo monorepo with the following structure:

```
turbo-template/
├── apps/
│   └── web/                 # Next.js web application
├── packages/
│   ├── database/            # Database schema, migrations, and auth config
│   ├── eslint-config/       # Shared ESLint configurations
│   └── typescript-config/   # Shared TypeScript configurations
├── docker-compose.yml       # PostgreSQL database setup
└── turbo.json              # Turborepo configuration
```

### Apps and Packages

- **`apps/web`** - Main Next.js application with React 19, Tailwind CSS 4, and shadcn/ui components
- **`packages/database`** - Centralized database package containing:
  - Drizzle ORM configuration and schema
  - Better Auth setup for authentication
  - Database migration scripts
- **`packages/eslint-config`** - Shared ESLint configurations
- **`packages/typescript-config`** - Shared TypeScript configurations

Each package/app is written in TypeScript for type safety and better developer experience.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** 9.0.0 or higher
- **Docker** (for running PostgreSQL)

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:Kan-A-Pesh/turbo-template.git
cd turbo-template
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432"
BETTER_AUTH_SECRET="your-secret-key-here"
```

> **Note:** For production, generate a secure random string for `BETTER_AUTH_SECRET`. You can use: `openssl rand -base64 32`

### 4. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
pnpm db:start
```

This will spin up a PostgreSQL 17 container on port 5432.

### 5. Set Up the Database

Generate and run database migrations:

```bash
# Generate migration files from schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Or push schema directly to database (for development)
pnpm db:push
```

### 6. Generate Authentication Schema

Generate the Better Auth schema:

```bash
pnpm auth:generate
```

### 7. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

Run these commands from the root directory:

### Development

- **`pnpm dev`** - Start all apps in development mode
- **`pnpm build`** - Build all apps and packages
- **`pnpm lint`** - Lint all packages
- **`pnpm format`** - Format code with Prettier
- **`pnpm types:check`** - Type-check all packages
- **`pnpm checks`** - Run format check, type check, and lint

### Database Commands

- **`pnpm db:start`** - Start PostgreSQL container with Docker Compose
- **`pnpm db:stop`** - Stop and remove PostgreSQL container and volumes
- **`pnpm db:generate`** - Generate migration files from Drizzle schema
- **`pnpm db:migrate`** - Run database migrations
- **`pnpm db:push`** - Push schema changes directly to database (development)
- **`pnpm db:check`** - Check for schema conflicts
- **`pnpm db:studio`** - Open Drizzle Studio for database management

### Authentication

- **`pnpm auth:generate`** - Generate Better Auth schema files

### UI Components

- **`pnpm ui:add`** - Add shadcn/ui components to the web app

### Turborepo Filtering

You can run commands for specific packages using Turbo filters:

```bash
# Run dev only for web app
turbo dev --filter=web

# Build only the database package
turbo build --filter=@repo/database

# Lint a specific package
turbo lint --filter=@repo/web
```

## Development Workflow

1. **Start the database**: `pnpm db:start`
2. **Run migrations**: `pnpm db:migrate` or `pnpm db:push`
3. **Start dev server**: `pnpm dev`
4. **Make changes** to your code
5. **Run checks** before committing: `pnpm checks`

### Working with the Database

- Use **Drizzle Studio** to inspect and modify database data:
  ```bash
  pnpm db:studio
  ```
- After modifying the database schema in `packages/database/schema/`:
  1. Generate migrations: `pnpm db:generate`
  2. Review the generated migration files
  3. Apply migrations: `pnpm db:migrate`

### Adding UI Components

To add shadcn/ui components:

```bash
pnpm ui:add
```

This will prompt you to select components to add to your project.

## Project Architecture

### Monorepo Benefits

- **Shared Code**: Common configurations and utilities are shared across apps
- **Atomic Changes**: Make changes across multiple packages in a single commit
- **Optimized Builds**: Turborepo caches builds and only rebuilds what's changed
- **Type Safety**: TypeScript types are shared across the monorepo

### Database Package

The `packages/database` package is a shared package that exports:

- Database client and schema (`./index.ts`)
- Better Auth server configuration (`./auth/server`)
- Better Auth client configuration (`./auth/client`)

Import these in your Next.js app:

```typescript
import { db, schema } from "@repo/database";
import { auth } from "@repo/database/auth/server";
```

## Useful Links and Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

### Turborepo Resources

- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering Workspaces](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)

### Tools

- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) - Database migration toolkit
- [Better Auth CLI](https://www.better-auth.com/docs/cli) - Authentication CLI tools

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Ensure Docker is running
2. Check if the PostgreSQL container is running: `docker ps`
3. Verify the `DATABASE_URL` in your `.env` file
4. Restart the database: `pnpm db:stop && pnpm db:start`

### Port Conflicts

If port 3000 or 5432 is already in use:

- **Port 3000**: Change the dev port in `apps/web/package.json`
- **Port 5432**: Modify the port mapping in `docker-compose.yml`

### Type Errors

Run type checking across all packages:

```bash
pnpm types:check
```

## License

This project is private and not licensed for public use.
