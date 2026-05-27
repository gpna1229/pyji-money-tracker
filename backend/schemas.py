from typing import Optional
from datetime import date

from pydantic import BaseModel, Field, ConfigDict

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class GoogleCredentialRequest(BaseModel):
    id_token: str

class ErrorResponse(BaseModel):
    field: str
    message: str

class TransactionBase(BaseModel):
    account_id: int = Field(..., description="交易主帳戶")
    to_account_id: Optional[int] = Field(None, description="轉帳目標帳戶")
    type: str = Field(..., description="交易型態：EXPENSE, INCOME, TRANSFER")
    amount: int = Field(..., gt=0, description="交易金額，必須大於 0")
    category: str = Field(..., max_length=50, description="帳目分類，如：飲食、交通")
    counterparty: Optional[str] = Field(None, max_length=100, description="交易對象，如：7-11、朋友")
    note: Optional[str] = Field(None, description="備註說明")
    transaction_date: date = Field(..., description="交易日期")
    accounting_date: date = Field(..., description="憑證日期")


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    account_name: str
    model_config = ConfigDict(from_attributes=True)


class TransactionUpate(TransactionBase):
    account_name: str | None = None
    type: str | None = None
    amount: int | None = None
    category: str | None = None
    counterparty: str | None = None
    note: str | None = None
    transaction_date: date | None = None
    accounting_date: date | None = None


class AccountBase(BaseModel):
    name: str
    initial_balance: int
    category: str


class AccountCreate(AccountBase):
    pass


class AccountResponse(AccountBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class AccountUpdate(AccountBase):
    name: str | None = Field(default=None, max_length=50)
    initial_balance: int | None = None
    category: str | None = Field(default=None, max_length=30)