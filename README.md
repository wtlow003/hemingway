# Hemingway

  Hemingway analyzes prompts, identifies issues, and suggests clearer rewrites across multiple language models. It
  includes a Next.js frontend and a FastAPI backend.

  ![Prompt Optimizer](./frontend/public/og-image.png)

## Overview

  The application breaks prompt review into a few focused analysis steps:

- extract instructions
- detect general issues
- find contradictions
- check structure and formatting

  It can then generate a revised version of the prompt and suggest improvements.

## Features

### Analysis

- Extracts explicit instructions from a prompt
- Flags clarity, structure, and effectiveness issues
- Detects contradictory requirements
- Checks formatting and overall prompt structure

### Optimization

- Rewrites prompts based on detected issues
- Provides concrete improvement suggestions
- Supports multiple model providers, including OpenAI, Anthropic, Google, and Moonshot

### Interface

- Displays results in separate analysis views
- Shows analysis progress while processing
- Exports output as plain text, Markdown, or Python
- Compares original and rewritten prompts side by side

### Frontend

- Responsive layout for desktop and mobile
- Light and dark theme support
- Animated transitions
- Accessible UI components built with Radix UI

## Architecture

### Frontend

  ```text
  frontend/
  ├── app/                    # Next.js App Router pages
  ├── components/             # React components
  │   ├── ui/                 # shadcn/ui components
  │   ├── input-view.tsx      # Prompt input interface
  │   ├── results-view.tsx    # Analysis results display
  │   └── export-dialog.tsx   # Export functionality
  ├── lib/                    # Utilities and types
  │   ├── api-client.ts       # Backend API integration
  │   ├── types.ts            # TypeScript definitions
  │   └── export-utils.ts     # Export helpers
  └── hooks/                  # Custom React hooks
  ```

### Backend

  ```text
  api/
  ├── src/
  │   ├── app.py              # FastAPI application
  │   ├── custom_agents.py    # AI agent definitions
  │   ├── models/
  │   │   ├── instruction.py
  │   │   ├── issue.py
  │   │   ├── improvement.py
  │   │   └── prompt.py
  │   └── utils.py
  └── requirements.txt
  ```

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- shadcn/ui
- GSAP
- Lucide React

### Backend

- FastAPI
- Python 3.8+
- OpenAI Agents
- litellm
- Pydantic

## Installation

### Requirements

- Node.js 18+
- pnpm
- Python 3.8+
- API keys for any model providers you want to use

### Frontend

  ```text
  cd frontend
  pnpm install
  pnpm dev
  ```

  Frontend runs at <http://localhost:3000>.

### Backend

  ```text
  cd api
  pip install -r requirements.txt
  cp .env.example .env
  python src/app.py
  ```

  API runs at <http://localhost:4000>.

## Environment Variables

  Create api/.env:

  ```text
  OPENAI_API_KEY=your_openai_api_key
  ANTHROPIC_API_KEY=your_anthropic_api_key
  GOOGLE_API_KEY=your_google_api_key
  MOONSHOT_API_KEY=your_moonshot_api_key
  FRONTEND_URL=<http://localhost:3000>
  ```

## Usage

### UI workflow

  1. Enter a prompt.
  2. Select a model.
  3. Run analysis.
  4. Review extracted instructions, issues, and suggested changes.
  5. Export the result if needed.

### API

  ```text
  curl -X POST "http://localhost:4000/api/analyze" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "gpt-4o",
      "prompt": "Your prompt text here"
    }'
  ```

  Example response:
  
  ```json
  {
    "changes": true,
    "optimized_prompt": "Optimized version of your prompt...",
    "extracted_instructions": {
      "instructions": [
        {
          "instruction_title": "Main Task",
          "extracted_instruction": "Specific instruction text..."
        }
      ]
    },
    "general_issues": {
      "has_issues": true,
      "issues": [
        {
          "issue": "Issue description",
          "priority": "high",
          "snippet": "Problematic text",
          "explanation": "Why this is an issue",
          "suggestion": "How to fix it"
        }
      ]
    },
    "improvements": {
      "improvements": [
        {
          "description": "Improvement description"
        }
      ]
    }
  }
  ```

## Development

### Frontend

  ```text
  cd frontend
  pnpm dev
  pnpm build
  pnpm lint
  pnpm start
  ```

### Backend

  ```text
  cd api
  python src/app.py
  ```

## Supported Models

- GPT-4.1
- GPT-4o
- o3 Mini
- Gemini 2.5 Pro
- Gemini 2.5 Flash
- Claude 4 Sonnet
- Kimi K2

## Rate Limiting

  The API limits requests by model:

- 10 requests per 10 minutes
- returns HTTP 429 when the limit is exceeded

## Security and Privacy

- API keys are provided through environment variables
- CORS limits frontend access to approved origins
- prompts are processed at request time and are not stored

## License

  MIT
