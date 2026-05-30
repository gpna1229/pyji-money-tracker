from fastapi import APIRouter, HTTPException

from api.deps import SessionDep
from core import security
from models import User
from schemas import GoogleCredentialRequest
from services.user import create_new_user

router = APIRouter(tags=["login"])


@router.post("/login/google")
def login_google(
    session: SessionDep, payload: GoogleCredentialRequest
):
    google_user = security.verify_google_token(payload.id_token)
    if not google_user:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    
    email = google_user.get("email")
    google_id = google_user.get("sub")
    name = google_user.get("name")

    if not email:
        raise HTTPException(status_code=400, detail="Google account missing email")
    
    db_user = session.query(User).filter(User.email == email).first()
    
    if not db_user:
        db_user = create_new_user(session, email, name, google_id)

    access_token = security.create_access_token(subject=str(db_user.id))
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name
        }
    }

@router.post("/login/test")
def login_test(session: SessionDep):
    test_user = session.query(User).filter(User.id == 1).first()
    
    if not test_user:
        raise HTTPException(status_code=404, detail="測試帳號尚未建立！")
    
    access_token = security.create_access_token(subject=str(test_user.id))
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": test_user.id,
            "email": test_user.email,
            "name": test_user.name
        }
    }