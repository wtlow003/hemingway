import asyncio
import json
import logging
import os
import time
from collections import defaultdict
from dotenv import load_dotenv
import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agents import Runner, set_default_openai_client, set_tracing_disabled
from custom_agents import (
    create_contradiction_detector_agent,
    create_format_checker_agent,
    create_general_issue_detector_agent,
    create_instruction_extractor_agent,
    create_prompt_rewriter_agent,
)
from models.instruction import InstructionList
from models.improvement import ImprovementList
from models.issue import GeneralIssues, ContradictionIssues, FormatIssues
from utils import _get_openai_client


class AnalysisRequest(BaseModel):
    model: str
    prompt: str


class AnalysisResponse(BaseModel):
    changes: bool
    optimized_prompt: str
    extracted_instructions: InstructionList
    general_issues: GeneralIssues
    contradiction_issues: ContradictionIssues
    format_issues: FormatIssues
    improvements: ImprovementList


load_dotenv()
logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.INFO)  # Set the logging level

# Rate limiting configuration
RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_WINDOW = 600  # 10 minutes in seconds
rate_limiter = defaultdict(list)  # model -> [timestamps]


def check_rate_limit(model: str) -> bool:
    """Check if the model has exceeded the rate limit"""
    current_time = time.time()
    model_requests = rate_limiter[model]

    # Remove old requests outside the time window
    rate_limiter[model] = [
        timestamp
        for timestamp in model_requests
        if current_time - timestamp < RATE_LIMIT_WINDOW
    ]

    # Check if under the limit
    if len(rate_limiter[model]) >= RATE_LIMIT_REQUESTS:
        return False

    # Add current request timestamp
    rate_limiter[model].append(current_time)
    return True


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/analyze")
async def analyze(request: AnalysisRequest = Body(...)) -> AnalysisResponse:
    model, prompt = request.model, request.prompt
    logger.info(f"Received request for model: {model}")

    # Check rate limit
    if not check_rate_limit(model):
        raise HTTPException(
            status_code=429, detail=f"Rate limit exceeded for model {model}."
        )

    # prefix model for non-openai models
    match model:
        case "gemini-2.5-flash":
            model = f"litellm/gemini/{model}"
        case "gemini-2.5-pro":
            model = f"litellm/gemini/{model}"
        case "kimi-k2-0711-preview":
            model = f"litellm/moonshot/{model}"
        case "claude-4-sonnet-20250514":
            model = f"litellm/anthropic/{model}"
        case _:
            model = model

    set_default_openai_client(_get_openai_client(), use_for_tracing=False)
    set_tracing_disabled(True)

    tasks = [
        Runner.run(create_instruction_extractor_agent(model), prompt),
        Runner.run(create_general_issue_detector_agent(model), prompt),
        Runner.run(create_contradiction_detector_agent(model), prompt),
        Runner.run(create_format_checker_agent(model), prompt),
    ]
    results = await asyncio.gather(*tasks)

    # unpack results
    instructions: InstructionList = results[0].final_output
    general_issues: GeneralIssues = results[1].final_output
    contradiction_issues: ContradictionIssues = results[2].final_output
    format_issues: FormatIssues = results[3].final_output

    optimized_prompt: str = ""
    improvements: ImprovementList = []
    if (
        general_issues.has_issues
        or contradiction_issues.has_issues
        or format_issues.has_issues
    ):
        pr_inputs = {
            "ORIGINAL_PROMPT": prompt,
            "EXTRACTED_INSTRUCTIONS": instructions.model_dump(),
            "GENERAL_ISSUES": (
                general_issues.model_dump() if general_issues.has_issues else []
            ),
            "CONTRADICTION_ISSUES": (
                contradiction_issues.model_dump()
                if contradiction_issues.has_issues
                else []
            ),
            "FORMAT_ISSUES": (
                format_issues.model_dump() if format_issues.has_issues else []
            ),
        }
        pr_res = await Runner.run(
            create_prompt_rewriter_agent(model), json.dumps(pr_inputs)
        )
        optimized_prompt = pr_res.final_output.optimized_prompt
        improvements = pr_res.final_output.improvements

    return AnalysisResponse(
        changes=(
            True
            if general_issues.has_issues
            or contradiction_issues.has_issues
            or format_issues.has_issues
            else False
        ),
        optimized_prompt=optimized_prompt,
        improvements=improvements,
        extracted_instructions=instructions,
        general_issues=general_issues,
        contradiction_issues=contradiction_issues,
        format_issues=format_issues,
    )


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=4000, reload=True)
