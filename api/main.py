from fastapi import APIRouter

from api.routes import login
from core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)