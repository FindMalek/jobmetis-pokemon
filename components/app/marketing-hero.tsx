import { type Variants } from "motion/react"

import { MarketingWaitlistForm } from "@/components/app/marketing-waitlist-form"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { Badge } from "@/components/ui/badge"
import { TextLoop } from "@/components/ui/text-loop"

const transitionVariants: { item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export function MarketingHero() {
  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-4 py-16 sm:py-20 md:py-32 lg:gap-12">
      <AnimatedGroup variants={transitionVariants} className="w-full max-w-6xl">
        <div className="flex flex-col gap-8 px-2 sm:px-4 md:px-6 lg:gap-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center sm:gap-6">
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
            >
              ⚔️ Pokemon Battle Arena
            </Badge>

            <h1 className="xs:text-3xl inline-flex flex-col items-center justify-center gap-1.5 text-4xl font-bold leading-tight sm:flex-row sm:items-baseline sm:gap-2.5 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="text-center sm:text-left">
                Build your ultimate
              </span>
              <TextLoop
                transition={{
                  type: "spring",
                  stiffness: 900,
                  damping: 95,
                  mass: 5,
                }}
                variants={{
                  initial: {
                    y: 5,
                    rotateX: 90,
                    opacity: 0,
                    filter: "blur(10px)",
                  },
                  animate: {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                  },
                  exit: {
                    y: -5,
                    rotateX: -90,
                    opacity: 0,
                    filter: "blur(10px)",
                  },
                }}
              >
                {[
                  <span key="team" className="text-red-500">
                    🔥 Team
                  </span>,
                  <span key="squad" className="text-blue-500">
                    💧 Squad
                  </span>,
                  <span key="roster" className="text-green-500">
                    🌿 Roster
                  </span>,
                ]}
              </TextLoop>
              <span className="text-center sm:text-left">and battle!</span>
            </h1>

            <p className="text-muted-foreground xs:max-w-sm xs:text-lg max-w-xs text-base leading-relaxed sm:max-w-xl md:max-w-2xl md:text-xl">
              Create teams of 6 Pokemon, master type effectiveness, and compete
              in strategic battles.
            </p>

            <div className="w-full max-w-md sm:max-w-lg">
              <MarketingWaitlistForm />
            </div>
          </div>
        </div>
      </AnimatedGroup>
    </section>
  )
}
