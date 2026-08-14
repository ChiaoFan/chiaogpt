from embedder import get_embedding
from db import supabase


def search(query: str, k: int = 3) -> list[dict]:
    """
    Embeds a question and returns the k closest matching chunks
    from the documents table, using the match_documents SQL function.
    """
    query_embedding = get_embedding(query)

    response = supabase.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_count": k,
    }).execute()

    return response.data


if __name__ == "__main__":
    question = "how many companies Chiao work before?"
    results = search(question)

    print(f"Question: {question}\n")
    for r in results:
        preview = r["content"][:100].replace("\n", " ")
        print(f"[similarity {r['similarity']:.3f}] ({r['source']}) {preview}...")
        print()