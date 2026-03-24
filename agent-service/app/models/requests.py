from __future__ import annotations

from pydantic import BaseModel


class TestResultInput(BaseModel):
    resultType: str
    testSlug: str
    testTitle: str | None = None
    scores: dict | None = None
    analysis: dict | None = None
    dimensions: list[str] | None = None
    percentiles: dict[str, float] | None = None


class IntegratedAnalysisRequest(BaseModel):
    theme: str  # "love" | "career" | "general"
    selectedResults: list[TestResultInput]
    tier: str = "plus"  # "plus" | "pro" | "max"


class BasicAnalysisInput(BaseModel):
    overallCompatibility: int
    strengths: list[str]
    challenges: list[str]
    insights: list[InsightInput]


class InsightInput(BaseModel):
    category: str
    score: int
    description: str | None = None


class TestEntry(BaseModel):
    testSlug: str
    resultType: str
    scores: dict | None = None


class DeepCompatibilityRequest(BaseModel):
    user1Name: str
    user2Name: str
    user1Tests: list[TestEntry]
    user2Tests: list[TestEntry]
    basicAnalysis: BasicAnalysisInput
    tier: str = "pro"  # "plus" | "pro" | "max"
