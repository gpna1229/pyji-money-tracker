from typing import List

from fastapi import APIRouter, status, HTTPException
from sqlalchemy.orm import joinedload

from api.deps import SessionDep, CurrentUser
from models import Transaction
from schemas import TransactionResponse, TransactionCreate, TransactionUpate

router = APIRouter(tags=["transactions"])

@router.get("/transactions/", response_model=List[TransactionResponse])
def get_transactions(
    session: SessionDep, current_user: CurrentUser
):
    db_transactions = session.query(Transaction).options(
        joinedload(Transaction.account)
    ).filter(
        Transaction.user_id == current_user.id
    ).order_by(
        Transaction.transaction_date.desc() 
    ).all()
    
    return db_transactions


@router.post("/transactions/create", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    session: SessionDep, transaction_in: TransactionCreate, current_user: CurrentUser
):
    transaction = Transaction(
        **transaction_in.model_dump(),
        user_id=current_user.id
    )

    session.add(transaction) 
    session.commit()           
    session.refresh(transaction)

    return transaction


@router.delete("/transactions/delete")
def delete_transaction(
    session: SessionDep, id: int, current_user: CurrentUser
):
    transaction = session.query(Transaction).filter(
        Transaction.id == id,
        Transaction.user_id == current_user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="查無帳戶！")
    
    session.delete(transaction)
    session.commit()

    return {"message": "本筆交易已成功刪除！"}


@router.patch("/transactions/{transaction_id}/update")
def update_transaction(
    session: SessionDep, transaction_in: TransactionUpate, current_user: CurrentUser, transaction_id: int
):
    transaction = session.query(Transaction).filter(
        Transaction.id == transaction_id, 
        Transaction.user_id == current_user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="交易不存在")
    
    update_data = transaction_in.model_dump(exclude_unset=True, exclude_none=True)

    for key, value in update_data.items():
        setattr(transaction, key, value)

    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return transaction