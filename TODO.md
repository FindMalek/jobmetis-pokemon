# Pokemon Battle Application - TODO List

## 🎯 Project Overview
Transform the existing template into a Pokemon Battle Application with:
- Pokemon management (view, edit, create teams)
- Team building (6 Pokemon per team) 
- Battle simulation with type effectiveness
- Supabase database integration

## 📋 Phase 1: Cleanup & Database Setup
- [x] Create TODO.md for tracking
- [x] Delete unnecessary files and components  
- [x] Create Pokemon database schema with enums
- [x] Create Pokemon types, Pokemon, teams, and weakness tables
- [x] Create fast seeder with createMany for Pokemon data
- [x] Create Pokemon entities with converter functions
- [x] Create Pokemon schemas with Zod validation
- [ ] Test database migration and seeding
- [ ] Write PostgreSQL functions for team operations (optional - can use Prisma)

## 📋 Phase 2: Backend API (ORPC/tRPC) 
- [x] Update database schema in Prisma
- [x] Create Pokemon entities and queries
- [ ] Create Pokemon ORPC routes
- [x] Create Pokemon schemas and DTOs
- [ ] Create Team ORPC routes  
- [ ] Create Battle simulation logic
- [ ] Update authentication to work with Pokemon app

## 📋 Phase 3: Frontend Components
- [ ] Clean up existing dashboard components
- [ ] Create Pokemon list component
- [ ] Create Pokemon card component
- [ ] Create Pokemon edit form
- [ ] Create team builder component
- [ ] Create team list component
- [ ] Create battle simulator component
- [ ] Create battle display/results component

## 📋 Phase 4: Pages & Navigation
- [ ] Update routing for Pokemon app
- [ ] Create Pokemon listing page
- [ ] Create team management page
- [ ] Create battle page
- [ ] Update navigation/sidebar
- [ ] Clean up auth pages if needed

## 📋 Phase 5: Styling & Polish
- [ ] Design Pokemon-themed UI
- [ ] Add Pokemon images/icons
- [ ] Implement battle animations
- [ ] Polish responsive design
- [ ] Add loading states

## 📋 Phase 6: Documentation & Deployment
- [ ] Update README.md with setup instructions
- [ ] Document battle algorithm
- [ ] Explain database design choices
- [ ] Add environment setup guide
- [ ] Test entire application flow

## 🚀 Current Status
**WORKING ON**: Creating ORPC routers for Pokemon functionality
**NEXT**: Complete backend API routes then start frontend components

## 🗃️ Database Schema (COMPLETED)
✅ Pokemon types with enum (FIRE, WATER, GRASS)
✅ Pokemon table with type relations
✅ Weakness/effectiveness chart 
✅ Teams with 6 Pokemon members
✅ Fast seeding with createMany

## ⚔️ Battle Logic Requirements
- 1v1 combat until one team defeated
- Life calculation: `remaining_life = current_life - opponent_power * type_factor`
- Defeated Pokemon switch out automatically
- Battle continues until one team has no Pokemon left
- Winner is team with remaining Pokemon

## 🎨 UI Requirements
- List all Pokemon with search/filter
- Edit Pokemon stats
- Build teams of exactly 6 Pokemon  
- List teams ordered by total power
- Battle simulator with round-by-round display
- Show Pokemon status during battle
- Display battle winner

---
**Target**: Impress in job interview with clean, professional Pokemon battle app
**Time Budget**: ~4 hours (excluding initial DB setup)
**Tech Stack**: Next.js, TypeScript, Tailwind, ORPC, Prisma, Supabase 