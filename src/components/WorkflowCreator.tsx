
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, ExternalLink, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

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

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Create Workflow</h3>
          <p className="text-gray-600">
            Describe what you want to automate in simple words
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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

        {generatedWorkflow && (
          <div className="mt-8 animate-fade-in">
            <div className="border-t border-automation-border pt-6">
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
              
              <h4 className="font-medium mb-4">Workflow Steps</h4>
              <div className="space-y-6">
                {generatedWorkflow.nodes.map((node, index) => (
                  <div key={node.id}>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center" 
                           style={{ 
                             backgroundColor: node.type === 'trigger' ? '#EBF5FF' : '#F3E8FF',
                             color: node.type === 'trigger' ? '#3B82F6' : '#9333EA'
                           }}>
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium">{node.name}</h5>
                        <p className="text-sm text-gray-600">{node.description}</p>
                      </div>
                    </div>
                    {index < generatedWorkflow.nodes.length - 1 && (
                      <div className="pl-5 ml-[14px] mt-2 mb-2 border-l-2 border-dashed border-gray-200 h-6"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex space-x-4">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  disabled={isGenerating}
                >
                  Regenerate
                </Button>
                <Button 
                  className="flex-1 rounded-xl bg-automation-primary hover:bg-automation-primary/90 flex items-center justify-center"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'action';
  description: string;
}

interface WorkflowData {
  name: string;
  description: string;
  nodes: WorkflowNode[];
}

export default WorkflowCreator;
