# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Prompt Optimizer** application that analyzes and improves prompts using AI agents. It consists of:
- **Frontend**: Next.js 15 React app that provides a UI for prompt analysis
- **Backend**: FastAPI Python server with multiple specialized AI agents for prompt analysis

## Development Commands

**Frontend (must run from `/frontend` directory):**
- **Dev server**: `cd frontend && pnpm dev` (http://localhost:3000)
- **Build**: `cd frontend && pnpm build` 
- **Lint**: `cd frontend && pnpm lint`
- **Start production**: `cd frontend && pnpm start` (serves from `/frontend/out`)

**Backend API (run from `/api` directory):**
- **Dev server**: `cd api && python src/app.py` (http://localhost:4000)
- **Install deps**: `cd api && pip install -r requirements.txt`

## Architecture & Key Components

### Frontend Stack
- **Framework**: Next.js 15 with App Router, React 19, TypeScript
- **UI**: Radix UI components, Tailwind CSS, shadcn/ui component library
- **Styling**: Uses `cn()` utility from `/frontend/lib/utils.ts` for className merging
- **Routing**: Single page app with view state management (`input` → `results`)

### Backend Stack  
- **API**: FastAPI with async/await, rate limiting (10 req/10min per model)
- **AI Agents**: Multiple specialized agents using the `agents` framework:
  - `instruction_extractor_agent`: Extracts mandatory instructions from prompts
  - `general_issue_detector_agent`: Identifies general prompt issues
  - `contradiction_detector_agent`: Detects contradictory instructions  
  - `format_checker_agent`: Checks formatting and structure issues
  - `prompt_rewriter_agent`: Generates optimized prompts and improvements
- **Models**: Supports OpenAI, Anthropic (Claude), Google (Gemini), Moonshot (Kimi) via litellm

### Data Flow
1. User inputs prompt → Frontend calls `/api/analyze` → Backend runs 4 agents in parallel
2. Agents analyze prompt and return structured data (instructions, issues, improvements)
3. If issues found, prompt rewriter agent creates optimized version
4. Frontend displays analysis results with export functionality

### File Structure
- `/frontend/app/`: Next.js app router pages
- `/frontend/components/`: React components (input-view, results-view, export-dialog)
- `/frontend/lib/`: Utilities, types, API client, export functions
- `/api/src/`: FastAPI app, custom agents, data models, utilities
- `/api/src/models/`: Pydantic models for structured outputs

## Key Conventions

### Frontend
- **Imports**: Use `@/` absolute imports (resolves to frontend root via tsconfig paths)
- **Components**: Functional components with TypeScript, interfaces in `/frontend/lib/types.ts`
- **Styling**: Tailwind classes with `cn()` utility for conditional styles
- **State**: React hooks, client components marked with "use client"
- **API**: Server responses transformed in `/frontend/lib/api-client.ts`

### Backend  
- **Models**: Pydantic models in `/api/src/models/` for request/response validation
- **Agents**: Defined in `/api/src/custom_agents.py`, use structured output types
- **Error Handling**: HTTPExceptions with appropriate status codes
- **Environment**: Uses python-dotenv for config, CORS enabled for frontend

### Code Style
- **Files**: kebab-case for files, PascalCase for components, camelCase for variables
- **TypeScript**: Strict mode enabled, build errors ignored in next.config.mjs
- **Python**: Type hints, async/await patterns, structured logging

## Important Notes
- No test framework configured - suggest adding vitest or jest if testing needed
- Frontend builds to static export (`output: "export"` in next.config.mjs)
- Backend requires OpenAI API key and other provider keys via environment variables
- Rate limiting implemented per model to prevent API abuse