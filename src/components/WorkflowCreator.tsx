
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { WorkflowData } from "@/types/workflow";
import WorkflowGenerationForm from "@/components/workflow/WorkflowGenerationForm";
import WorkflowDetailsForm from "@/components/workflow/WorkflowDetailsForm";
import WorkflowSteps from "@/components/workflow/WorkflowSteps";
import WorkflowActions from "@/components/workflow/WorkflowActions";

interface WorkflowCreatorProps {
  onSave?: (workflow: any) => Promise<any>;
  saving?: boolean;
  existingWorkflow?: any;
}

const WorkflowCreator = ({ onSave, saving = false, existingWorkflow = null }: WorkflowCreatorProps) => {
  const [prompt, setPrompt] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (existingWorkflow) {
      setPrompt(existingWorkflow.prompt || "");
      setWorkflowName(existingWorkflow.name || "");
      setWorkflowDescription(existingWorkflow.description || "");
      if (existingWorkflow.nodes) {
        setGeneratedWorkflow({
          name: existingWorkflow.name,
          description: existingWorkflow.description,
          nodes: existingWorkflow.nodes
        });
      }
    }
  }, [existingWorkflow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Call Supabase Edge Function to generate workflow using OpenAI
      const { data, error } = await supabase.functions.invoke("generate-workflow", {
        body: { prompt }
      });
      
      if (error) throw error;
      
      // If we get a successful response from the edge function
      if (data && data.workflow) {
        const generatedName = data.workflow.name || "New Workflow";
        const generatedDescription = data.workflow.description || "Generated from your prompt";
        
        setWorkflowName(generatedName);
        setWorkflowDescription(generatedDescription);
        setGeneratedWorkflow({
          name: generatedName,
          description: generatedDescription,
          nodes: data.workflow.nodes || []
        });
      } else {
        throw new Error("No workflow data returned");
      }
    } catch (error: any) {
      console.error("Error generating workflow:", error);
      toast({
        title: "Error generating workflow",
        description: error.message || "Failed to generate workflow. Please try again.",
        variant: "destructive"
      });
      
      // For demo purposes, simulate workflow generation if API call fails
      setTimeout(() => {
        const mockWorkflow: WorkflowData = {
          name: "New Lead Notification",
          description: "Sends a Slack message when a new lead is added to Google Sheets",
          nodes: [
            {
              id: "1",
              name: "Google Sheets Trigger",
              type: "trigger",
              description: "Monitors for new rows in the specified sheet"
            },
            {
              id: "2",
              name: "Slack",
              type: "action",
              description: "Sends a notification to the specified channel"
            }
          ]
        };
        
        setWorkflowName(mockWorkflow.name);
        setWorkflowDescription(mockWorkflow.description);
        setGeneratedWorkflow(mockWorkflow);
      }, 2000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedWorkflow) return;
    
    const workflowData = {
      name: workflowName || generatedWorkflow.name,
      description: workflowDescription || generatedWorkflow.description,
      prompt,
      nodes: generatedWorkflow.nodes
    };
    
    if (onSave) {
      await onSave(workflowData);
    }
  };

  const handleRegenerate = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Create Workflow</h3>
          <p className="text-gray-600">
            Describe what you want to automate in simple words
          </p>
        </div>

        <WorkflowGenerationForm
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleSubmit}
          isGenerating={isGenerating}
        />

        {generatedWorkflow && (
          <div className="mt-8 animate-fade-in">
            <div className="border-t border-automation-border pt-6">
              <WorkflowDetailsForm
                workflowName={workflowName}
                setWorkflowName={setWorkflowName}
                workflowDescription={workflowDescription}
                setWorkflowDescription={setWorkflowDescription}
              />
              
              <h4 className="font-medium mb-4">Workflow Steps</h4>
              <WorkflowSteps nodes={generatedWorkflow.nodes} />
              
              <WorkflowActions
                onRegenerate={handleRegenerate}
                onSave={handleSave}
                isGenerating={isGenerating}
                isSaving={saving}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCreator;
