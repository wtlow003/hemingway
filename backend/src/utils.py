import os
from openai import AsyncOpenAI

openai_client: AsyncOpenAI | None = None


def _get_openai_client() -> AsyncOpenAI:
    global openai_client
    if openai_client is None:
        openai_client = AsyncOpenAI()
    return openai_client
