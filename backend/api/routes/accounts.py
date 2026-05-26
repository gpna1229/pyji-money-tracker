from typing import List

from fastapi import APIRouter, HTTPException
from sqlalchemy import func

from api.deps import SessionDep, CurrentUser
from models import Account, Transaction
from schemas import AccountCreate, AccountResponse, AccountUpdate

router = APIRouter(tags=["accounts"])


@router.get("/accounts/", response_model=List[AccountResponse])
def get_accounts(
    session: SessionDep, current_user: CurrentUser
):
    db_accounts = session.query(Account).filter(Account.user_id == current_user.id).all()
    
    return db_accounts


@router.post("/accounts/create", response_model=AccountResponse)
def create_account(
    session: SessionDep, account_in: AccountCreate, current_user: CurrentUser
):
    existing = session.query(Account).filter(
        Account.user_id == current_user.id, 
        Account.name == account_in.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400, 
            detail=f"新增失敗：已存在此帳戶囉！"
        )

    account = Account(
        **account_in.model_dump(),
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


@router.get("/accounts/{account_id}/balance")
def get_account_summary(
    session: SessionDep, current_user: CurrentUser, account_id: int
):
    account = session.query(Account).filter(
        Account.id == account_id, 
        Account.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="帳戶不存在")
    
    total_income = session.query(func.sum(Transaction.amount))\
        .filter(Transaction.account_id == account_id, Transaction.type == "INCOME").scalar() or 0
        
    total_expense = session.query(func.sum(Transaction.amount))\
        .filter(Transaction.account_id == account_id, Transaction.type == "EXPENSE").scalar() or 0
    
    balance = account.initial_balance + total_income - total_expense
    
    return {
        "account_id": account_id,
        "account_name": account.name,
        "balance": balance
    }


@router.patch("/accounts/{account_id}/update")
def update_account(
    session: SessionDep, account_in: AccountUpdate, current_user: CurrentUser, account_id: int
):
    account = session.query(Account).filter(
        Account.id == account_id, 
        Account.user_id == current_user.id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="帳戶不存在")
    
    update_data = account_in.model_dump(exclude_unset=True, exclude_none=True)

    for key, value in update_data.items():
        setattr(account, key, value)

    session.add(account)
    session.commit()
    session.refresh(account)

    return account