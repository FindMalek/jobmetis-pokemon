# Pokemon Battle Application - TODO List

## 🎯 Project Overview
Transform the existing template into a Pokemon Battle Application with:
- Pokemon management (view, edit, create teams)
- Team building (6 Pokemon per team) 
- Battle simulation with type effectiveness
- Supabase database integration

## 📋 Phase 1: Cleanup & Database Setup
- [x] Create TODO.md for tracking
- [ ] Delete unnecessary files and components
- [ ] Set up Supabase database schema
- [ ] Create Pokemon types table with Fire, Water, Grass
- [ ] Create Pokemon table with at least 15 Pokemon (5 per type)
- [ ] Create weakness chart table with type effectiveness
- [ ] Create teams table for storing Pokemon teams
- [ ] Write PostgreSQL functions for team operations

## 📋 Phase 2: Backend API (ORPC/tRPC)
- [ ] Update database schema in Prisma
- [ ] Create Pokemon entities and queries
- [ ] Create Pokemon ORPC routes
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

## 🗃️ Database Schema Requirements
```sql
-- pokemon_type table
- id (uid)
- name (text): Fire, Water, Grass

-- pokemon table  
- id (uid)
- name (text)
- type (uid) -> pokemon_type.id
- image (text)
- power (number 10-100)
- life (number 10-100)

-- weakness table
- id (uid) 
- type1 (uid) -> pokemon_type.id (attacking)
- type2 (uid) -> pokemon_type.id (defending) 
- factor (float)

-- teams table
- id (uid)
- name (text)
- pokemon_ids (uid[]) - array of 6 pokemon IDs
- total_power (number) - calculated field
```

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