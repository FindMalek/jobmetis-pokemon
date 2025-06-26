# Pokemon Battle Arena - Database Seed Data

This directory contains seed data for the Pokemon Battle Arena database. The seeding process creates a complete Pokemon ecosystem with types, Pokemon, teams, and battle mechanics.

## 🎯 Seeded Data Overview

The database is seeded with a comprehensive Pokemon battle system including:

- **Pokemon Types** with type effectiveness mechanics
- **Pokemon** with balanced stats and type relationships
- **Teams** with strategic Pokemon combinations
- **Weakness Chart** for battle calculations
- **Sample Users** for testing authentication

## 🔥 Pokemon Types

### Fire Type

- **Color**: Red (#ff6b6b)
- **Strengths**: Effective against Grass (2.0x damage)
- **Weaknesses**: Weak against Water (0.5x damage)

### Water Type

- **Color**: Blue (#4fc3f7)
- **Strengths**: Effective against Fire (2.0x damage)
- **Weaknesses**: Weak against Grass (0.5x damage)

### Grass Type

- **Color**: Green (#66bb6a)
- **Strengths**: Effective against Water (2.0x damage)
- **Weaknesses**: Weak against Fire (0.5x damage)

## 🎮 Seeded Pokemon

The seeder creates **15 Pokemon** with balanced stats:

### Fire Pokemon (5 total)

- **Charmander** - Power: 45, Life: 39
- **Charmeleon** - Power: 58, Life: 58
- **Charizard** - Power: 84, Life: 78
- **Vulpix** - Power: 41, Life: 38
- **Ninetales** - Power: 76, Life: 73

### Water Pokemon (5 total)

- **Squirtle** - Power: 48, Life: 44
- **Wartortle** - Power: 63, Life: 59
- **Blastoise** - Power: 83, Life: 79
- **Psyduck** - Power: 52, Life: 50
- **Golduck** - Power: 82, Life: 80

### Grass Pokemon (5 total)

- **Bulbasaur** - Power: 49, Life: 45
- **Ivysaur** - Power: 62, Life: 60
- **Venusaur** - Power: 82, Life: 83
- **Oddish** - Power: 50, Life: 45
- **Vileplume** - Power: 80, Life: 75

## ⚔️ Battle Mechanics

### Type Effectiveness Chart

The weakness table defines battle damage multipliers:

| Attacking | Defending | Damage Factor             |
| --------- | --------- | ------------------------- |
| Fire      | Grass     | 2.0x (Super Effective)    |
| Water     | Fire      | 2.0x (Super Effective)    |
| Grass     | Water     | 2.0x (Super Effective)    |
| Same Type | Same Type | 1.0x (Normal)             |
| Fire      | Water     | 0.5x (Not Very Effective) |
| Water     | Grass     | 0.5x (Not Very Effective) |
| Grass     | Fire      | 0.5x (Not Very Effective) |

### Battle Calculation

Damage is calculated using:

```
remaining_life = current_life - (opponent_power * type_effectiveness_factor)
```

## 🏆 Sample Teams

The seeder creates balanced teams for testing:

### Fire Team

- Charizard, Ninetales, Charmander, Charmeleon, Vulpix + 1 more
- **Total Power**: ~400+ combined

### Water Team

- Blastoise, Golduck, Wartortle, Squirtle, Psyduck + 1 more
- **Total Power**: ~400+ combined

### Grass Team

- Venusaur, Vileplume, Ivysaur, Bulbasaur, Oddish + 1 more
- **Total Power**: ~400+ combined

Each team contains exactly **6 Pokemon** as required by the battle system.

## 👤 Test Users

The seeder creates sample users for authentication testing:

### Demo User

- **Email**: demo@pokemon.com
- **Password**: Demo123!
- **Role**: User

### Admin User

- **Email**: admin@pokemon.com
- **Password**: Admin123!
- **Role**: Admin

## 🚀 Running the Seeder

To populate the database with Pokemon data:

```bash
# Reset database and seed with fresh data
pnpm db:reset-and-seed

# Or run seeding only (if schema exists)
pnpm db:seed
```

## 📊 Seeded Statistics

- **15 Pokemon** across 3 types
- **3 Pokemon Types** with balanced effectiveness
- **9 Type Effectiveness** relationships
- **3+ Sample Teams** for battle testing
- **2 Test Users** for authentication
- **1 Waitlist Entry** for marketing features

## 🎯 Battle Strategy

The seeded Pokemon are balanced for strategic gameplay:

- **Evolution Lines**: Starter Pokemon can evolve (Charmander → Charmeleon → Charizard)
- **Stat Distribution**: Balanced power/life ratios for fair battles
- **Type Coverage**: Each type has strong and weak Pokemon
- **Team Variety**: Multiple team compositions possible

## 🔧 Customization

To add more Pokemon or modify existing ones:

1. Edit `prisma/seed/pokemon.ts`
2. Update Pokemon stats and types
3. Run `pnpm db:reset-and-seed`

## 📝 Notes

- All Pokemon images use placeholder URLs
- Stats are based on simplified Pokemon mechanics
- Battle system supports unlimited Pokemon expansion
- Type effectiveness follows rock-paper-scissors pattern (Fire → Grass → Water → Fire)
- Teams must contain exactly 6 Pokemon for battles

---

**The seeded database provides a complete Pokemon Battle Arena experience ready for frontend development!**
