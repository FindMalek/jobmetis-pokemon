import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Pokemon Battle Arena",
  description:
    "Build teams of Pokemon and battle with type effectiveness mechanics.",
  url: "https://jobmetis-pokemon.vercel.app",
  images: {
    default: "https://jobmetis-pokemon.vercel.app/og.png",
    notFound: "https://jobmetis-pokemon.vercel.app/not-found.png",
    logo: "https://emojicdn.elk.sh/⚔?style=twitter",
  },
  links: {
    twitter: "https://twitter.com/jobmetis",
    github: "https://github.com/jobmetis/jobmetis-pokemon",
  },
  author: {
    name: "JobMetis Pokemon App",
    url: "https://jobmetis.com",
    email: "contact@jobmetis.com",
    github: "https://github.com/jobmetis",
  },
  keywords: [
    "Pokemon",
    "Battle",
    "Team Building",
    "Type Effectiveness",
    "Gaming",
    "Simulation",
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "TailwindCSS",
    "Supabase",
    "PostgreSQL",
    "ORPC",
  ],
}

export const notFoundMetadata = () => {
  return {
    title: "Pokemon not found",
    description: "The Pokemon you're looking for doesn't exist!",
    openGraph: {
      title: `${siteConfig.name} | Pokemon not found`,
      description: "The Pokemon you're looking for doesn't exist!",
      images: [
        {
          url: siteConfig.images.notFound,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | Pokemon not found`,
      description: "The Pokemon you're looking for doesn't exist!",
      images: [siteConfig.images.notFound],
      creator: "@jobmetis",
    },
  }
}
