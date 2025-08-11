"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GitCompare } from "lucide-react"
import { diffLines } from "diff"

interface DiffModalProps {
  originalPrompt: string
  optimizedPrompt: string
}

export function DiffModal({ originalPrompt, optimizedPrompt }: DiffModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const diffs = diffLines(originalPrompt, optimizedPrompt)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black font-mono text-xs"
        >
          <GitCompare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg tracking-tight">GIT_DIFF_VIEW</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <div className="mb-4 text-gray-400 text-xs">
              --- ORIGINAL_PROMPT
            </div>
            <div className="mb-4 text-gray-400 text-xs">
              +++ OPTIMIZED_PROMPT
            </div>
            <div className="space-y-0">
              {diffs.map((part, index) => {
                if (part.removed) {
                  return (
                    <div key={index} className="bg-red-900/30 border-l-4 border-red-500 pl-4 py-1">
                      {part.value.split('\n').map((line, lineIndex) => 
                        line && (
                          <div key={lineIndex} className="text-red-300">
                            <span className="text-red-500 mr-4">-</span>
                            {line}
                          </div>
                        )
                      )}
                    </div>
                  )
                }
                if (part.added) {
                  return (
                    <div key={index} className="bg-green-900/30 border-l-4 border-green-500 pl-4 py-1">
                      {part.value.split('\n').map((line, lineIndex) => 
                        line && (
                          <div key={lineIndex} className="text-green-300">
                            <span className="text-green-500 mr-4">+</span>
                            {line}
                          </div>
                        )
                      )}
                    </div>
                  )
                }
                return (
                  <div key={index} className="pl-4 py-1">
                    {part.value.split('\n').map((line, lineIndex) => 
                      line && (
                        <div key={lineIndex} className="text-gray-300">
                          <span className="text-gray-500 mr-4"> </span>
                          {line}
                        </div>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
