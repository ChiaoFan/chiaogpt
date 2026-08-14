import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/ChatMessage"
import type { ChatMessage as ChatMessageType } from "@/types"

interface ChatThreadProps {
  messages: ChatMessageType[]
  sessionStartedAt: Date | null
  onEditMessage: (id: string, content: string) => void
  editDisabled: boolean
}

function formatSessionTimestamp(date: Date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
  return `${weekday} ${time}`
}

export function ChatThread({
  messages,
  sessionStartedAt,
  onEditMessage,
  editDisabled,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto max-w-4xl py-6">
        {sessionStartedAt && (
          <p className="mb-6 text-center text-xs text-muted-foreground">
            {formatSessionTimestamp(sessionStartedAt)}
          </p>
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onEdit={message.role === "user" ? onEditMessage : undefined}
            editDisabled={editDisabled}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
