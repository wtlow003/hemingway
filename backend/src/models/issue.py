from enum import Enum
from typing import List, Literal
from pydantic import BaseModel, Field


class Issue(BaseModel):
    issue: str = Field(description="A 1-6 word label describing the issue.")
    priority: Literal["high", "medium", "low"] = Field(
        description="The priority of the issue."
    )
    snippet: str = Field(description="A ≤50-word excerpt from the prompt.")
    explanation: str = Field(description="Why it matters.")
    suggestion: str = Field(description="Actionable fix.")


class GeneralIssues(BaseModel):
    """General Issues with the Prompt."""

    has_issues: bool = Field(description="Whether the prompt has general issues.")
    issues: List[Issue] = Field(
        description="A list of general issues related to the prompt."
    )

    @classmethod
    def no_issues(cls) -> "GeneralIssues":
        return cls(has_issues=False, issues=[])


class ContradictionIssues(BaseModel):
    """Contradiction Issues with the Prompt."""

    has_issues: bool = Field(description="Whether the prompt has contradiction issues.")
    issues: List[Issue] = Field(
        description="A list of contradiction issues related to the prompt."
    )

    @classmethod
    def no_issues(cls) -> "ContradictionIssues":
        return cls(has_issues=False, issues=[])


class FormatIssues(BaseModel):
    """Formatting Issues with the Prompt."""

    has_issues: bool = Field(description="Whether the prompt has formatting issues.")
    issues: List[Issue] = Field(
        description="A list of formatting issues related to the prompt."
    )

    @classmethod
    def no_issues(cls) -> "FormatIssues":
        return cls(has_issues=False, issues=[])
