from typing import List

from pydantic import BaseModel, Field


class Instruction(BaseModel):
    instruction_title: str = Field(
        description="A 2-8 word title of the instruction that the LLM has to follow."
    )
    extracted_instruction: str = Field(
        description="The exact text that was extracted from the prompt that the instruction is derived from."
    )


class InstructionList(BaseModel):
    """Structured ouput returned by instruction extractors."""

    instructions: List[Instruction] = Field(
        description="A list of instructions and their corresponding extracted text that the LLM has to follow."
    )
