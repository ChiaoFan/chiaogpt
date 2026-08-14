import type { AskResponse } from "@/types"

const DEFAULT_API_URL =
  "https://3dwk9epxqi.execute-api.us-east-1.amazonaws.com/ask"

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL

const REQUEST_TIMEOUT_MS = 30_000

export class ApiError extends Error {
  kind: "timeout" | "network" | "server"

  constructor(kind: "timeout" | "network" | "server", message: string) {
    super(message)
    this.kind = kind
  }
}

export async function askQuestion(question: string): Promise<AskResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("timeout", "The request took too long to respond.")
    }
    throw new ApiError("network", "Could not reach the server.")
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new ApiError("server", `Server responded with ${response.status}.`)
  }

  return response.json() as Promise<AskResponse>
}
