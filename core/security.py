from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from google.oauth2 import id_token
from google.auth.transport import requests

from core.config import settings

def verify_google_token(token: str) -> dict | None:
    try:
        id_info = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        return id_info
        
    except ValueError:
        return None

def create_access_token(subject: str | Any, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=1440)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm="HS256"
    )
    return encoded_jwt