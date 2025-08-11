from pydantic import BaseModel

from models.improvement import ImprovementList


class PromptRewriteOutput(BaseModel):
    """Rewriter returns the optmized prompt."""

    optimized_prompt: str
    improvements: ImprovementList
