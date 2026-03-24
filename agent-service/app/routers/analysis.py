"""Integrated analysis endpoint — single-call unified agent."""

import json
import logging
import re

from fastapi import APIRouter, Depends
from agents import Runner

from ..auth import verify_token
from ..agents.client import get_client
from ..agents.unified_analyst import create_integrated_analyst
from ..config import get_model_for_tier
from ..models.requests import IntegratedAnalysisRequest
from ..models.responses import AnalysisOutput

logger = logging.getLogger(__name__)
router = APIRouter(tags=["analysis"])


def _build_user_message(req: IntegratedAnalysisRequest) -> str:
    theme_names = {"love": "恋愛", "career": "キャリア", "general": "総合"}
    theme = theme_names.get(req.theme, req.theme)

    results_lines: list[str] = []
    for r in req.selectedResults:
        line = f"- {r.testTitle or r.testSlug}: {r.resultType}"
        if r.scores:
            line += f" (scores: {json.dumps(r.scores, ensure_ascii=False)})"
        if r.percentiles:
            line += f" (percentiles: {json.dumps(r.percentiles, ensure_ascii=False)})"
        if r.dimensions:
            line += f" (dimensions: {r.dimensions})"
        results_lines.append(line)

    return (
        f"以下の診断結果を基に「{theme}」テーマの統合分析を行ってください。\n\n"
        f"【診断結果】\n" + "\n".join(results_lines) + "\n\n"
        f"ツールを使って各テストの詳細情報を取得し、分析結果をJSON形式で出力してください。"
    )


def _extract_json(text: str) -> dict:
    """Extract JSON from agent output, handling markdown code blocks."""
    m = re.search(r"```json\s*([\s\S]*?)\s*```", text)
    if m:
        return json.loads(m.group(1))
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        return json.loads(text[start : end + 1])
    return json.loads(text)


@router.post("/api/v1/analysis/integrated", response_model=AnalysisOutput)
async def run_integrated_analysis(
    req: IntegratedAnalysisRequest,
    _token: str = Depends(verify_token),
) -> AnalysisOutput:
    get_client()  # ensure client is initialized

    model = get_model_for_tier(req.tier)
    agent = create_integrated_analyst(model)
    user_msg = _build_user_message(req)

    logger.info("Running integrated analysis with model=%s tier=%s", model, req.tier)

    # Single agent call: analyze + produce JSON directly
    result = await Runner.run(agent, user_msg)

    data = _extract_json(result.final_output)
    return AnalysisOutput(**data)
