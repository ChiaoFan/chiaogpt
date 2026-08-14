import { useEffect, useState } from "react"
import { SuggestedChips } from "@/components/SuggestedChips"

const CYCLE_WORDS = ["你好", "Hallo"]
const WORD_DURATION_MS = 900
const CONTENT_DELAY_MS = 500

interface GreetingHeroProps {
  onSuggestionSelect: (question: string) => void
}

export function GreetingHero({ onSuggestionSelect }: GreetingHeroProps) {
  const [cycleIndex, setCycleIndex] = useState(0)
  const [settled, setSettled] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (cycleIndex < CYCLE_WORDS.length) {
      const t = setTimeout(() => setCycleIndex((i) => i + 1), WORD_DURATION_MS)
      return () => clearTimeout(t)
    }
    setSettled(true)
    const t = setTimeout(() => setShowContent(true), CONTENT_DELAY_MS)
    return () => clearTimeout(t)
  }, [cycleIndex])

  const cyclingWord = CYCLE_WORDS[cycleIndex]

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
      <div className="flex h-14 items-center justify-center sm:h-16">
        {!settled && cyclingWord && (
          <span
            key={cycleIndex}
            className="animate-greeting-word font-display text-4xl font-medium text-foreground sm:text-5xl"
          >
            {cyclingWord}
          </span>
        )}
        {settled && (
          <span className="animate-fade-up font-display text-4xl font-medium text-foreground sm:text-5xl">
            Hello
          </span>
        )}
      </div>

      {showContent && (
        <>
          <p className="animate-fade-up mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            I'm ChiaoGPT — ask me anything about Chiao's experience, projects,
            or skills.
          </p>
          <SuggestedChips
            onSelect={onSuggestionSelect}
            className="animate-fade-up mt-6"
          />
        </>
      )}
    </div>
  )
}
