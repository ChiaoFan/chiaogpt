from chunker import chunk_markdown
from embedder import get_embedding
from db import insert_chunk

# All 6 knowledge base documents to ingest
DOCUMENTS = [
    "../knowledge_base/resume.md",
    "../knowledge_base/project-1-troubleshooting-automation.md",
    "../knowledge_base/project-2-enterprise-onboarding.md",
    "../knowledge_base/project-3-competitive-deal-win.md",
    "../knowledge_base/project-4-new-product-car-registration.md",
    "../knowledge_base/bio-faq.md",
]


def ingest_all():
    total_chunks = 0

    for filepath in DOCUMENTS:
        chunks = chunk_markdown(filepath)
        print(f"\n{filepath}: {len(chunks)} chunks")

        for chunk in chunks:
            embedding = get_embedding(chunk["content"])
            insert_chunk(
                source=chunk["source"],
                content=chunk["content"],
                embedding=embedding,
            )
            total_chunks += 1
            preview = chunk["content"][:50].replace("\n", " ")
            print(f"  Inserted ({len(chunk['content'].split())} words): {preview}...")

    print(f"\nDone. Inserted {total_chunks} chunks total.")


if __name__ == "__main__":
    ingest_all()