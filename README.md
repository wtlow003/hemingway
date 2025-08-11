<h1 align="center">
  Hemingway
</h1>

A powerful AI-driven tool for analyzing, optimizing, and improving prompts across multiple language models. Built with Next.js and FastAPI, featuring specialized AI agents for comprehensive prompt analysis.

![Prompt Optimizer](./frontend/public/og-image.png)

## 🚀 Features

### 🔍 Multi-Agent Analysis
- **Instruction Extraction**: Identifies mandatory instructions within prompts
- **General Issue Detection**: Finds clarity, structure, and effectiveness problems
- **Contradiction Detection**: Spots conflicting or contradictory requirements
- **Format Checking**: Validates prompt structure and formatting

### 🎯 Intelligent Optimization
- **Automated Rewriting**: AI-powered prompt optimization based on detected issues
- **Improvement Suggestions**: Detailed recommendations for better prompt performance
- **Multi-Model Support**: Works with GPT-4, Claude, Gemini, and Moonshot models

### 📊 Rich Analysis Interface
- **Interactive Results**: Tabbed interface showing analysis, issues, and optimized versions
- **Real-time Feedback**: Live analysis with progress indicators
- **Export Options**: Multiple export formats (Plain Text, Markdown, Python code)
- **Diff Visualization**: Side-by-side comparison of original vs optimized prompts

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Mode**: Theme switching with system preference detection
- **Smooth Animations**: GSAP-powered animations and transitions
- **Accessibility**: Built with Radix UI for full accessibility compliance

## 🏗️ Architecture

### Frontend (Next.js)
```
frontend/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── input-view.tsx     # Prompt input interface
│   ├── results-view.tsx   # Analysis results display
│   └── export-dialog.tsx  # Export functionality
├── lib/                   # Utilities and types
│   ├── api-client.ts      # Backend API integration
│   ├── types.ts           # TypeScript definitions
│   └── export-utils.ts    # Export functionality
└── hooks/                 # Custom React hooks
```

### Backend (FastAPI)
```
api/
├── src/
│   ├── app.py             # FastAPI application
│   ├── custom_agents.py   # AI agent definitions
│   ├── models/            # Pydantic data models
│   │   ├── instruction.py # Instruction extraction models
│   │   ├── issue.py       # Issue detection models
│   │   ├── improvement.py # Improvement models
│   │   └── prompt.py      # Prompt rewriting models
│   └── utils.py           # Utility functions
└── requirements.txt       # Python dependencies
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI + shadcn/ui
- **Animations**: GSAP
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **AI Framework**: OpenAI Agents
- **Model Support**: litellm (OpenAI, Anthropic, Google, Moonshot)
- **Validation**: Pydantic
- **CORS**: FastAPI middleware

## 📦 Installation

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.8+
- API keys for supported model providers

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup
```bash
cd api
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

python src/app.py
```

The API will be available at `http://localhost:4000`

### Environment Variables

Create a `.env` file in the `api` directory:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic (Optional)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Google (Optional)
GOOGLE_API_KEY=your_google_api_key

# Moonshot (Optional)
MOONSHOT_API_KEY=your_moonshot_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🚀 Usage

### Basic Workflow
1. **Input Prompt**: Enter your prompt in the text area
2. **Select Model**: Choose from available AI models (GPT-4, Claude, Gemini, etc.)
3. **Analyze**: Click "Analyze Prompt" to start the multi-agent analysis
4. **Review Results**: Examine extracted instructions, identified issues, and suggestions
5. **Export**: Download optimized prompts in your preferred format

### API Usage

#### Analyze Prompt
```bash
curl -X POST "http://localhost:4000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "prompt": "Your prompt text here"
  }'
```

#### Response Format
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

## 🔧 Development

### Frontend Development
```bash
cd frontend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm start        # Serve production build
```

### Backend Development
```bash
cd api
python src/app.py     # Start development server with reload
```

### Project Structure
- **Frontend**: Modern React app with TypeScript, using Next.js App Router
- **Backend**: Async FastAPI server with rate limiting and multi-model support
- **AI Agents**: Specialized agents for different analysis tasks
- **Data Flow**: Parallel agent execution → structured analysis → optimization

## 🌐 Deployment

### Frontend (Render/Vercel)
The frontend is configured for static export and can be deployed to any static hosting service.

For Render:
```yaml
services:
- type: web
  name: nextjs-static
  runtime: static
  buildCommand: pnpm install --no-frozen-lockfile; pnpm build
  staticPublishPath: out
```

### Backend (Python Hosting)
Deploy the FastAPI backend to services like Render, Railway, or AWS:

```bash
# Production server
uvicorn src.app:app --host 0.0.0.0 --port $PORT
```

## 🤝 Supported Models

### Available Models
- **GPT-4.1** - Latest OpenAI model
- **GPT-4o** - Optimized GPT-4 variant
- **o3 Mini** - OpenAI's newest mini model
- **Gemini 2.5 Pro/Flash** - Google's latest models
- **Claude 4 Sonnet** - Anthropic's advanced model
- **Kimi K2** - Moonshot's preview model

### Coming Soon
- **Claude 4 Opus** - Anthropic's most powerful model
- **GPT-5 Mini/Nano** - Next-generation OpenAI models

## 📊 Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit**: 10 requests per 10 minutes per model
- **Scope**: Per model basis
- **Response**: HTTP 429 when limit exceeded

## 🛡️ Security & Privacy

- **API Key Security**: All API keys stored securely in environment variables
- **Rate Limiting**: Prevents API abuse and excessive usage
- **CORS Configuration**: Restricts frontend access to authorized domains
- **No Data Storage**: Prompts are processed in real-time, not stored

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ using Next.js, FastAPI, and AI agents
