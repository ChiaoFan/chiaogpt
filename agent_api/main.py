from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mangum import Mangum
from answer import answer_question

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str


class AnswerResponse(BaseModel):
    answer: str
    sources: list[str]


@app.get("/health")
def health():
    """Simple check that the API is running at all - useful for debugging deploys."""
    return {"status": "ok"}


@app.post("/ask", response_model=AnswerResponse)
def ask(request: QuestionRequest):
    """
    Main endpoint: takes a question, runs it through the RAG pipeline,
    returns the generated answer and which source documents were used.
    """
    result = answer_question(request.question)
    return result


# This is what Lambda actually calls - wraps our FastAPI app so it can
# receive events from API Gateway instead of a normal network connection.
handler = Mangum(app)