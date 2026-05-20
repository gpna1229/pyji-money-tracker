from fastapi import APIRouter, HTTPException

from api.deps import SessionDep
from core import security
from models import GoogleCredentialRequest, User

router = APIRouter(tags=["login"])


@router.post("/login/google")
def login_google(
    session: SessionDep, payload: GoogleCredentialRequest
):
    google_user = security.verify_google_token(payload.token)
    if not google_user:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    
    email = google_user.get("email")
    google_id = google_user.get("sub")
    name = google_user.get("name")

    if not email:
        raise HTTPException(status_code=400, detail="Google account missing email")
    
    db_user = session.query(User).filter(User.email == email).first()
    
    if not db_user:
        db_user = User(
            email=email,
            name=name,
            google_id=google_id
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

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