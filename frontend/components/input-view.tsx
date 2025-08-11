import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, ArrowRight, History } from "lucide-react"
import Image from "next/image"
import { models } from "@/lib/constants"
import { useTypewriter } from "@/hooks/use-typewriter"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"

gsap.registerPlugin(ScrambleTextPlugin)


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
  const percentRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)
  
  const { displayText, stop, reset } = useTypewriter({
    initialText: "What can I do for you?",
    typewriterText: "Create a Python script that distills my laughter into swirling confetti of ASCII art whenever I tell a joke in the terminal...",
    initialDelay: 10000,
    typingSpeed: 100,
    backtrackChance: 0,
    backtrackLength: 3,
    completePause: 3000
  })

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })
    
    if (percentRef.current) {
      const percentH2 = percentRef.current.querySelector('h2')
      if (percentH2) {
        tl.fromTo(percentRef.current, 
          { 
            opacity: 0,
            scale: 0.8 
          },
          { 
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)"
          }
        ).to(percentH2, {
          duration: 1.2,
          scrambleText: {
            text: '"100%"',
            chars: "!@#$%^&*()_+-=[]{}|;:,.<>?0123456789",
            revealDelay: 0.3,
            tweenLength: false
          }
        }, "-=0.3")
      }
    }

    if (promptRef.current) {
      const promptH2 = promptRef.current.querySelector('h2')
      if (promptH2) {
        tl.fromTo(promptRef.current,
          { 
            opacity: 0,
            y: 20 
          },
          { 
            opacity: 1,
            y: 0,
            duration: 0.4
          }, "-=0.6"
        ).to(promptH2, {
          duration: 1.5,
          scrambleText: {
            text: "YOUR PROMPT",
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            revealDelay: 0.5,
            tweenLength: false
          }
        }, "-=0.2")
      }
    }
  }, [])

  return (
    <div className="bg-white min-h-screen w-full max-w-full font-mono flex flex-col overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <div className="px-2 py-2 sm:px-4 sm:py-2 flex-shrink-0 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <Image
            src="/hemingway-icon.svg"
            alt="Hemingway"
            width={30}
            height={30}
            className="flex-shrink-0"
          />
          {/* <h1 className="text-md font-semibold text-black tracking-tight">Hemingway</h1> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center pt-4 pb-4 px-2 sm:pt-8 sm:pb-8 sm:px-6 overflow-x-hidden overflow-y-auto min-h-0 max-h-full">
        <div className="w-full max-w-full sm:max-w-3xl min-w-0 overflow-x-hidden mx-auto">
          <div className="text-center mb-6 flex-shrink-0">
            <div ref={percentRef}>
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
            <div ref={promptRef}>
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
            <p className="text-gray-600 text-sm font-mono">
              MOVE PROMPTS ACROSS MODELS – SEAMINGLESSLY
            </p>
          </div>

          {/* Input Interface */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-sm flex-shrink-0">
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
                className="h-[100px] w-full resize-none bg-white border-gray-200 text-black placeholder:text-gray-500 text-xs sm:text-xs md:text-xs leading-relaxed focus:ring-2 focus:ring-black focus:border-transparent font-mono rounded-xl overflow-y-auto overflow-x-hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 min-w-0">
                <div className="flex flex-col gap-2 min-w-0 flex-1 overflow-hidden">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-700 font-mono tracking-tight">
                      TARGET_MODEL:
                    </span>
                    <div className="text-xs text-gray-500 font-mono truncate">
                      OPTIMIZATION WILL BE TAILORED FOR THIS MODEL
                    </div>
                  </div>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-full sm:w-48 border-gray-300 bg-white font-mono text-xs rounded-lg min-w-0">
                        <SelectValue>
                          {selectedModelData && (
                            <div className="flex items-center gap-2 min-w-0">
                              <Image
                                src={selectedModelData.logo || "/placeholder.svg"}
                                alt={selectedModelData.provider}
                                width={16}
                                height={16}
                                className="rounded-sm flex-shrink-0"
                              />
                              <span className="truncate">{selectedModelData.label}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="font-mono bg-white border border-gray-200 shadow-lg">
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
                                <Image
                                  src={model.logo || '/placeholder.svg'}
                                  alt={model.provider}
                                  width={16}
                                  height={16}
                                  /* greyscale when coming-soon OR preview  */
                                  className={`rounded-sm ${
                                    ["coming-soon", "preview"].includes(model.status) ? "grayscale" : ""
                                  }`}
                                />
                                <span className="font-mono">{model.label}</span>
                              </div>

                              {/* right-hand badge */}
                              {model.status === 'coming-soon' && (
                                <span className="ml-1 px-0.5 py-0.5 text-[8px] text-gray-500 bg-gray-100 rounded-sm font-mono tracking-wide">
                                  SOON
                                </span>
                              )}
                              {model.status === "preview" && (
                                  <span className="ml-1 px-0.5 py-0.5 text-[8px] text-orange-600 bg-orange-100 rounded-sm font-mono tracking-wide">
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
                  className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 px-6 py-2 text-sm font-mono tracking-tight rounded-lg flex-shrink-0"
                  size="sm"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
