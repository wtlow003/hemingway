import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Settings, ArrowRight, History, Info } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { ModelLogo } from "@/components/model-logo"
import { models } from "@/lib/constants"
import { useTypewriter } from "@/hooks/use-typewriter"
import React from "react"


interface InputViewProps {
  originalPrompt: string
  setOriginalPrompt: (prompt: string) => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  isAnalyzing: boolean
  onAnalyze: () => void

}

export function InputView({
  originalPrompt,
  setOriginalPrompt,
  selectedModel,
  setSelectedModel,
  isAnalyzing,
  onAnalyze,

}: InputViewProps) {
  const selectedModelData = models.find((m) => m.value === selectedModel)
  
  const { displayText, stop, reset } = useTypewriter({
    initialText: "What can I do for you?",
    typewriterText: "Create a Python script that distills my laughter into swirling confetti of ASCII art whenever I tell a joke in the terminal...",
    initialDelay: 10000,
    typingSpeed: 100,
    backtrackChance: 0,
    backtrackLength: 3,
    completePause: 3000
  })


  return (
    <div className="bg-background min-h-screen w-full max-w-full font-mono flex flex-col overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <div className="px-2 py-2 sm:px-4 sm:py-2 flex-shrink-0 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Image
              src="/hemingway-icon.svg"
              alt="Hemingway"
              width={30}
              height={30}
              className="flex-shrink-0"
            />
            {/* <h1 className="text-md font-semibold text-foreground tracking-tight">Hemingway</h1> */}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center pt-4 pb-4 px-2 sm:pt-8 sm:pb-8 sm:px-6 overflow-x-hidden overflow-y-auto min-h-0 max-h-full">
        <div className="w-full max-w-full sm:max-w-3xl min-w-0 overflow-x-hidden mx-auto">
          <div className="text-center mb-6 flex-shrink-0">
            <div>
              <div className="relative">
                <h2
                  className="text-5xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 700,
                  }}
                >
                  "100%"
                </h2>
              </div>
            </div>
            <div>
              <div className="relative mb-3">
                <h2
                  className="text-5xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 700,
                  }}
                >
                  YOUR PROMPT
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-mono">
              MOVE PROMPTS ACROSS MODELS – SEAMINGLESSLY
            </p>
          </div>

          {/* Input Interface */}
          <div className="bg-card rounded-2xl border border-border p-3 sm:p-5 shadow-sm flex-shrink-0">
            <div className="space-y-4">
              <Textarea
                placeholder={displayText}
                value={originalPrompt}
                onChange={(e) => setOriginalPrompt(e.target.value)}
                onFocus={stop}
                onBlur={() => {
                  if (!originalPrompt.trim()) {
                    reset()
                  }
                }}
                className="h-[60px] w-full resize-none bg-background border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-xs md:text-xs leading-relaxed focus:ring-2 focus:ring-ring focus:border-transparent font-mono rounded-xl overflow-y-auto overflow-x-hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 min-w-0">
                <div className="flex flex-col gap-2 min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground font-mono tracking-tight">
                      TARGET_MODEL:
                    </span>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto p-2">
                        <p className="text-xs font-mono">
                          Optimization will be tailored for this model
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-full sm:w-48 border-border bg-background font-mono text-xs rounded-lg min-w-0">
                        <SelectValue>
                          {selectedModelData && (
                            <div className="flex items-center gap-2 min-w-0">
                              <ModelLogo
                                src={selectedModelData.logo || "/placeholder.svg"}
                                alt={selectedModelData.provider}
                                width={16}
                                height={16}
                                className="flex-shrink-0"
                                provider={selectedModelData.provider}
                              />
                              <span className="truncate">{selectedModelData.label}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="font-mono bg-popover border border-border shadow-lg">
                        {models.map((model) => (
                          <SelectItem
                            key={model.value}
                            value={model.value}
                            className={`w-full text-xs ${
                              model.status === 'coming-soon' ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                            disabled={model.status === 'coming-soon'}
                          >
                            <div className="flex w-full">
                              {/* left-hand side */}
                              <div className="flex gap-2">
                                <ModelLogo
                                  src={model.logo || '/placeholder.svg'}
                                  alt={model.provider}
                                  width={16}
                                  height={16}
                                  className={[
                                    "coming-soon", "preview"
                                  ].includes(model.status) ? "grayscale" : ""}
                                  provider={model.provider}
                                />
                                <span className="font-mono">{model.label}</span>
                              </div>

                              {/* right-hand badge */}
                              {model.status === 'coming-soon' && (
                                <span className="ml-1 px-0.5 py-0.5 text-[8px] text-muted-foreground bg-muted rounded-sm font-mono tracking-wide">
                                  SOON
                                </span>
                              )}
                              {model.status === "preview" && (
                                  <span className="ml-1 px-0.5 py-0.5 text-[8px] text-primary-foreground bg-primary rounded-sm font-mono tracking-wide">
                                    PREVIEW
                                  </span>
                                )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>

                    </Select>
                </div>

                <Button
                  onClick={onAnalyze}
                  disabled={!originalPrompt.trim() || isAnalyzing}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-sm font-mono tracking-tight rounded-lg flex-shrink-0"
                  size="sm"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      ANALYZING...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      GENERATE
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
