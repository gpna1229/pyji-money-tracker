from sqlalchemy.orm import Session

from models import User, Account

def create_new_user(session: Session, email, name, google_id):
    new_user = User(email=email, name=name, google_id=google_id)

    default_accounts = [
        Account(name="現金", category="現金", initial_balance=0),
    ]
    
    new_user.accounts.extend(default_accounts)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user