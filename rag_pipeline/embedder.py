import json
import boto3

# Creates a client connected to Bedrock's runtime API in our chosen region.
# boto3 automatically picks up the credentials we just configured with
# `aws configure` - no keys are written here.
bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")


def get_embedding(text: str) -> list[float]:
    """
    Sends a piece of text to Titan Text Embeddings V2 and returns
    the resulting 1024-number embedding vector.
    """
    # Bedrock expects a JSON string as the request body, with the
    # text to embed under the key "inputText".
    body = json.dumps({"inputText": text})

    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v2:0",
        body=body,
        contentType="application/json",
        accept="application/json",
    )

    # The response body comes back as a stream; .read() gets the raw
    # bytes, and json.loads() parses it into a Python dict.
    response_body = json.loads(response["body"].read())
    # print(f"response_body full: {response_body}")
    # print(f"-----------------------")
    # print(f"-----------------------")
    # print(f"-----------------------")
    # print(f"response_body[embedding]: {response_body["embedding"][:5]}")
    return response_body["embedding"]


if __name__ == "__main__":
    test_text = "Solutions Engineer with experience in API integrations and AWS."
    vector = get_embedding(test_text)
    print(f"Embedding length: {len(vector)}")
    print(f"First 5 numbers: {vector[:5]}")