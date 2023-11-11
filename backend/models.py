"""
This module defines models and utility functions for handling geographic features.
"""
from typing import Optional
from datetime import datetime as dt
from sqlmodel import Field, SQLModel, Column, JSON
from geoalchemy2 import Geometry


class Feature(SQLModel, table=True):
    """Represents a geographic feature stored in the database."""

    __tablename__ = "feature"
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    name: str = Field(
        description="Name of feature, from the file name.",
    )
    geometry: str = Field(
        sa_column=Column(Geometry("GEOMETRY", srid=4326)),
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
