export type MessageRole = "user" | "assistant"

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  sources?: string[]
  pending?: boolean
  error?: boolean
}

export interface AskResponse {
  answer: string
  sources: string[]
}
