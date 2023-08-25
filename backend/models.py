from typing import Optional
from sqlmodel import Field, SQLModel, Column, JSON
from datetime import datetime as dt


class Feature(SQLModel, table=True):
    __tablename__ = 'feature'
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    features: dict = Field(
        sa_column=Column(JSON),
        description="GeoJson Feature object.",
    )
    feature_type: str = Field(
        description="Type of feature. E.g. 'point', 'polygon', line.",
    )
    created_at: dt = Field(
        default_factory=dt.utcnow,
        description="Timestamp of when the feature was created.",
    )