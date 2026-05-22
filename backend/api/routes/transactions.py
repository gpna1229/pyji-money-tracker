from typing import List

from fastapi import APIRouter, status, HTTPException

from api.deps import SessionDep, CurrentUser
from models import Transaction
from schemas import TransactionResponse, TransactionCreate

router = APIRouter(tags=["transactions"])

@router.get("/transactions/", response_model=List[TransactionResponse])
def get_transactions(
    session: SessionDep, current_user: CurrentUser
):
    db_transactions = session.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    transactions = []
    for t in db_transactions:
        account_name = t.account.name if t.account else "未知帳戶"
        transactions.append({
            **t.__dict__,
            "account_name": account_name
        })
    return transactions


@router.post("/transactions/create", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    session: SessionDep, item_in: TransactionCreate, current_user: CurrentUser
):
    transaction = Transaction(
        **item_in.model_dump(),
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