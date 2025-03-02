
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowGenerationFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isGenerating: boolean;
}

const WorkflowGenerationForm = ({
  prompt,
  setPrompt,
  onSubmit,
  isGenerating,
}: WorkflowGenerationFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6">
        <Textarea
          placeholder="e.g., Send a Slack message when a new lead is added to my Google Sheet"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-32 resize-none rounded-xl border-automation-border focus:ring-automation-primary"
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!prompt.trim() || isGenerating}
          className="bg-automation-primary hover:bg-automation-primary/90 flex items-center gap-2"
        >
          {isGenerating ? (
            <>Generating <Sparkles className="h-4 w-4 animate-pulse" /></>
          ) : (
            <>Generate Workflow <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </form>
  );
};

export default WorkflowGenerationForm;
