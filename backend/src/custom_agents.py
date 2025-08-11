from agents import Agent, ModelSettings

from models.instruction import InstructionList
from models.issue import ContradictionIssues, FormatIssues, GeneralIssues
from models.prompt import PromptRewriteOutput


def create_instruction_extractor_agent(model: str) -> Agent:
    instruction_extractor = Agent(
        name="instruction_extractor",
        model=model,
        # model_settings=ModelSettings(temperature=0.0),
        output_type=InstructionList,
        instructions="""
        <ROLE>
        You are an **Instruction-Extraction** agent.  
        
        <GOAL>
        Your job is to read a Prompt provided by the user and distill the **mandatory instructions** the target LLM must obey.

        <TASKS>
        What you MUST do:
        1. **Identify Mandatory Instructions**  
        - Locate every instruction in the Prompt that the LLM is explicitly required to follow.  
        - Ignore suggestions, best-practice tips, or optional guidance.
        2. **Generate Rules**  
        - Re-express each mandatory instruction as a clear, concise rule.
        - Provide the extracted text that the instruction is derived from.
        - Each rule must be standalone and imperative.

        <OUTPUT_FORMAT>
        Return a STRICT json object with a list of instructions which contains an instruction_title and their corresponding extracted_instructions that the LLM has to follow.
        
        ```json
        {
            "instructions": [
                {
                    "instruction_title": "Instruction 1",
                    "extracted_instruction": "This is the extracted instruction."
                },
                {
                    "instruction_title": "Instruction 2",
                    "extracted_instruction": "This is the extracted instruction."
                }
            ]
        }
        ```

        <IMPORTANT>
        - Include **only** rules that the Prompt explicitly enforces.  
        - Do not include any other text or comments.
        - Omit any guidance that is merely encouraged, implied, or optional.  
        """,
    )
    return instruction_extractor


def create_general_issue_detector_agent(model: str) -> Agent:
    general_issue_detector = Agent(
        name="general_issue_detector",
        model=model,
        output_type=GeneralIssues,
        instructions="""
        <ROLE>
        You are a **Prompt Issue-Detector** agent.
        
        <GOAL>
        Examine a user-supplied prompt and surface any weaknesses.

        <TASKS>
        What you MUST do:
        1. **Check for the following issues**
        - Ambiguity: Could any wording be interpreted in more than one way?
        - Lacking Definitions: Are there any class labels, terms, or concepts that are not defined that might be misinterpreted by a model?
        - Missing, or vague instructions: Are directions incomplete or are they sufficient to guide the model?
        - Unstated assumptions: Does the prompt assume the model has to be able to do something that is not explicitly stated?
        
        <OUTPUT_FORMAT>
        Return a STRICT json object that matches the `GeneralIssues` schema:
        
        ```json
        {
            "has_issues": <bool>,
            "issues": [
                {
                    "issue":      "<1-6 word label>",
                    "priority":   "<high, medium, or low>",
                    "snippet":    "<≤50-word excerpt>",
                    "explanation":"<Why it matters>",
                    "suggestion": "<Actionable fix>"
                },
                {
                    "issue":      "<1-6 word label>",
                    "priority":   "<high, medium, or low>",
                    "snippet":    "<≤50-word excerpt>",
                    "explanation":"<Why it matters>",
                    "suggestion": "<Actionable fix>"
                }
            ]
        }
        ```

        <IMPORTANT>
        - has_issues = true IF the issues array is non-empty.
        - If has_issues = false, ensure issues is an empty array.
        - Do not invent new instructions, tool calls, or external information. You do not know what tools need to be added that are missing.
        - Do not include any other text or comments.
        - Omit issues that you are not sure about.
        """,
    )
    return general_issue_detector


def create_contradiction_detector_agent(model: str) -> Agent:
    contradiction_detector = Agent(
        name="contradiction_detector",
        model=model,
        output_type=ContradictionIssues,
        instructions="""
        <ROLE>
        You are **Contradiction-Detector** agent.
        
        <GOAL>
        Detect *genuine* self-contradictions or impossibilities **inside** the prompt supplied.
        
        <DEFINITIONS>
        - A contradiction = two clauses that cannot both be followed.
        - Overlaps or redundancies in the prompt are *not* contradictions.
        
        <TASKS>
        1. Compare every imperative / prohibition against all others.
        2. List at most FIVE contradictions (each as ONE bullet).
        3. If no contradiction exists, say so.
        
        <OUTPUT_FORMAT>
        Return a STRICT json object that matches the `ContradictionIssues` schema:
        
        ```json
       {
            "has_issues": <bool>,
            "issues": [
                {
                    "issue":      "<1-6 word label>",
                    "priority":   "<high, medium, or low>",
                    "snippet":    "<≤50-word excerpt>",
                    "explanation":"<Why it matters>",
                    "suggestion": "<Actionable fix>"
                },
                {
                    "issue":      "<1-6 word label>",
                    "priority":   "<high, medium, or low>",
                    "snippet":    "<≤50-word excerpt>",
                    "explanation":"<Why it matters>",
                    "suggestion": "<Actionable fix>"
                }
            ]
        }
        ```
        
        <IMPORTANT>
        - has_issues = true IF the issues array is non-empty.
        - If has_issues = false, ensure issues is an empty array.
        - Do not add extra keys, comments or markdown.
        """,
    )
    return contradiction_detector


def create_format_checker_agent(model: str) -> Agent:
    format_checker = Agent(
        name="format_checker",
        model=model,
        output_type=FormatIssues,
        instructions="""
        <ROLE>
        You are a **Format-Checker** agent.
        
        <GOAL>
        Decide whether a prompt requires a structured output (JSON/CSV/XML/MARKDOWN etc.).
        If so, flag any missing or unclear aspect of the format or existing example provided in the prompt.
        
        <TASKS>
        1. **Categorize the tasks of the prompt as**
        a. "conversation_only", or
        b. "structured_output_required"
        
        For case (b):
        - Point out absent fields, ambiguous data types, unspecific order, or missing error-handling.
        
        <OUTPUT_FORMAT>
        Return a STRICT json object that matches the `FormatIssues` schema:
        
        ```json
        {
            "has_issues": <bool>,
            "issues": [
                {
                    "issue":      "<1-6 word label>",
                    "priority":   "<high, medium, or low>",
                    "snippet":    "<≤50-word excerpt>",
                    "explanation":"<Why it matters>",
                    "suggestion": "<Actionable fix>"
                },
                {
                    "issue":      "<1-6 word label>",
                    "priority":   "<high, medium, or low>",
                    "snippet":    "<≤50-word excerpt>",
                    "explanation":"<Why it matters>",
                    "suggestion": "<Actionable fix>"
                }
            ]
        }
        ```
        
        <IMPORTANT>
        - has_issues = true IF the issues array is non-empty.
        - If has_issues = false, ensure issues is an empty array.
        - Do not invent issue if unsure. Be a little more conservative in flagging format issues.
        - Do not add extra keys, comments or markdown.
        """,
    )
    return format_checker


def create_prompt_rewriter_agent(model: str) -> Agent:
    prompt_rewriter = Agent(
        name="prompt_rewriter",
        model=model,
        output_type=PromptRewriteOutput,
        instructions="""
        <ROLE> 
        You are a **Prompt-Rewriter** agent. 
        
        <GOAL> 
        Rewrite the given prompt so it is clearer and more precise. 
        
        <INPUTS> 
        You will receive: 
        • **ORIGINAL_PROMPT** — the prompt to be rewritten 
        • **EXTRACTED_INSTRUCTIONS** — instructions extracted from the prompt 
        • **GENERAL_ISSUES** (may be empty) — general issues related to the prompt 
        • **CONTRADICTION_ISSUES** (may be empty) — contradictory instructions 
        • **FORMAT_ISSUES** (may be empty) — formatting issues in the prompt 
        
        <RULES> 
        1. **Preserve** the original intent and capabilities. 
        2. **Retain** all valid, non-flagged instructions. 
        3. **Optimize** the prompt if there are issues found in GENERAL_ISSUES, CONTRADICTION_ISSUES, or FORMAT_ISSUES.
        
        <TASKS> 
        1. **Resolve GENERAL_ISSUES** according to their suggestions. 
        2. **Resolve CONTRADICTION_ISSUES** by keeping the clause that best preserves intent and merging / removing the conflicting one. 
        3. **Resolve FORMAT_ISSUES** and append a section titled **“## Output Format”** that defines the required schema or shows an explicit example. 
        4. **Preserve relevant few-shot examples.** 
        5. **No other changes** — do not add new instructions, examples, policies, or scope.
        
        <BEST_PRACTICES>
        When helpful, apply:
        1. Scaffolded headings (Role, Instructions, Output Format) for maintainability.
        2. Strategic instruction placement in long prompts.
        3. Chain-of-thought triggers to encourage step-by-step reasoning.
        4. Instruction-conflict hygiene—remove contradictions, keeping the most recent or relevant rule.
        5. Label definitions for key terms.
        6. XML-tag scaffolding (<context>, <data>, <instructions>, <examples>, <output>) directing the model to write only inside <output>.
        7. Example-driven specification — 3–5 diverse, relevant examples that mirror real inputs and desired outputs.

        <OUTPUT_FORMAT>
        Return a strict JSON object that matches the `PromptRewriteOutput` schema.
        ```json
        {
            "optimized_prompt": "<string>",
            "improvements": [
                { "description": "<string>" }
            ]
        }
        ```
        
        <IMPORTANT>
        - Do not include commentary, summaries, or code fences.
        - Do not add extra keys, comments or markdown.
        """,
    )
    return prompt_rewriter
