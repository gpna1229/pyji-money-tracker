from fastapi import APIRouter, status

from api.deps import SessionDep, CurrentUser
from models import Transaction
from schemas import TransactionResponse, TransactionCreate

router = APIRouter(tags=["transactions"])

@router.post("/transactions/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    session: SessionDep, item_in: TransactionCreate, current_user: CurrentUser
):
    db_transaction = Transaction(
        **item_in.model_dump(),
        user_id=current_user.id
    )

    session.add(db_transaction) 
    session.commit()           
    session.refresh(db_transaction)
    
    return db_transaction