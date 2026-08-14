import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  "Can you summarize Chiao's CV?",
  "Where does Chiao live?",
  "How did Chiao build ChiaoGPT?",
  "What AWS experience does Chiao have?",
  "Which language does Chiao speak?"
]

interface SuggestedChipsProps {
  onSelect: (question: string) => void
  disabled?: boolean
  className?: string
}

export function SuggestedChips({
  onSelect,
  disabled,
  className,
}: SuggestedChipsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className
      )}
    >
      {SUGGESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(question)}
          className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
        >
          {question}
        </button>
      ))}
    </div>
  )
}
