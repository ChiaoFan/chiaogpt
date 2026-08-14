import { useState, type FormEvent } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputBarProps {
  onSend: (question: string) => void
  loading: boolean
}

export function ChatInputBar({ onSend, loading }: ChatInputBarProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setValue("")
  }

  return (
    <div className="shrink-0 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-4xl items-center gap-2 rounded-full border border-border bg-background px-2 py-2 shadow-sm transition-shadow focus-within:border-ring focus-within:shadow-md"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask a question…"
          disabled={loading}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-base text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !value.trim()}
          className="size-8 shrink-0 rounded-full"
          aria-label="Send"
        >
          <ArrowUp className="size-4" />
        </Button>
      </form>
      <p className="mx-auto mt-2 max-w-4xl text-center text-xs text-muted-foreground">
        ChiaoGPT can make mistakes. Check important info.
      </p>
    </div>
  )
}
