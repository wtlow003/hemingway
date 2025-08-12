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
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground font-mono text-xs"
              >
                <Diff className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p className="font-mono text-xs">View diff</p>
          </TooltipContent>
      <DialogContent
        className="max-w-[98vw] w-[98vw] max-h-[90vh] overflow-hidden bg-background"
        style={{
          maxWidth: "60%",
          borderRadius: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-mono font-medium text-foreground tracking-tight">
            PROMPT_DIFF_VIEW
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="bg-muted border border-border rounded-t-lg p-2">
            <span className="text-foreground font-bold text-xs">
              UNIFIED_DIFF_VIEW
            </span>
          </div>
          <div className="bg-card border-l border-r border-b border-border rounded-b-lg p-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="text-xs font-mono">
              <div className="text-muted-foreground mb-2">--- original_prompt</div>
              <div className="text-muted-foreground mb-4">+++ optimized_prompt</div>
              {diffLines.map((line, index) => (
                <div
                  key={index}
                  className={`py-0.5 px-2 text-sm font-mono leading-tight ${
                    line.type === "removed"
                      ? "bg-red-900/50 text-red-200"
                      : line.type === "added"
                      ? "bg-green-900/50 text-green-200"
                      : "text-foreground"
                  }`}
                >
                  <span className="text-muted-foreground mr-4 select-none w-20 inline-block text-right text-xs">
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
                      <span className="text-muted-foreground mr-2"> </span>
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
