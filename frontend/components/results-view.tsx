import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotatingText, ANALYSIS_PHRASES } from "./rotating-text";
import { AnalysisNavigator } from "./analysis-navigator";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Copy,
  Save,
  Sparkles,
  Settings,
  Download,
  ArrowLeft,
  FileSearch,
} from "lucide-react";
import Image from "next/image";
import { ModelLogo } from "@/components/model-logo";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { models, exportFormats } from "@/lib/constants";
import { getIcon } from "@/lib/icon-utils";
import { PromptAnalysis } from "@/lib/types";
import { getSeverityBadgeColor, getSeverityColor } from "@/lib/analysis-utils";
import { copyToClipboard } from "@/lib/export-utils";
import { DiffDialog } from "@/components/diff-dialog";
import { useState } from "react";

interface ResultsViewProps {
  originalPrompt: string;
  selectedModel: string;
  analysis: PromptAnalysis | null;
  isAnalyzing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewPrompt: () => void;

  onExport: (formatId: string) => void;
}

export function ResultsView({
  originalPrompt,
  selectedModel,
  analysis,
  isAnalyzing,
  activeTab,
  setActiveTab,
  onNewPrompt,

  onExport,
}: ResultsViewProps) {
  const selectedModelData = models.find((m) => m.value === selectedModel);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen font-mono w-full max-w-full relative">
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.04}
        duration={4}
        repeatDelay={1.5}
        className="fill-gray-400/8 stroke-gray-400/8 -skew-y-12"
      />
      {/* Header */}
      <div className="border-b border-border px-2 py-2 sm:px-4 sm:py-3 relative z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewPrompt}
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-background font-mono text-xs"
            disabled={isAnalyzing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            NEW PROMPT
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-full sm:max-w-7xl mx-auto p-2 sm:p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 min-h-[calc(100vh-120px)]">
          {/* Left Panel - Original Prompt */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2 sm:mb-4 min-h-[44px]">
              <div className="flex items-center gap-4">
                <h2 className="text-base sm:text-lg font-medium text-foreground tracking-tight">
                  ORIGINAL PROMPT
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <ModelLogo
                  src={selectedModelData?.logo || "/placeholder.svg"}
                  alt={selectedModelData?.provider || ""}
                  width={12}
                  height={12}
                  className="flex-shrink-0"
                  provider={selectedModelData?.provider}
                />
                {selectedModelData?.label}
              </div>
            </div>

            <div className="flex-1 bg-card rounded-lg border border-border p-3 sm:p-4 min-h-[200px] sm:min-h-[400px]">
              <p className="text-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {originalPrompt}
              </p>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="flex flex-col mt-6 lg:mt-0">
            <div className="flex items-center justify-between mb-2 sm:mb-4 min-h-[44px]">
              <div className="flex items-center gap-4">
                <h2 className="text-base sm:text-lg font-medium text-foreground tracking-tight">
                  ANALYSIS RESULTS
                </h2>
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("analysis")}
                    disabled={!analysis}
                    className={`px-2 sm:px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors tracking-tight ${
                      activeTab === "analysis" && analysis
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    } ${!analysis ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    ANALYSIS
                  </button>
                  <button
                    onClick={() => setActiveTab("optimized")}
                    disabled={!analysis}
                    className={`px-2 sm:px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors tracking-tight ${
                      activeTab === "optimized" && analysis
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    } ${!analysis ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    OPTIMIZED
                  </button>
                </div>
              </div>
              {analysis && activeTab === "optimized" && (
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(analysis.optimizedPrompt)}
                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground font-mono text-xs"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono text-xs">Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                  <DiffDialog
                    originalPrompt={originalPrompt}
                    optimizedPrompt={analysis.optimizedPrompt}
                    isOpen={isDiffOpen}
                    onOpenChange={setIsDiffOpen}
                  />
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-background font-mono text-xs"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-mono text-xs">Export formats</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 font-mono bg-popover border border-border shadow-lg"
                    >
                      <DropdownMenuLabel className="text-xs">
                        EXPORT_FORMATS
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {exportFormats.map((format) => (
                        <DropdownMenuItem
                          key={format.id}
                          onClick={() => onExport(format.id)}
                          className="text-xs"
                        >
                          <div className="flex items-center gap-3">
                            {getIcon(format.iconName, "h-4 w-4")}
                            <div className="flex flex-col">
                              <span className="font-medium">{format.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {format.description}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {isAnalyzing ? (
              <div className="flex-1 bg-card rounded-lg border border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-mono tracking-tight">
                    <RotatingText phrases={ANALYSIS_PHRASES} />
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                {activeTab === "analysis" && analysis && (
                  <AnalysisNavigator analysis={analysis} />
                )}
                {activeTab === "optimized" && (
                  <div className="space-y-4 sm:space-y-6">
                    {analysis && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 sm:mb-4">
                          <svg
                            className="h-5 w-5 text-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="text-xs sm:text-sm font-medium text-foreground tracking-tight">
                            OPTIMIZED_PROMPT
                          </h3>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex items-center justify-center min-h-[100px]">
                          {(!analysis.optimizedPrompt || analysis.optimizedPrompt.trim() === "") ? (
                            <div className="flex flex-col items-center w-full">
                              <div className="text-xs sm:text-sm font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap text-center">
                                Perfect prompt! You are writing like a professional writer.
                              </div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-mono opacity-80 text-center">
                                If you are unsure if this is accurate, try re-running with the same prompt!
                              </div>
                            </div>
                          ) : (
                            <pre className="text-xs sm:text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                              {analysis.optimizedPrompt}
                            </pre>
                          )}
                        </div>
                      </div>
                    )}
                    {analysis && analysis.improvements.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 sm:mb-4">
                          <svg
                            className="h-5 w-5 text-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          <h3 className="text-xs sm:text-sm font-medium text-foreground tracking-tight">
                            IMPROVEMENTS_MADE
                          </h3>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          {analysis.improvements.map((improvement, index) => (
                            <div
                              key={index}
                              className="bg-muted border border-border rounded-lg p-3 sm:p-4"
                            >
                              <div className="flex items-start gap-3">
                                <svg
                                  className="h-4 w-4 text-black mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-xs sm:text-sm font-mono text-primary font-medium uppercase">
                                  {improvement}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
