"""
This module defines models and utility functions for handling geographic features.
"""
from typing import Optional, List
from datetime import datetime as dt
from sqlmodel import Field, SQLModel, Relationship


class FeatureCollection(SQLModel, table=True):
    """Represents a collection of geographic features."""

    __tablename__ = "feature_collection"
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    name: str = Field(description="Name of the feature collection.")
    features: List["Feature"] = Relationship(
        back_populates="collection",
        sa_relationship_kwargs={
            "cascade": "save-update,merge,expunge,delete,delete-orphan",
        },
    )
    created_at: dt = Field(
        default_factory=dt.utcnow,
        description="Timestamp of when the feature collection was created.",
    )
