import { useState } from "react"
import { Header } from "@/components/Header"
import { GreetingHero } from "@/components/GreetingHero"
import { ChatThread } from "@/components/ChatThread"
import { ChatInputBar } from "@/components/ChatInputBar"
import { askQuestion } from "@/lib/api"
import type { ChatMessage } from "@/types"

function makeId() {
  return crypto.randomUUID()
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null)

  const hasMessages = messages.length > 0

  const sendQuestion = async (question: string, base: ChatMessage[]) => {
    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: question,
    }
    const pendingId = makeId()
    const pendingMessage: ChatMessage = {
      id: pendingId,
      role: "assistant",
      content: "",
      pending: true,
    }

    setMessages([...base, userMessage, pendingMessage])
    setLoading(true)

    try {
      const { answer, sources } = await askQuestion(question)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, content: answer, sources, pending: false }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? {
                ...m,
                content:
                  "Sorry, something went wrong reaching the server. Please try again.",
                pending: false,
                error: true,
              }
            : m
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSend = (question: string) => {
    if (messages.length === 0) setSessionStartedAt(new Date())
    void sendQuestion(question, messages)
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    const idx = messages.findIndex((m) => m.id === messageId)
    if (idx === -1) return
    void sendQuestion(newContent, messages.slice(0, idx))
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Header />
      {hasMessages ? (
        <ChatThread
          messages={messages}
          sessionStartedAt={sessionStartedAt}
          onEditMessage={handleEditMessage}
          editDisabled={loading}
        />
      ) : (
        <GreetingHero onSuggestionSelect={handleSend} />
      )}
      <ChatInputBar onSend={handleSend} loading={loading} />
    </div>
  )
}
