import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Download, X } from "lucide-react"
import { exportFormats } from "@/lib/constants"
import { getIcon } from "@/lib/icon-utils"
import { copyToClipboard, downloadFile } from "@/lib/export-utils"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  formatId: string | null
}

export function ExportDialog({ open, onOpenChange, content, formatId }: ExportDialogProps) {
  const selectedFormat = exportFormats.find((f) => f.id === formatId)

  if (!selectedFormat) return null

  const handleCopy = () => {
    copyToClipboard(content)
  }

  const handleDownload = () => {
    const filename = `optimized-prompt.${selectedFormat.extension}`
    downloadFile(content, filename)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] font-mono">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-medium tracking-tight">
            {getIcon(selectedFormat.iconName, "h-5 w-5")}
            EXPORT_AS_{selectedFormat.name.toUpperCase().replace(/\s+/g, "_")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 font-mono">
            {selectedFormat.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="h-[500px] overflow-auto rounded-lg border border-gray-200">
            <SyntaxHighlighter
              language={selectedFormat.language || "text"}
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
            >
              {content}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 font-mono">
            {content.split("\n").length} lines • {content.length} characters
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black font-mono text-xs"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  COPY
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black font-mono text-xs"
                >
                  <Download className="h-4 w-4 mr-2" />
                  DOWNLOAD
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">Download file</p>
              </TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black font-mono text-xs"
            >
              <X className="h-4 w-4 mr-2" />
              CLOSE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
