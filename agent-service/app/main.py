from fastapi import FastAPI

from .routers import health, analysis, compatibility

app = FastAPI(title="Pernect Agent Service", version="0.1.0")

app.include_router(health.router)
app.include_router(analysis.router)
app.include_router(compatibility.router)
