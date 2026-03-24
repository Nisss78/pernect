from __future__ import annotations

from pydantic import BaseModel


class AnalysisOutput(BaseModel):
    title: str
    summary: str
    insights: list[str]
    strengths: list[str]
    challenges: list[str]
    recommendations: list[str]


class DeepSection(BaseModel):
    category: str
    insight: str
    advice: str


class DeepCompatibilityOutput(BaseModel):
    title: str
    overview: str
    sections: list[DeepSection]
    hiddenDynamics: str
    growthPath: str
