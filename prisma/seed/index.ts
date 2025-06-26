import { PrismaClient } from "@prisma/client"

import { seedPokemon } from "./pokemon"
import { seedUsers } from "./users"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting Pokemon Battle App database seeding...")

  // Seed users for authentication
  await seedUsers(prisma)
  
  // Seed Pokemon data
  await seedPokemon()

  console.log("✅ Pokemon Battle App database seeding completed")
}

main()
  .catch((e) => {
    console.error("❌ Database seeding failed")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
