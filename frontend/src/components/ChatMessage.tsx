import { useState } from "react"
import { Copy, Check, Pencil } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/Markdown"
import { SourcePill } from "@/components/SourcePill"
import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType } from "@/types"

interface ChatMessageProps {
  message: ChatMessageType
  onEdit?: (id: string, content: string) => void
  editDisabled?: boolean
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access can be denied by the browser; fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy"
      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {copied ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  )
}

export function ChatMessage({
  message,
  onEdit,
  editDisabled,
}: ChatMessageProps) {
  const isUser = message.role === "user"
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(message.content)

  if (isUser) {
    if (isEditing) {
      return (
        <div className="flex justify-end px-4 py-2.5 sm:px-6">
          <div className="w-full max-w-[85%] rounded-2xl border border-border bg-background p-3 sm:max-w-[70%]">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              rows={3}
              className="w-full resize-none bg-transparent text-base leading-7 text-foreground outline-none"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraft(message.content)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!draft.trim()}
                onClick={() => {
                  const trimmed = draft.trim()
                  setIsEditing(false)
                  if (trimmed && trimmed !== message.content) {
                    onEdit?.(message.id, trimmed)
                  }
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-end px-4 py-2.5 sm:px-6">
        <div className="max-w-[85%] rounded-2xl bg-secondary px-4 py-2.5 text-base leading-7 text-foreground sm:max-w-[70%]">
          {message.content}
        </div>
        <div className="mt-1 flex items-center gap-0.5">
          <CopyButton text={message.content} />
          {onEdit && (
            <button
              type="button"
              disabled={editDisabled}
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4 py-2.5 sm:px-6">
      <Avatar className="mt-0.5 size-[29px]">
        <AvatarImage src="/profile.jpeg" alt="ChiaoGPT" />
        <AvatarFallback className="bg-primary/10 font-display text-primary">
          C
        </AvatarFallback>
      </Avatar>
      <div className="flex max-w-[85%] flex-col pt-1 sm:max-w-[70%]">
        <div
          className={cn(
            "text-base leading-7 text-foreground",
            message.pending && "text-muted-foreground",
            message.error && "text-destructive"
          )}
        >
          {message.pending ? (
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-current" />
            </span>
          ) : message.error ? (
            message.content
          ) : (
            <Markdown content={message.content} />
          )}
        </div>
        {!message.pending && !message.error && message.sources && (
          <SourcePill sources={message.sources} />
        )}
        {!message.pending && (
          <div className="mt-1.5 flex items-center">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  )
}
