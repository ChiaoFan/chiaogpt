import json
import os
import boto3
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")


def get_embedding(text: str) -> list[float]:
    """Turns text into a 1024-number vector using Titan Text Embeddings V2."""
    body = json.dumps({"inputText": text})
    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v2:0",
        body=body,
        contentType="application/json",
        accept="application/json",
    )
    response_body = json.loads(response["body"].read())
    return response_body["embedding"]


def search(query: str, k: int = 3) -> list[dict]:
    """Embeds a question and retrieves the k closest matching chunks."""
    query_embedding = get_embedding(query)
    response = supabase.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_count": k,
    }).execute()
    return response.data


def generate_answer(question: str, chunks: list[dict]) -> str:
    """
    Sends the question plus retrieved chunks to Claude Haiku,
    and returns its generated answer.
    """
    context = "\n\n".join(c["content"] for c in chunks)

    system_prompt = (
        "You are chiaochiaogpt, an AI assistant that answers questions about "
        "Chiao-Fan Yang's professional background, using ONLY the context "
        "provided below.\n\n"
        "Match the grammatical person of the question:\n"
        "- If asked in second person (e.g. \"what AWS skills do you have\", "
        "\"tell me about your experience\"), answer AS Chiao, in first person "
        "(\"I have...\", \"I built...\").\n"
        "- If asked in third person (e.g. \"what AWS skills does Chiao have\", "
        "\"tell me about her experience\"), answer ABOUT Chiao, in third "
        "person (\"Chiao has...\", \"She built...\").\n\n"
        "Answer confidently and focus only on what IS relevant in the "
        "context to the question asked. Do not volunteer weaknesses, "
        "hedge about limited experience, or suggest other candidates might "
        "be a better fit, even if some retrieved context is only loosely "
        "related — simply don't mention the loosely related parts. Stay "
        "positive and highlight genuine strengths from the context.\n\n"
        "Answer naturally and conversationally. If the context doesn't "
        "contain the answer at all, say you don't have that information "
        "rather than guessing.\n\n"
        f"Context:\n{context}"
    )

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 500,
        "system": system_prompt,
        "messages": [
            {"role": "user", "content": question}
        ],
    })

    response = bedrock.invoke_model(
        modelId="us.anthropic.claude-haiku-4-5-20251001-v1:0",
        body=body,
        contentType="application/json",
        accept="application/json",
    )

    response_body = json.loads(response["body"].read())
    return response_body["content"][0]["text"]


def answer_question(question: str, debug: bool = False) -> dict:
    """
    The full pipeline: retrieve relevant chunks, generate an answer,
    and return both the answer and which sources were used.
    """
    chunks = search(question, k=5)  # bumped from 3 to 5 - currently testing this

    if debug:
        print(f"--- Retrieved chunks for: '{question}' ---")
        for c in chunks:
            preview = c["content"][:60].replace("\n", " ")
            print(f"  [{c['similarity']:.3f}] ({c['source']}) {preview}...")
        print()

    answer = generate_answer(question, chunks)
    sources = list(set(c["source"] for c in chunks))
    return {"answer": answer, "sources": sources}


if __name__ == "__main__":
    for q in [
        "What AWS experience do you have?",
        "What AWS experience does Chiao have?",
        "What AWS experience does Chiao-Fan have?",
    ]:
        result = answer_question(q, debug=True)
        print(f"Q: {q}")
        print(result["answer"])
        print()