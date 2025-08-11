import { ReactNode } from "react"

export interface ExtractedInstruction {
  id: string
  title: string
  extractedText: string
}

export interface IdentifiedIssue {
  id: string
  title: string
  snippet: string
  explanation: string
  suggestion: string
  severity: "high" | "medium" | "low"
}

// Server response types
export interface ServerInstruction {
  instruction_title: string
  extracted_instruction: string
}

export interface ServerIssue {
  issue: string
  priority: "high" | "medium" | "low"
  snippet: string
  explanation: string
  suggestion: string
}

export interface ServerImprovement {
  description: string
}

export interface ServerResponse {
  changes: boolean
  optimized_prompt: string
  extracted_instructions: {
    instructions: ServerInstruction[]
  }
  general_issues: {
    has_issues: boolean
    issues: ServerIssue[]
  }
  contradiction_issues: {
    has_issues: boolean
    issues: ServerIssue[]
  }
  format_issues: {
    has_issues: boolean
    issues: ServerIssue[]
  }
  improvements: {
    improvements: ServerImprovement[]
  }
}

export interface PromptAnalysis {
  score: number
  extractedInstructions: ExtractedInstruction[]
  generalIssues: IdentifiedIssue[]
  contradictionIssues: IdentifiedIssue[]
  formatIssues: IdentifiedIssue[]
  optimizedPrompt: string
  improvements: string[]
}

export interface ExportFormat {
  id: string
  name: string
  description: string
  iconName: string
  extension: string
  language?: string
}

export interface Model {
  value: string
  label: string
  provider: string
  logo: string
  status: "available" | "coming-soon" | "preview"
}


