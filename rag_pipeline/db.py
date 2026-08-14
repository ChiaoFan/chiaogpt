import os
from dotenv import load_dotenv
from supabase import create_client

# Reads the .env file and loads its values so os.environ can see them.
load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

# One reusable connection to your Supabase project, authenticated
# with the service_role key (full access, server-side only).
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def insert_chunk(source: str, content: str, embedding: list[float]) -> None:
    """
    Inserts one chunk (with its embedding) as a new row in the
    'documents' table we created in Phase 0.
    """
    supabase.table("documents").insert({
        "source": source,
        "content": content,
        "embedding": embedding,
    }).execute()


if __name__ == "__main__":
    # Quick manual test: insert one fake row and confirm no errors.
    insert_chunk(
        source="test.md",
        content="This is a test chunk to confirm the database connection works.",
        embedding=[0.0] * 1024,  # a fake all-zero vector, just for wiring the test
    )
    print("Test row inserted successfully. Check the Table Editor in Supabase.")