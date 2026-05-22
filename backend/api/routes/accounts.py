from typing import List

from fastapi import APIRouter

from api.deps import SessionDep, CurrentUser
from models import Account
from schemas import AccountBase, AccountCreate, AccountResponse

router = APIRouter(tags=["transactions"])


@router.post("/accounts/create", response_model=AccountResponse)
def create_user_account(
    session: SessionDep, item_in: AccountCreate, current_user: CurrentUser
):
    db_account = Account(
        **item_in.model_dump(),
        user_id=current_user.id
    )
    
    session.add(db_account) 
    session.commit()           
    session.refresh(db_account)

    return db_account


@router.get("/accounts/", response_model=List[AccountResponse])
def get_user_accounts(
    session: SessionDep, current_user: CurrentUser
):
    db_accounts = session.query(Account).filter(Account.user_id == current_user.id).all()
    
    return db_accounts