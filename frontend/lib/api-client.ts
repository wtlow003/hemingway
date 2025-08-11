import { PromptAnalysis, ServerResponse, ExtractedInstruction, IdentifiedIssue } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Transform server response to frontend format
const transformServerResponse = (serverResponse: ServerResponse): PromptAnalysis => {
  // Transform instructions
  const extractedInstructions: ExtractedInstruction[] = serverResponse.extracted_instructions.instructions.map(
    (instruction, index) => ({
      id: `instruction-${index + 1}`,
      title: instruction.instruction_title,
      extractedText: instruction.extracted_instruction,
    })
  )

  // Transform general critique issues
  const generalIssues: IdentifiedIssue[] = serverResponse.general_issues.has_issues
    ? serverResponse.general_issues.issues.map((issue, index) => ({
        id: `general-issue-${index + 1}`,
        title: issue.issue,
        snippet: issue.snippet,
        explanation: issue.explanation,
        suggestion: issue.suggestion,
        severity: issue.priority,
      }))
    : []

  // Transform contradiction issues
  const contradictionIssues: IdentifiedIssue[] = serverResponse.contradiction_issues.has_issues
    ? serverResponse.contradiction_issues.issues.map((issue, index) => ({
        id: `contradiction-issue-${index + 1}`,
        title: issue.issue,
        snippet: issue.snippet,
        explanation: issue.explanation,
        suggestion: issue.suggestion,
        severity: issue.priority,
      }))
    : []

  // Transform format issues
  const formatIssues: IdentifiedIssue[] = serverResponse.format_issues.has_issues
    ? serverResponse.format_issues.issues.map((issue, index) => ({
        id: `format-issue-${index + 1}`,
        title: issue.issue,
        snippet: issue.snippet,
        explanation: issue.explanation,
        suggestion: issue.suggestion,
        severity: issue.priority,
      }))
    : []

  // Combine all issues for score calculation
  const allIssues = [...generalIssues, ...contradictionIssues, ...formatIssues]

  // Calculate score based on issues and changes
  let score = 75 // Base score
  if (serverResponse.changes) {
    score += 10 // Bonus for having improvements
  }
  
  allIssues.forEach((issue) => {
    if (issue.severity === "high") score -= 15
    else if (issue.severity === "medium") score -= 10
    else score -= 5
  })
  score = Math.max(0, Math.min(100, score))

  // Transform improvements from server
  const improvements: string[] = serverResponse.improvements.improvements.map(
    (improvement) => improvement.description
  )

  return {
    score,
    extractedInstructions,
    generalIssues,
    contradictionIssues,
    formatIssues,
    optimizedPrompt: serverResponse.optimized_prompt,
    improvements,
  }
}

export const analyzePrompt = async (prompt: string, model: string): Promise<PromptAnalysis> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt }),
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("AI minions are overworked, let them rest!")
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const serverResponse: ServerResponse = await response.json()
    return transformServerResponse(serverResponse)
  } catch (error) {
    console.error("Failed to analyze prompt:", error)
    if (error instanceof Error && error.message === "AI minions are overworked, let them rest!") {
      throw error
    }
    throw new Error("Unable to connect to the AI Minions. Please try again later!")
  }
}
