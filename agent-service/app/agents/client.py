"""OpenRouter client setup for OpenAI Agents SDK."""

from openai import AsyncOpenAI
from agents import set_default_openai_client, set_default_openai_api
from agents.models.openai_chatcompletions import OpenAIChatCompletionsModel

from ..config import settings

_client: AsyncOpenAI | None = None


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
            default_headers={
                "HTTP-Referer": "https://pernect.app",
                "X-Title": "Pernect",
            },
        )
        set_default_openai_client(_client)
        set_default_openai_api("chat_completions")
    return _client


def get_model(model_name: str) -> OpenAIChatCompletionsModel:
    """OpenRouter経由のモデルオブジェクトを返す。"""
    return OpenAIChatCompletionsModel(
        model=model_name,
        openai_client=get_client(),
    )
