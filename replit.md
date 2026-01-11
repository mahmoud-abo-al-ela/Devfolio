# DevFolio - Developer Portfolio Application

## Overview

DevFolio is a full-stack developer portfolio web application built with React and Express. It features a public-facing portfolio showcase and an admin dashboard for managing projects and profile information. The application uses a modern tech stack with TypeScript throughout, PostgreSQL for data persistence, and a component-based UI architecture with shadcn/ui.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based structure with reusable layout components (MainLayout for public pages, DashboardLayout for admin). Components are organized by type (ui, layout, pages).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful JSON API with endpoints under `/api/`
- **Validation**: Zod schemas with drizzle-zod for request validation
- **Error Handling**: Centralized error handling with zod-validation-error for user-friendly messages

The server uses a storage abstraction pattern (`IStorage` interface) that currently implements `DatabaseStorage` for PostgreSQL, making it easy to swap storage backends if needed.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization

Current database tables:
- `users` - Authentication (id, username, password)
- `projects` - Portfolio projects (id, title, description, imageUrl, link, tags, createdAt)
- `profile` - Developer profile information (name, title, bio, email, social links)

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Custom build script using esbuild for server bundling and Vite for client
- **Output**: Combined bundle in `dist/` directory with static assets in `dist/public/`

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Connection**: Uses `pg` package with connection pooling
- **Session Storage**: connect-pg-simple for Express sessions (if authentication is added)

### Third-Party Services
- No external API integrations currently configured
- OpenGraph meta images served from `/public/opengraph.png`

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `@tanstack/react-query`: Async state management
- `@radix-ui/*`: Accessible UI primitives
- `framer-motion`: Animation library
- `zod`: Runtime type validation
- `wouter`: Client-side routing