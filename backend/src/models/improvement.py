from typing import List
from pydantic import BaseModel, Field


class Improvements(BaseModel):
    description: str = Field(
        description="A 4-7 words description of the improvement made to the prompt."
    )


class ImprovementList(BaseModel):
    improvements: List[Improvements] = Field(..., min_length=1)
