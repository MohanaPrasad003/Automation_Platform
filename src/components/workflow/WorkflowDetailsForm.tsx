
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowDetailsFormProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
}

const WorkflowDetailsForm = ({
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
}: WorkflowDetailsFormProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workflow-name">Workflow Name</Label>
        <Input
          id="workflow-name"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Enter workflow name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="workflow-description">Description</Label>
        <Textarea
          id="workflow-description"
          value={workflowDescription}
          onChange={(e) => setWorkflowDescription(e.target.value)}
          placeholder="Enter workflow description"
          className="resize-none h-20"
        />
      </div>
    </div>
  );
};

export default WorkflowDetailsForm;
