import re
from pathlib import Path


def chunk_markdown(filepath: str, min_words: int = 10) -> list[dict]:
    """
    Splits a markdown file into chunks based on level-2 (##) headings.
    Each chunk = one heading plus everything below it, up to the next ## heading.

    min_words: chunks with fewer words than this are skipped (filters out
    near-empty chunks, like a lone title line with nothing useful in it).

    Returns a list of dicts: {"source": filename, "content": chunk_text}
    """
    path = Path(filepath)
    text = path.read_text(encoding="utf-8")
    source_name = path.name

    # Split right before every line that starts with "## "
    # The (?=## ) lookahead means: split here, but don't consume the "## " itself,
    # so each resulting piece still starts with its own heading.
    parts = re.split(r'\n(?=## )', text)

    chunks = []
    for part in parts:
        part = part.strip()
        if not part:
            continue
        if len(part.split()) < min_words:
            continue  # skip near-empty chunks (e.g. a bare title line)
        chunks.append({
            "source": source_name,
            "content": part
        })

    return chunks


if __name__ == "__main__":
    # Quick manual test: chunk the resume and print a preview of each chunk
    test_chunks = chunk_markdown("../knowledge_base/resume.md")
    print(f"Found {len(test_chunks)} chunks in resume.md:\n")
    for i, c in enumerate(test_chunks, start=1):
        preview = c["content"][:80].replace("\n", " ")
        print(f"Chunk {i} ({len(c['content'].split())} words): {preview}...")