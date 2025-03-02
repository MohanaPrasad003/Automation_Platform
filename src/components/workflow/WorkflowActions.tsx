
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface WorkflowActionsProps {
  onRegenerate: () => void;
  onSave: () => Promise<void>;
  isGenerating: boolean;
  isSaving: boolean;
}

const WorkflowActions = ({
  onRegenerate,
  onSave,
  isGenerating,
  isSaving,
}: WorkflowActionsProps) => {
  return (
    <div className="mt-8 flex space-x-4">
      <Button 
        variant="outline" 
        className="flex-1 rounded-xl"
        onClick={onRegenerate}
        disabled={isGenerating}
      >
        Regenerate
      </Button>
      <Button 
        className="flex-1 rounded-xl bg-automation-primary hover:bg-automation-primary/90 flex items-center justify-center"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Workflow
          </>
        )}
      </Button>
    </div>
  );
};

export default WorkflowActions;
