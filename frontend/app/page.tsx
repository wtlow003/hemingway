"use client"

import React, { useState, useEffect } from "react"
import { InputView } from "@/components/input-view"
import { ResultsView } from "@/components/results-view"
import { ExportDialog } from "@/components/export-dialog"
import { PromptAnalysis } from "@/lib/types"
import { analyzePrompt } from "@/lib/api-client"
import { generateExportContent } from "@/lib/export-utils"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function PromptOptimizer() {
  const [currentView, setCurrentView] = useState<"input" | "results">("input")
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState<string | null>(null)
  const [exportContent, setExportContent] = useState("")
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorTitle, setErrorTitle] = useState("ANALYSIS_FAILED")

  const [activeTab, setActiveTab] = useState("analysis")

  // Auto-switch to optimized tab when analysis completes
  useEffect(() => {
    if (analysis && activeTab === "analysis" && 
        analysis.generalIssues.length === 0 && 
        analysis.contradictionIssues.length === 0 && 
        analysis.formatIssues.length === 0) {
      setActiveTab("optimized")
    }
  }, [analysis, activeTab])

  const handleAnalyze = async () => {
    if (!originalPrompt.trim()) return

    setIsAnalyzing(true)
    setCurrentView("results")

    try {
      const result = await analyzePrompt(originalPrompt, selectedModel)
      setAnalysis(result)
    } catch (error) {
      console.error("Analysis failed:", error)
      const message = error instanceof Error ? error.message : "Failed to analyze prompt. Please check your connection and try again."
      setErrorMessage(message)
      
      // Set custom title for rate limit errors
      if (message === "AI minions are overworked, let them rest!") {
        setErrorTitle("YOU_GOT_RATE_LIMITED")
      } else {
        setErrorTitle("ANALYSIS_FAILED")
      }
      
      setShowErrorDialog(true)
      setCurrentView("input") // Go back to input view on error
    } finally {
      setIsAnalyzing(false)
    }
  }



  const handleExport = (formatId: string) => {
    if (!analysis) return

    const content = generateExportContent(formatId, analysis.optimizedPrompt, selectedModel)
    setExportContent(content)
    setSelectedExportFormat(formatId)
    setShowExportDialog(true)
  }

  const handleNewPrompt = () => {
    setOriginalPrompt("")
    setAnalysis(null)
    setCurrentView("input")
    setActiveTab("analysis")
  }

  if (currentView === "input") {
    return (
      <>
        <InputView
          originalPrompt={originalPrompt}
          setOriginalPrompt={setOriginalPrompt}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
        />
        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-mono">{errorTitle}</AlertDialogTitle>
              <AlertDialogDescription className="font-mono">
                {errorMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="font-mono" onClick={() => setShowErrorDialog(false)}>
                TRY AGAIN
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <ResultsView
        originalPrompt={originalPrompt}
        selectedModel={selectedModel}
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewPrompt={handleNewPrompt}
        onExport={handleExport}
      />
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        content={exportContent}
        formatId={selectedExportFormat}
      />
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">{errorTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="font-mono" onClick={() => setShowErrorDialog(false)}>
              TRY AGAIN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
