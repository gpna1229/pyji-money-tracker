from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine
import models
from api.main import api_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://localhost:5173",   
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        
    allow_credentials=True,
    allow_methods=["*"],             
    allow_headers=["*"],         
)

app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "FastAPI 官方架構後端已成功啟動！"}

@app.get("/test-db")
def test_db():
    from core.database import SessionLocal
    from sqlalchemy import text
    with SessionLocal() as db:
        result = db.execute(text("SELECT 1")).fetchone()
    return {"status": "success", "database_response": result[0]}