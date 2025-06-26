    import { PrismaClient, PokemonTypeEnum } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedPokemon() {
  console.log("🔥 Seeding Pokemon data...")

  // Create Pokemon Types using createMany for speed
  await prisma.pokemonType.createMany({
    data: [
      { name: PokemonTypeEnum.FIRE },
      { name: PokemonTypeEnum.WATER },
      { name: PokemonTypeEnum.GRASS },
    ],
    skipDuplicates: true,
  })

  console.log("✅ Created Pokemon types")

  // Get the created types for referencing
  const types = await prisma.pokemonType.findMany()
  const fireType = types.find(t => t.name === PokemonTypeEnum.FIRE)!
  const waterType = types.find(t => t.name === PokemonTypeEnum.WATER)!
  const grassType = types.find(t => t.name === PokemonTypeEnum.GRASS)!

  // Create Weakness Chart using createMany
  await prisma.weakness.createMany({
    data: [
      { type1Id: fireType.id, type2Id: fireType.id, factor: 1.0 },
      { type1Id: fireType.id, type2Id: waterType.id, factor: 0.5 },
      { type1Id: fireType.id, type2Id: grassType.id, factor: 2.0 },
      { type1Id: waterType.id, type2Id: fireType.id, factor: 2.0 },
      { type1Id: waterType.id, type2Id: waterType.id, factor: 1.0 },
      { type1Id: waterType.id, type2Id: grassType.id, factor: 0.5 },
      { type1Id: grassType.id, type2Id: fireType.id, factor: 0.5 },
      { type1Id: grassType.id, type2Id: waterType.id, factor: 2.0 },
      { type1Id: grassType.id, type2Id: grassType.id, factor: 1.0 },
    ],
    skipDuplicates: true,
  })

  console.log("✅ Created weakness chart")

  // Create all Pokemon using createMany for maximum speed
  const allPokemon = [
    // Fire Pokemon
    { name: "Charmander", typeId: fireType.id, power: 39, life: 39, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { name: "Charmeleon", typeId: fireType.id, power: 58, life: 58, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png" },
    { name: "Charizard", typeId: fireType.id, power: 84, life: 78, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
    { name: "Growlithe", typeId: fireType.id, power: 70, life: 55, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png" },
    { name: "Arcanine", typeId: fireType.id, power: 90, life: 90, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png" },
    
    // Water Pokemon
    { name: "Squirtle", typeId: waterType.id, power: 44, life: 44, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { name: "Wartortle", typeId: waterType.id, power: 63, life: 59, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png" },
    { name: "Blastoise", typeId: waterType.id, power: 83, life: 79, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
    { name: "Psyduck", typeId: waterType.id, power: 52, life: 50, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" },
    { name: "Golduck", typeId: waterType.id, power: 82, life: 80, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png" },
    
    // Grass Pokemon
    { name: "Bulbasaur", typeId: grassType.id, power: 49, life: 45, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { name: "Ivysaur", typeId: grassType.id, power: 62, life: 60, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" },
    { name: "Venusaur", typeId: grassType.id, power: 82, life: 80, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
    { name: "Oddish", typeId: grassType.id, power: 50, life: 45, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png" },
    { name: "Vileplume", typeId: grassType.id, power: 80, life: 75, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png" },
  ]

  await prisma.pokemon.createMany({
    data: allPokemon,
    skipDuplicates: true,
  })

  console.log("✅ Created 15 Pokemon (5 of each type)")

  // Create sample teams - we need to create teams first, then add members
  const sampleTeams = [
    { name: "Fire Squad" },
    { name: "Water Warriors" },
    { name: "Grass Guardians" },
  ]

  await prisma.team.createMany({
    data: sampleTeams,
    skipDuplicates: true,
  })

  console.log("✅ Created sample teams")

  // Get created Pokemon and teams for team member creation
  const createdPokemon = await prisma.pokemon.findMany()
  const createdTeams = await prisma.team.findMany()

  const pokemonByName = Object.fromEntries(
    createdPokemon.map(p => [p.name, p])
  )

  // Create team members
  const teamMemberData = []
  
  // Fire Squad
  const fireSquad = createdTeams.find(t => t.name === "Fire Squad")!
  const fireTeamMembers = ["Charmander", "Charmeleon", "Charizard", "Growlithe", "Arcanine", "Charmander"]
  for (let i = 0; i < fireTeamMembers.length; i++) {
    teamMemberData.push({
      teamId: fireSquad.id,
      pokemonId: pokemonByName[fireTeamMembers[i]].id,
      position: i + 1,
    })
  }

  // Water Warriors
  const waterWarriors = createdTeams.find(t => t.name === "Water Warriors")!
  const waterTeamMembers = ["Squirtle", "Wartortle", "Blastoise", "Psyduck", "Golduck", "Squirtle"]
  for (let i = 0; i < waterTeamMembers.length; i++) {
    teamMemberData.push({
      teamId: waterWarriors.id,
      pokemonId: pokemonByName[waterTeamMembers[i]].id,
      position: i + 1,
    })
  }

  // Grass Guardians
  const grassGuardians = createdTeams.find(t => t.name === "Grass Guardians")!
  const grassTeamMembers = ["Bulbasaur", "Ivysaur", "Venusaur", "Oddish", "Vileplume", "Bulbasaur"]
  for (let i = 0; i < grassTeamMembers.length; i++) {
    teamMemberData.push({
      teamId: grassGuardians.id,
      pokemonId: pokemonByName[grassTeamMembers[i]].id,
      position: i + 1,
    })
  }

  await prisma.teamMember.createMany({
    data: teamMemberData,
    skipDuplicates: true,
  })

  // Update team total power efficiently
  const teamUpdates = await Promise.all(
    createdTeams.map(async (team) => {
      const members = await prisma.teamMember.findMany({
        where: { teamId: team.id },
        include: { pokemon: true },
      })
      const totalPower = members.reduce((sum, member) => sum + member.pokemon.power, 0)
      return prisma.team.update({
        where: { id: team.id },
        data: { totalPower },
      })
    })
  )

  console.log("✅ Updated team total power")
  console.log("🎉 Pokemon seeding completed successfully!")
} 