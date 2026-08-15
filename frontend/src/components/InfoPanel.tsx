import {
  Info,
  Monitor,
  Server,
  Database,
  Workflow,
  FileSearch,
  Cloud,
  KeyRound,
  Search,
  Quote,
  ArrowDown,
  ArrowUp,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ArchStep {
  code: string
  icon: LucideIcon
  description: string
}

interface Connector {
  direction: "down" | "up"
  label: string
}

const ARCHITECTURE: (ArchStep | Connector)[] = [
  { code: "FE", icon: Monitor, description: "React SPA (Vite + TypeScript)" },
  { direction: "down", label: "REST (JSON)" },
  { code: "API", icon: Server, description: "FastAPI on AWS Lambda + API Gateway" },
  { direction: "down", label: "SQL + Vector" },
  { code: "DB", icon: Database, description: "Supabase (Postgres + pgvector)" },
  { direction: "up", label: "Embeddings" },
  { code: "RAG", icon: Workflow, description: "Custom Python ingestion pipeline" },
]

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: FileSearch,
    title: "Retrieval-Augmented Generation",
    description:
      "Answers are grounded in real documents (resume, project write-ups, bio), not model guesswork",
  },
  {
    icon: Cloud,
    title: "Serverless Architecture",
    description: "AWS Lambda + API Gateway, near-zero idle cost, scales to zero",
  },
  {
    icon: KeyRound,
    title: "IAM-Based AWS Auth",
    description: "No hardcoded credentials; least-privilege access to Bedrock via IAM roles",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "pgvector cosine similarity over 1024-dimension embeddings, not keyword matching",
  },
  {
    icon: Quote,
    title: "Source Citation",
    description: "Every answer shows which document(s) it drew from",
  },
  {
    icon: Workflow,
    title: "Custom Ingestion Pipeline",
    description: "Hand-built chunking, embedding, and storage logic, not a template or no-code tool",
  },
]

const TECH_STACK = [
  "Amazon Bedrock",
  "FastAPI",
  "Python",
  "Claude Haiku",
  "Supabase",
  "pgvector",
  "AWS IAM",
  "AWS Lambda",
  "React",
  "TypeScript", 
]

function isConnector(item: ArchStep | Connector): item is Connector {
  return "direction" in item
}

export function InfoPanel() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="About ChiaoGPT">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">ChiaoGPT</DialogTitle>
          <DialogDescription>
            A RAG-powered chatbot that answers questions about my background, built
            from scratch to demonstrate real AI/LLM engineering.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <section>
            <h3 className="text-sm font-semibold text-foreground">Architecture</h3>
            <div className="mt-3 flex flex-col">
              {ARCHITECTURE.map((item, i) =>
                isConnector(item) ? (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-1 pl-4 text-muted-foreground"
                  >
                    {item.direction === "down" ? (
                      <ArrowDown className="size-3.5 shrink-0" />
                    ) : (
                      <ArrowUp className="size-3.5 shrink-0" />
                    )}
                    <span className="font-mono text-[0.7rem]">{item.label}</span>
                  </div>
                ) : (
                  <div key={item.code} className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                      <item.icon className="size-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {item.code}
                      </p>
                      <p className="text-sm text-foreground">{item.description}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">Key Features</h3>
            <div className="mt-3 flex flex-col gap-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                    <feature.icon className="size-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">Tech Stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <p className="text-center text-xs text-muted-foreground">
            Built by Chiao-Fan Yang
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
