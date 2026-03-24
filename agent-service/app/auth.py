from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import settings

_scheme = HTTPBearer()


async def verify_token(
    creds: HTTPAuthorizationCredentials = Depends(_scheme),
) -> str:
    if creds.credentials != settings.AGENT_SERVICE_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid service token",
        )
    return creds.credentials
