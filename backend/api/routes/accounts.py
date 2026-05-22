from typing import List

from fastapi import APIRouter, HTTPException

from api.deps import SessionDep, CurrentUser
from models import Account
from schemas import AccountCreate, AccountResponse

router = APIRouter(tags=["accounts"])


@router.get("/accounts/", response_model=List[AccountResponse])
def get_accounts(
    session: SessionDep, current_user: CurrentUser
):
    db_accounts = session.query(Account).filter(Account.user_id == current_user.id).all()
    
    return db_accounts


@router.post("/accounts/create", response_model=AccountResponse)
def create_account(
    session: SessionDep, item_in: AccountCreate, current_user: CurrentUser
):
    account = Account(
        **item_in.model_dump(),
        user_id=current_user.id
    )
    
    session.add(account) 
    session.commit()           
    session.refresh(account)

    return account


@router.delete("/accounts/delete")
def delete_account(
    session: SessionDep, id: int, current_user: CurrentUser
):
    account = session.query(Account).filter(
        Account.id == id,
        Account.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="查無帳戶！")
    
    if account.src_transactions or account.dest_transactions:
        raise HTTPException(status_code=400, detail="此帳戶已有交易紀錄，無法刪除。")
    
    session.delete(account)
    session.commit()

    return {"message": "帳戶已成功刪除！"}