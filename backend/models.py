# models.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class Game(BaseModel):
    id: Optional[str] = None
    name: str
    platform: str
    score: int
    completed: bool
    hoursPlayed: int
    lastPlayed: date
