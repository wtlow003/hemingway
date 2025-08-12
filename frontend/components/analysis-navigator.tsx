import { useState } from "react";
import { ChevronLeft, ChevronRight, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptAnalysis } from "@/lib/types";
import { getSeverityBadgeColor, getSeverityColor } from "@/lib/analysis-utils";

interface AnalysisNavigatorProps {
  analysis: PromptAnalysis;
}

export function AnalysisNavigator({ analysis }: AnalysisNavigatorProps) {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      id: "instructions",
      title: "EXTRACTED_INSTRUCTIONS",
      icon: <FileSearch className="h-4 w-4 text-foreground" />,
      content: analysis.extractedInstructions,
    },
    {
      id: "general",
      title: "GENERAL_ISSUES",
      icon: (
        <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      content: analysis.generalIssues,
    },
    {
      id: "contradiction",
      title: "CONTRADICTION_ISSUES",
      icon: (
        <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
      content: analysis.contradictionIssues,
    },
    {
      id: "format",
      title: "FORMAT_ISSUES",
      icon: (
        <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: analysis.formatIssues,
    },
  ];

  const canGoPrevious = currentSection > 0;
  const canGoNext = currentSection < sections.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentSection(currentSection + 1);
    }
  };

  if (sections.length === 0) return null;

  const currentSectionData = sections[currentSection];

  const renderInstructions = () => (
    <div className="space-y-4">
      {analysis.extractedInstructions.map((instruction) => (
        <div key={instruction.id} className="border border-border rounded-lg p-4 bg-card">
          <h4 className="text-sm font-mono font-bold text-foreground uppercase">
            INSTRUCTION_{instruction.id.split("-")[1].padStart(2, "0")}: {instruction.title}
          </h4>
          <div className="mb-1">
            <span className="text-sm font-mono text-muted-foreground">EXTRACTED_TEXT:</span>
          </div>
          <div className="rounded-md p-4 bg-muted">
            <p className="text-sm font-mono text-foreground leading-relaxed">
              {instruction.extractedText}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderIssues = (issues: any[]) => (
    <div className="space-y-4">
      {issues.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-center">
          <span className="text-sm sm:text-base font-mono text-muted-foreground font-medium">Perfect! No issues in this category.</span>
        </div>
      ) : (
        issues.map((issue) => (
          <div key={issue.id} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-sm font-mono font-bold text-foreground uppercase">
                ISSUE_{issue.id.split("-")[2].padStart(2, "0")}: {issue.title.toUpperCase()}
              </h4>
              <span className={`px-3 py-1 text-xs font-mono font-bold rounded-md ${getSeverityBadgeColor(issue.severity)}`}>
                {issue.severity.toUpperCase()}_PRIORITY
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="mb-1">
                  <span className="text-sm font-mono text-muted-foreground">SNIPPET:</span>
                </div>
                <div className="bg-muted rounded-lg p-4 border border-border">
                  <p className="text-sm font-mono text-foreground leading-relaxed">{issue.snippet}</p>
                </div>
              </div>
              <div>
                <div className="mb-1">
                  <span className="text-sm font-mono text-muted-foreground">EXPLANATION:</span>
                </div>
                <div className="bg-muted rounded-lg p-4 border border-border">
                  <p className="text-sm font-mono text-foreground leading-relaxed">{issue.explanation}</p>
                </div>
              </div>
              <div>
                <div className="mb-1">
                  <span className="text-sm font-mono text-muted-foreground">SUGGESTION:</span>
                </div>
                <div className="bg-muted rounded-lg p-4 border border-border">
                  <p className="text-sm font-mono text-foreground leading-relaxed">{issue.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentSectionData.icon}
          <h3 className="text-sm font-medium text-foreground tracking-tight">
            {currentSectionData.title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0 border-border text-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground mx-2">
            {currentSection + 1}/{sections.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="h-8 w-8 p-0 border-border text-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {currentSectionData.id === "instructions" && renderInstructions()}
      {currentSectionData.id !== "instructions" && renderIssues(currentSectionData.content)}
    </div>
  );
}
