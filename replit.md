# Rotection

## Overview

Rotection is a web application that helps users find safe and verified Roblox games. The platform allows players to browse games with safety scores, submit games for review, and rate games based on honesty, safety, fairness, and age-appropriateness. Developers can submit their games to earn a "Rotection Verified" badge, while parents can use safety scores and age ratings to find appropriate games for their children.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom design system (Vivid Purple, Deep Indigo, Lavender Mist theme)
- **UI Components**: shadcn/ui built on Radix UI primitives
- **State Management**: TanStack React Query for server state, React Context for auth state
- **Routing**: React Router DOM for client-side navigation

### Backend Architecture
- **Database ORM**: Drizzle ORM with PostgreSQL adapter
- **Authentication**: Supabase Auth with Google OAuth and Roblox OAuth support
- **Database**: PostgreSQL via Supabase (schema defined in `shared/schema.ts`)

### Data Models
The main database tables include:
- `profiles`: User profiles with Roblox account linking
- `games`: Roblox games with metadata, verification status, and safety information
- `gameRatings`: User ratings for games across multiple dimensions (honesty, safety, fairness, age-appropriateness)

### Key Design Patterns
- **Service Layer**: Business logic encapsulated in service classes (`gameService.ts`, `robloxApi.ts`, `robloxAuth.ts`)
- **Context Providers**: Auth state managed via `AuthContext` with custom `useAuth` hook
- **Component Composition**: Reusable UI components following shadcn/ui patterns

### Path Aliases
The project uses `@/` as a path alias pointing to the `src/` directory.

## External Dependencies

### Third-Party Services
- **Supabase**: Backend-as-a-Service for database, authentication, and real-time features
- **Roblox API**: Integration for fetching game metadata, thumbnails, and OAuth authentication
- **Google OAuth**: Alternative authentication provider via Supabase Auth

### Key NPM Packages
- `@supabase/supabase-js`: Supabase client SDK
- `@tanstack/react-query`: Data fetching and caching
- `drizzle-orm`: Type-safe database ORM
- `zod`: Schema validation
- `react-hook-form` with `@hookform/resolvers`: Form handling
- `lucide-react`: Icon library

### Deployment
- Configured for Vercel deployment with SPA rewrites (`vercel.json`)
- Development server runs on port 5000