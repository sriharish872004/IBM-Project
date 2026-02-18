# Government Scheme Portal (GovSchemeConnect)

## Overview

This is an AI-powered government scheme discovery and eligibility portal called **GovSchemeConnect**. It helps citizens find relevant government schemes, check eligibility using AI verification, submit applications, and complete awareness surveys. The platform uses AI (OpenAI) for scheme recommendations, eligibility verification, and a chat assistant. It includes an admin dashboard with analytics for tracking scheme awareness gaps.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state (caching, mutations, invalidation)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (professional blue government theme)
- **Animations**: Framer Motion for page transitions and UI effects
- **Charts**: Recharts for admin analytics dashboard
- **Icons**: Lucide React
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express.js running on Node with TypeScript (via tsx)
- **Runtime**: Node.js with ESM modules (`"type": "module"`)
- **Authentication**: Replit Auth via OpenID Connect (passport.js with OIDC strategy)
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`
- **AI Integration**: OpenAI SDK (configured with Replit AI Integrations environment variables)
- **API Structure**: RESTful endpoints under `/api/` prefix, defined in `shared/routes.ts` with Zod validation schemas
- **Chat**: Server-Sent Events (SSE) streaming for AI chat responses
- **Image Generation**: OpenAI gpt-image-1 model integration
- **Batch Processing**: Built-in utility for rate-limited concurrent AI/API calls with retries

### Database
- **Database**: PostgreSQL (required, connected via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` (main) with model files in `shared/models/`
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Tables**:
  - `users` - Replit Auth user profiles (mandatory, don't drop)
  - `sessions` - Express session storage (mandatory, don't drop)
  - `schemes` - Government schemes with JSON criteria, categories, benefits
  - `applications` - User scheme applications with AI verification results
  - `surveys` - Awareness surveys with JSON responses and scores
  - `conversations` - AI chat conversations
  - `messages` - Chat messages linked to conversations

### Shared Layer
- `shared/schema.ts` - Database schemas, Zod validation schemas, and TypeScript types shared between client and server
- `shared/routes.ts` - API route definitions with method, path, input validation, and response schemas (acts as a typed API contract)
- `shared/models/auth.ts` - Auth-related table definitions (users, sessions)
- `shared/models/chat.ts` - Chat-related table definitions (conversations, messages)

### Key API Endpoints
- `GET/POST /api/schemes` - List/create government schemes
- `GET /api/schemes/:id` - Get scheme details
- `POST /api/schemes/recommend` - AI-powered scheme recommendations based on user profile
- `GET/POST /api/applications` - List/create applications
- `POST /api/applications/:id/verify` - AI eligibility verification
- `GET/POST /api/surveys` - Survey submission and retrieval
- `GET /api/surveys/stats` - Aggregated survey analytics
- `GET/POST /api/conversations` - Chat conversation management
- `POST /api/conversations/:id/messages` - Send message with SSE streaming response
- `GET /api/auth/user` - Current authenticated user
- `GET /api/login` - Initiate Replit Auth login
- `GET /api/logout` - Logout

### Build System
- **Development**: `npm run dev` runs tsx with Vite dev server middleware (HMR)
- **Production Build**: `npm run build` runs a custom script that builds the Vite frontend and bundles the server with esbuild
- **Output**: `dist/public/` for static frontend files, `dist/index.cjs` for server bundle

## External Dependencies

- **PostgreSQL**: Required database, connection via `DATABASE_URL` environment variable
- **OpenAI API** (via Replit AI Integrations): Used for chat completions, scheme recommendations, eligibility verification, and image generation. Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables
- **Replit Auth (OIDC)**: Authentication provider using `ISSUER_URL` (defaults to `https://replit.com/oidc`), requires `REPL_ID` and `SESSION_SECRET` environment variables
- **Google Fonts**: Inter and Merriweather fonts loaded via CDN in index.html and CSS