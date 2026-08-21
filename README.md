# ChiaoGPT

A personal RAG chatbot that answers questions about my background, built end to end (frontend, API, retrieval pipeline, and infrastructure) to demonstrate real AI engineering rather than a wrapper around a chat API.

**Live demo:** [https://chiaogpt.chiaofan.co/](https://chiaogpt.chiaofan.co/)

## What this is

Ask it about my experience, projects, or skills and it retrieves the relevant parts of my resume and project write-ups, then generates an answer grounded in that context using Claude Haiku on AWS Bedrock. Every answer shows which source document(s) it pulled from, so the reasoning is traceable, not a black box.

This isn't built on LangChain, a no-code RAG builder, or a hosted vector DB service. The chunking, embedding, retrieval, and prompt logic are all hand-written, so the tradeoffs at each step are deliberate choices, not framework defaults.

## Architecture

```
 React SPA (Vite + TypeScript)
            |
            | REST (JSON)
            v
 FastAPI on AWS Lambda + API Gateway
            |
            | SQL + vector similarity search
            v
 Supabase (Postgres + pgvector)
            ^
            | embeddings written at ingestion time
            |
 Python ingestion pipeline (offline, run manually)
```

Two separate paths write to and read from the same database:

1. **Ingestion (offline):** markdown source documents get chunked, embedded, and stored in Postgres ahead of time.
2. **Query (live):** a user's question gets embedded the same way, matched against stored chunks by vector similarity, and the top matches are handed to the LLM as context.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, react-markdown |
| API | FastAPI, Mangum (ASGI to Lambda adapter), AWS Lambda, API Gateway |
| Database | Supabase (Postgres) with the pgvector extension |
| LLM | Claude Haiku 4.5 via AWS Bedrock |
| Embeddings | Amazon Titan Text Embeddings V2 (1024 dimensions) |
| Auth | AWS IAM roles, no hardcoded credentials |
| Hosting | S3 + CloudFront (frontend), Lambda + API Gateway (backend) |

## How retrieval works

**Ingestion** (`rag_pipeline/`): each markdown document is split into chunks along its `##` headings, so a chunk is always one complete, coherent section rather than an arbitrary fixed-size window that might cut a thought in half. Each chunk is embedded with Titan and inserted into a `documents` table in Postgres alongside its source filename.

**Query** (`agent_api/`): an incoming question is embedded the same way, then matched against stored chunks using pgvector's cosine similarity via a `match_documents` Postgres function, returning the top 5 closest chunks. Those chunks are joined into a system prompt and sent to Claude Haiku, which is instructed to answer only from that context and to match the grammatical person of the question (first person if asked "what's your experience," third person if asked "what's Chiao's experience"). The response returns the generated answer plus the deduplicated list of source filenames used.

## Project structure

```
chiaogpt/
  frontend/            React chat UI, deployed as a static site
    src/
      components/       Chat thread, message bubbles, input bar, info panel
      components/ui/    shadcn/ui primitives (button, dialog, avatar, scroll-area)
      lib/               API client, class-name utility
  agent_api/            FastAPI app, deployed to Lambda
    main.py              Route definitions, request and response models, CORS
    answer.py            Retrieval, prompt construction, and generation logic
  rag_pipeline/         Offline ingestion pipeline (run manually, not deployed)
    chunker.py           Splits markdown into heading-based chunks
    embedder.py           Wraps the Bedrock embedding call
    db.py                Supabase client and insert logic
    ingest.py             Runs the full pipeline over every knowledge base document
  knowledge_base/       Source markdown: resume, bio, and project write-ups
```

## Key engineering decisions

- **IAM roles instead of API keys.** The Lambda function's access to Bedrock is granted through an IAM role, not a hardcoded key sitting in an environment variable.
- **Serverless by default.** Both the API and the ingestion trigger scale to zero. There's no server running (and no cost) when nobody's asking questions.
- **Semantic search, not keyword search.** Retrieval is cosine similarity over embedding vectors, so it matches meaning ("cloud infrastructure experience") even when the wording in the source document is different ("built and deployed on AWS").
- **Heading-based chunking.** Chunks are split on markdown structure the documents already have, so each one is a self-contained unit of meaning instead of an arbitrary character count.
- **Source citation on every answer.** The API always returns which document(s) it drew from, so an answer can be checked against its source rather than trusted blindly.

## Running locally

**Frontend**
```
cd frontend
npm install
npm run dev
```

**Ingestion pipeline** (only needed if the knowledge base changes)
```
cd rag_pipeline
pip install -r requirements.txt
python ingest.py
```

Both `agent_api/` and `rag_pipeline/` expect a `.env` file with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; AWS credentials for Bedrock are picked up from your configured AWS CLI profile, not from environment variables.

## Deployment

The frontend builds to a static bundle and ships to S3, served through CloudFront. The API runs as a single Lambda function behind API Gateway, wrapped with Mangum so the same FastAPI app used in development runs unchanged in production.

---

Built by Chiao-Fan Yang
