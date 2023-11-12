"""
This module defines models and utility functions for handling geographic features.
"""
from typing import Optional
from datetime import datetime as dt
from sqlmodel import Field, SQLModel, Column, JSON, Relationship, ForeignKey, Integer
from geoalchemy2 import Geometry


class Feature(SQLModel, table=True):
    """Represents a geographic feature stored in the database."""

    __tablename__ = "feature"
    id: int = Field(default=None, primary_key=True, index=True)
    feature_collection_id: int = Field(
        sa_column=Column(
            Integer, ForeignKey("feature_collection.id", ondelete="CASCADE"), nullable=False
        ),
        description="ID of the associated feature collection.",
    )
    geometry: str = Field(
        sa_column=Column(Geometry("GEOMETRY", srid=4326), nullable=False),
        description="Geometry Feature object.",        
    )
    properties: dict = Field(
        sa_column=Column(JSON),
        description="Properties Feature object.",
    )
    created_at: dt = Field(
        default_factory=dt.utcnow,
        description="Timestamp of when the feature was created.",
    )
    collection: "FeatureCollection" = Relationship(back_populates="features")
