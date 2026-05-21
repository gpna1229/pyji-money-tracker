from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class GoogleCredentialRequest(BaseModel):
    id_token: str


class TransactionBase(BaseModel):
    account_id: int = Field(..., description="交易主帳戶")
    to_account_id: Optional[int] = Field(None, description="轉帳目標帳戶")
    type: str = Field(..., description="交易型態：EXPENSE, INCOME, TRANSFER")
    amount: int = Field(..., gt=0, description="交易金額，必須大於 0")
    category: str = Field(..., max_length=50, description="帳目分類，如：飲食、交通")
    counterparty: Optional[str] = Field(None, max_length=100, description="交易對象，如：7-11、朋友")
    note: Optional[str] = Field(None, description="備註說明")
    transaction_date: datetime = Field(..., description="交易日期")
    accounting_date: datetime = Field(..., description="憑證日期")


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class AccountBase(BaseModel):
    name: str
    category: str


class AccountResponse(AccountBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)