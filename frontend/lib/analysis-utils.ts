import { ExtractedInstruction, IdentifiedIssue, PromptAnalysis } from "./types"

export const extractInstructions = (prompt: string): ExtractedInstruction[] => {
  const instructions = []

  // Simple instruction extraction logic
  const sentences = prompt.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  let instructionCount = 1

  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim()
    if (
      trimmed.toLowerCase().includes("act as") ||
      trimmed.toLowerCase().includes("you are") ||
      trimmed.toLowerCase().includes("please") ||
      trimmed.toLowerCase().includes("should") ||
      trimmed.toLowerCase().includes("evaluate") ||
      trimmed.toLowerCase().includes("consider") ||
      trimmed.toLowerCase().includes("choose")
    ) {
      let title = ""
      if (trimmed.toLowerCase().includes("act as")) {
        title = "Act as an impartial judge"
      } else if (trimmed.toLowerCase().includes("choose") || trimmed.toLowerCase().includes("select")) {
        title = "Choose the better assistant"
      } else if (trimmed.toLowerCase().includes("consider") || trimmed.toLowerCase().includes("evaluate")) {
        title = "Consider specific evaluation factors"
      } else {
        title = `Instruction ${instructionCount}`
      }

      instructions.push({
        id: `instruction-${instructionCount}`,
        title,
        extractedText: trimmed + (trimmed.endsWith(".") ? "" : "."),
      })
      instructionCount++
    }
  })

  return instructions
}

export const identifyIssues = (prompt: string): IdentifiedIssue[] => {
  const issues = []

  // Check for ambiguous evaluation criteria
  if (
    prompt.toLowerCase().includes("helpfulness") &&
    prompt.toLowerCase().includes("relevance") &&
    prompt.toLowerCase().includes("accuracy")
  ) {
    issues.push({
      id: "issue-1",
      title: "Ambiguous evaluation criteria",
      snippet:
        "consider factors such as the helpfulness, relevance, accuracy, depth, creativity, and level of detail",
      explanation:
        "The prompt lists several evaluation factors but does not define them or explain how to weigh them. This could lead to inconsistent or subjective judgments.",
      suggestion:
        "Provide clear definitions for each criterion and specify if any should be prioritized over others.",
      severity: "high" as const,
    })
  }

  // Check for unclear tie handling
  if (prompt.includes("[[C]]") || prompt.toLowerCase().includes("tie")) {
    issues.push({
      id: "issue-2",
      title: "Unclear handling of ties",
      snippet: '"[[C]]" for a tie',
      explanation:
        "The prompt allows for a tie verdict but does not specify under what circumstances a tie is appropriate, which may lead to inconsistent use.",
      suggestion:
        "Define specific conditions when a tie verdict should be used, such as when responses are equally good across all criteria.",
      severity: "medium" as const,
    })
  }

  // Check for lack of structured framework
  if (prompt.toLowerCase().includes("evaluation") && !prompt.toLowerCase().includes("step")) {
    issues.push({
      id: "issue-3",
      title: "Lack of structured evaluation framework",
      snippet: "After providing your explanation, output your final verdict",
      explanation:
        "The prompt doesn't provide a systematic approach for evaluation, which could result in inconsistent analysis quality.",
      suggestion:
        "Include a step-by-step evaluation framework that guides the assessor through each criterion systematically.",
      severity: "high" as const,
    })
  }

  // Check for vague terms
  const vagueWords = ["thing", "stuff", "something", "anything", "good", "nice", "better"]
  const hasVagueWords = vagueWords.some((word) => prompt.toLowerCase().includes(word))

  if (hasVagueWords) {
    const foundWord = vagueWords.find((word) => prompt.toLowerCase().includes(word))
    issues.push({
      id: "issue-4",
      title: "Vague terminology",
      snippet: `"${foundWord}" usage detected`,
      explanation:
        "The prompt contains vague terms that could lead to inconsistent interpretations and subjective responses.",
      suggestion: "Replace vague terms with specific, measurable criteria and clear definitions.",
      severity: "medium" as const,
    })
  }

  return issues
}

export const analyzePrompt = async (prompt: string): Promise<PromptAnalysis> => {
  // Simulate analysis delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  let score = 50
  let optimizedPrompt = prompt
  const improvements: string[] = []

  // Extract instructions
  const extractedInstructions = extractInstructions(prompt)

  // Identify issues
  const identifiedIssues = identifyIssues(prompt)

  // Calculate score based on issues
  identifiedIssues.forEach((issue) => {
    if (issue.severity === "high") score -= 15
    else if (issue.severity === "medium") score -= 10
    else score -= 5
  })

  // Generate optimized prompt
  if (identifiedIssues.length > 0) {
    let optimized = prompt

    // Add role definition if missing
    if (!prompt.toLowerCase().includes("act as") && !prompt.toLowerCase().includes("you are")) {
      optimized = `Act as an expert evaluator. ${optimized}`
      improvements.push("Added expert role definition")
    }

    // Add structured framework if missing
    if (!prompt.toLowerCase().includes("step")) {
      optimized +=
        "\n\nPlease follow this evaluation framework:\n1. Analyze each response for relevance and accuracy\n2. Assess the depth and completeness of information\n3. Evaluate clarity and helpfulness\n4. Provide your final judgment with reasoning"
      improvements.push("Added structured evaluation framework")
    }

    // Add clear criteria definitions
    if (prompt.toLowerCase().includes("helpfulness") && !prompt.toLowerCase().includes("define")) {
      optimized +=
        "\n\nEvaluation criteria definitions:\n- Helpfulness: How well the response addresses the user's needs\n- Relevance: How directly the response relates to the question\n- Accuracy: Factual correctness of the information provided"
      improvements.push("Added clear criteria definitions")
    }

    optimizedPrompt = optimized
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score))

  // Bonus points for good structure
  if (extractedInstructions.length > 0) score += 10
  if (prompt.length > 100 && prompt.length < 500) score += 10

  return {
    score,
    extractedInstructions,
    identifiedIssues,
    optimizedPrompt,
    improvements,
  }
}

export const getSeverityColor = (severity: string) => {
  // Use consistent styling for all severity levels
  return "border-border bg-card"
}

export const getSeverityBadgeColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-destructive text-destructive-foreground border-destructive"
    case "medium":
      return "bg-primary text-primary-foreground border-primary"
    case "low":
      return "bg-muted text-muted-foreground border-muted-foreground"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}
