from sqlmodel import Field, SQLModel
from typing import Optional
from datetime import datetime


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
