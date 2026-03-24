from pydantic_settings import BaseSettings


# サブスクリプション tier → OpenRouter モデルマッピング
# Free ユーザーは AI 分析不可（Convex 側でブロック）
MODEL_TIERS: dict[str, str] = {
    "plus": "anthropic/claude-3.5-haiku",      # $0.80/$4.00 per 1M tokens
    "pro": "anthropic/claude-sonnet-4",         # $3.00/$15.00 per 1M tokens
    "max": "anthropic/claude-sonnet-4",         # Pro と同じモデル
}

DEFAULT_MODEL = "anthropic/claude-3.5-haiku"


def get_model_for_tier(tier: str) -> str:
    """tier に応じたモデルを返す。不明な tier は DEFAULT_MODEL。"""
    return MODEL_TIERS.get(tier, DEFAULT_MODEL)


class Settings(BaseSettings):
    OPENROUTER_API_KEY: str
    AGENT_SERVICE_TOKEN: str

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()  # type: ignore[call-arg]
