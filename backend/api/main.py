from fastapi import APIRouter

from api.routes import login, transactions

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(transactions.router)