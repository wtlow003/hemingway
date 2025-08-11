import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Diff } from "lucide-react";
import { generateDiff } from "@/lib/diff-utils";

interface DiffDialogProps {
  originalPrompt: string;
  optimizedPrompt: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DiffDialog({
  originalPrompt,
  optimizedPrompt,
  isOpen,
  onOpenChange,
}: DiffDialogProps) {
  const diffLines = generateDiff(originalPrompt, optimizedPrompt);

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black font-mono text-xs"
              >
                <Diff className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p className="font-mono text-xs">View diff</p>
          </TooltipContent>
      <DialogContent
        className="max-w-[98vw] w-[98vw] max-h-[90vh] overflow-hidden bg-white"
        style={{
          maxWidth: "60%",
          borderRadius: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-mono font-medium text-black tracking-tight">
            PROMPT_DIFF_VIEW
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="bg-gray-100 border border-gray-200 rounded-t-lg p-2">
            <span className="text-gray-700 font-bold text-xs">
              UNIFIED_DIFF_VIEW
            </span>
          </div>
          <div className="bg-gray-900 border-l border-r border-b border-gray-200 rounded-b-lg p-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="text-xs font-mono">
              <div className="text-gray-400 mb-2">--- original_prompt</div>
              <div className="text-gray-400 mb-4">+++ optimized_prompt</div>
              {diffLines.map((line, index) => (
                <div
                  key={index}
                  className={`py-0.5 px-2 text-sm font-mono leading-tight ${
                    line.type === "removed"
                      ? "bg-red-900/30 text-red-300"
                      : line.type === "added"
                      ? "bg-green-900/30 text-green-300"
                      : "text-gray-300"
                  }`}
                >
                  <span className="text-gray-500 mr-4 select-none w-20 inline-block text-right text-xs">
                    {line.originalLineNum || ""}
                    {line.originalLineNum && line.optimizedLineNum ? "," : ""}
                    {line.optimizedLineNum || ""}
                  </span>
                  {line.type === "removed" && (
                    <span>
                      <span className="text-red-400 mr-2">-</span>
                      {line.original}
                    </span>
                  )}
                  {line.type === "added" && (
                    <span>
                      <span className="text-green-400 mr-2">+</span>
                      {line.optimized}
                    </span>
                  )}
                  {line.type === "unchanged" && (
                    <span>
                      <span className="text-gray-500 mr-2"> </span>
                      {line.original}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        </DialogContent>
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
}
