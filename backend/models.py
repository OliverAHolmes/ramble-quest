"""
This module defines models and utility functions for handling geographic features.
"""
from typing import Optional
from datetime import datetime as dt
from sqlmodel import Field, SQLModel, Column, JSON


class Feature(SQLModel, table=True):
    """Represents a geographic feature stored in the database."""

    __tablename__ = "feature"
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    feature_name: str = Field(
        description="Name of feature, from the file name.",
    )
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
