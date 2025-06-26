# Pokemon Battle Arena ⚔️

A modern Pokemon battle application built with Next.js, where you can manage Pokemon, build teams, and simulate battles with type effectiveness mechanics.

## 🎮 Features

- **Pokemon Management**: View, create, and edit Pokemon with stats (power, life, type)
- **Team Building**: Create teams of exactly 6 Pokemon with automatic power calculation
- **Battle Simulation**: Simulate battles between teams with type effectiveness
- **Type System**: Fire, Water, and Grass types with weakness/effectiveness chart
- **Real-time Updates**: Fast, responsive UI with modern React patterns
- **Type Safety**: Full TypeScript implementation with Zod validation

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Shadcn/ui
- **Backend**: ORPC (tRPC-like), Prisma ORM
- **Database**: PostgreSQL (Supabase recommended)
- **Authentication**: BetterAuth
- **State Management**: React Query (TanStack Query)
- **Validation**: Zod schemas for all operations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (Supabase account recommended)

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd jobmetis-pokemon
pnpm install
\`\`\`

### 2. Setup Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env

# Database

DATABASE_URL="postgresql://username:password@localhost:5432/pokemon_battle_db"

# App

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Auth

BETTER_AUTH_SECRET="your-secret-key-min-10-chars"

### 3. Setup Database

\`\`\`bash

# Generate Prisma client

pnpm db:generate

# Push schema to database

pnpm db:push

# Seed database with Pokemon data

pnpm db:reset-and-seed
\`\`\`

### 4. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Core Tables

- **pokemon_type**: Pokemon types (Fire, Water, Grass) with enum values
- **pokemon**: Individual Pokemon with stats and type relations
- **weakness**: Type effectiveness chart (damage multipliers)
- **team**: Pokemon teams with calculated total power
- **team_member**: Junction table for team composition (6 Pokemon per team)
- **battle**: Battle records with results and statistics

### Battle Logic

The battle system uses realistic Pokemon-style mechanics:

1. **1v1 Combat**: Pokemon battle individually until defeated
2. **Damage Calculation**: \`remaining_life = current_life - opponent_power \* type_factor\`
3. **Type Effectiveness**:
   - Fire vs Grass: 2.0x damage
   - Water vs Fire: 2.0x damage
   - Grass vs Water: 2.0x damage
   - Same type: 1.0x damage
   - Weak matchups: 0.5x damage
4. **Auto-switching**: Defeated Pokemon automatically switch out
5. **Victory Condition**: Last team standing wins

## 🎯 Development Status

### ✅ Backend Complete

- [x] Database schema with enums and relations
- [x] Fast seeding with createMany operations
- [x] Entity layer with Prisma to RO converters
- [x] Zod schemas for validation
- [x] Complete ORPC routes (Pokemon, Team, Battle, PokemonType)
- [x] Battle simulation logic with type effectiveness
- [x] Build passes with zero TypeScript errors
- [x] All unused code cleaned up

### 🚧 Frontend In Progress

- [x] Project setup and basic structure
- [x] Authentication pages (login/register)
- [x] Marketing pages with Pokemon-themed stats
- [ ] Pokemon listing and management pages
- [ ] Team builder interface
- [ ] Battle simulator with round-by-round display
- [ ] Responsive design and animations

### 📋 Todo

- [ ] Complete Pokemon CRUD interface
- [ ] Drag-and-drop team builder
- [ ] Interactive battle visualization
- [ ] Type effectiveness chart display
- [ ] Error handling and loading states
- [ ] Mobile-responsive design

## 🔧 Available Scripts

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm start\` - Start production server
- \`pnpm lint\` - Run ESLint
- \`pnpm format\` - Format code with Prettier
- \`pnpm db:generate\` - Generate Prisma client
- \`pnpm db:push\` - Push schema to database
- \`pnpm db:studio\` - Open Prisma Studio
- \`pnpm db:reset-and-seed\` - Reset and seed database

## ��️ Architecture

### Backend (Complete ✅)

- **Entity Layer**: Prisma models → Return Objects (ROs)
- **Query Helpers**: Reusable Prisma query builders
- **Business Logic**: Type effectiveness, battle mechanics
- **ORPC Routes**: Type-safe API with Zod validation

### Frontend (In Progress 🚧)

- **Components**: Reusable UI components with Shadcn/ui
- **Pages**: Next.js App Router for routing
- **Hooks**: Custom React Query hooks for data fetching
- **State**: React Query for server state management

## 🔒 Environment Variables

| Variable                | Description                  | Required |
| ----------------------- | ---------------------------- | -------- |
| \`DATABASE_URL\`        | PostgreSQL connection string | ✅       |
| \`BETTER_AUTH_SECRET\`  | Authentication secret key    | ✅       |
| \`NEXT_PUBLIC_APP_URL\` | Public app URL               | ✅       |
| \`LOGO_DEV_TOKEN\`      | Logo development token       | ❌       |

## 🎮 API Endpoints

### Pokemon Management

- \`GET /api/orpc/pokemon.getAllPokemon\` - List Pokemon with filtering
- \`POST /api/orpc/pokemon.createPokemon\` - Create new Pokemon
- \`PUT /api/orpc/pokemon.updatePokemon\` - Update existing Pokemon
- \`DELETE /api/orpc/pokemon.deletePokemon\` - Delete Pokemon

### Team Management

- \`GET /api/orpc/team.getAllTeams\` - List all teams
- \`POST /api/orpc/team.createTeam\` - Create team (6 Pokemon required)
- \`GET /api/orpc/team.getTeamById\` - Get team details

### Battle System

- \`POST /api/orpc/battle.startBattle\` - Start battle between teams
- \`GET /api/orpc/battle.getBattleResults\` - Get battle history

### Type System

- \`GET /api/orpc/pokemonType.getAllTypes\` - List all Pokemon types
- \`GET /api/orpc/pokemonType.getEffectivenessChart\` - Type effectiveness data

## 🤝 Contributing

This is a job interview project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

[MIT License](LICENSE.md)

---

**Built with ❤️ for the Pokemon Battle Arena job interview project**

**Status: Backend Complete ✅ | Frontend In Progress 🚧**
