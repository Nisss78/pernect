"""Deep compatibility analysis endpoint — single-call unified agent."""

import json
import logging
import re

from fastapi import APIRouter, Depends
from agents import Runner

from ..auth import verify_token
from ..agents.client import get_client
from ..agents.unified_analyst import create_compatibility_analyst
from ..config import get_model_for_tier
from ..models.requests import DeepCompatibilityRequest
from ..models.responses import DeepCompatibilityOutput

logger = logging.getLogger(__name__)
router = APIRouter(tags=["compatibility"])


def _build_compat_message(req: DeepCompatibilityRequest) -> str:
    u1_tests = "\n".join(
        f"  - {t.testSlug}: {t.resultType}"
        + (f" (scores: {json.dumps(t.scores, ensure_ascii=False)})" if t.scores else "")
        for t in req.user1Tests
    )
    u2_tests = "\n".join(
        f"  - {t.testSlug}: {t.resultType}"
        + (f" (scores: {json.dumps(t.scores, ensure_ascii=False)})" if t.scores else "")
        for t in req.user2Tests
    )
    dim_scores = "\n".join(
        f"  - {i.category}: {i.score}%" for i in req.basicAnalysis.insights
    )
    strengths = "\n".join(f"  - {s}" for s in req.basicAnalysis.strengths)
    challenges = "\n".join(f"  - {c}" for c in req.basicAnalysis.challenges)

    return (
        f"2人の深掘り相性分析を行ってください。\n\n"
        f"【{req.user1Name}の診断結果】\n{u1_tests}\n\n"
        f"【{req.user2Name}の診断結果】\n{u2_tests}\n\n"
        f"【基本相性スコア】\n"
        f"  総合: {req.basicAnalysis.overallCompatibility}%\n{dim_scores}\n\n"
        f"【強み】\n{strengths}\n\n"
        f"【課題】\n{challenges}\n\n"
        f"ツールを使って各テストの詳細情報を取得し、深掘り相性分析をJSON形式で出力してください。"
    )


def _extract_json(text: str) -> dict:
    m = re.search(r"```json\s*([\s\S]*?)\s*```", text)
    if m:
        return json.loads(m.group(1))
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        return json.loads(text[start : end + 1])
    return json.loads(text)


@router.post("/api/v1/compatibility/deep", response_model=DeepCompatibilityOutput)
async def run_deep_compatibility(
    req: DeepCompatibilityRequest,
    _token: str = Depends(verify_token),
) -> DeepCompatibilityOutput:
    get_client()  # ensure client is initialized

    model = get_model_for_tier(req.tier)
    agent = create_compatibility_analyst(model)
    user_msg = _build_compat_message(req)

    logger.info("Running deep compatibility with model=%s tier=%s", model, req.tier)

    # Single agent call: analyze + produce JSON directly
    result = await Runner.run(agent, user_msg)

    data = _extract_json(result.final_output)
    return DeepCompatibilityOutput(**data)
