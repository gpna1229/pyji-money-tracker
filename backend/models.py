from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from typing import Optional

from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    google_id = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    accounts = relationship("Account", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    initial_balance = Column(Integer, default=0)
    category = Column(String(30), nullable=False)

    user = relationship("User", back_populates="accounts")
    src_transactions = relationship("Transaction", foreign_keys="[Transaction.account_id]", back_populates="account")
    dest_transactions = relationship("Transaction", foreign_keys="[Transaction.to_account_id]", back_populates="to_account")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    to_account_id = Column(Integer, ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(15), nullable=False)
    amount = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)
    counterparty = Column(String(100), nullable=True)
    note = Column(Text, nullable=True)
    transaction_date = Column(Date, nullable=False) 
    accounting_date = Column(Date, nullable=False) 
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="transactions")
    account = relationship("Account", foreign_keys=[account_id], back_populates="src_transactions")
    to_account = relationship("Account", foreign_keys=[to_account_id], back_populates="dest_transactions")

    @property
    def account_name(self):
        return self.account.name if self.account else "未知帳戶"