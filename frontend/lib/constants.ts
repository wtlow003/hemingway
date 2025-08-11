import { Model, ExportFormat } from "./types"

export const models: Model[] = [
  { value: "gpt-4.1", label: "GPT-4.1", provider: "OpenAI", logo: "/images/openai-logo.png", status: "available" },
  { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI", logo: "/images/openai-logo.png", status: "available" },
  { value: "o3-mini", label: "o3 Mini", provider: "OpenAI", logo: "/images/openai-logo.png", status: "available" },
  { value: "o4-mini", label: "o4 Mini", provider: "OpenAI", logo: "/images/openai-logo.png", status: "available" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", logo: "/images/gemini-logo.png", status: "available" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", logo: "/images/gemini-logo.png", status: "available" },
  { value: "kimi-k2-0711-preview", label: "Kimi K2", provider: "Moonshot", logo: "/images/moonshot-logo.png", status: "preview" },
  { value: "claude-4-sonnet-20250514", label: "Claude 4 Sonnet", provider: "Anthropic", logo: "/images/anthropic-logo.png", status: "preview" },
  { value: "gpt-5-mini", label: "GPT-5 Mini", provider: "OpenAI", logo: "/images/openai-logo.png", status: "preview" },
  { value: "gpt-5-nano", label: "GPT-5 Nano", provider: "OpenAI", logo: "/images/openai-logo.png", status: "preview" },
  { value: "claude-4-opus", label: "Claude 4 Opus", provider: "Anthropic", logo: "/images/anthropic-logo.png", status: "coming-soon" },
]

export const exportFormats = [
  {
    id: "plain-text",
    name: "Plain Text",
    description: "Simple text format for copy-paste",
    iconName: "FileText",
    extension: "txt",
  },
  {
    id: "markdown",
    name: "Markdown",
    description: "Formatted markdown with documentation",
    iconName: "Code2",
    extension: "md",
    language: "markdown",
  },
  {
    id: "python",
    name: "Python Code",
    description: "Python code snippet using provider SDK",
    iconName: "Blocks",
    extension: "py",
    language: "python",
  },
] as const
