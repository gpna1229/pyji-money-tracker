from typing import List

from fastapi import APIRouter

from api.deps import SessionDep, CurrentUser
from models import Account
from schemas import AccountResponse

router = APIRouter(tags=["transactions"])

@router.get("/accounts/", response_model=List[AccountResponse])
def get_user_accounts(
    session: SessionDep, current_user: CurrentUser
):
    db_accounts = session.query(Account).filter(Account.user_id == current_user.id).all()
    
    return db_accounts