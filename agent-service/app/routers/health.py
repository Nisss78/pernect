from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/api/v1/health")
async def health() -> dict:
    return {"status": "ok", "service": "pernect-agent-service"}
