
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { WorkflowData } from "@/types/workflow";
import { supabase } from "@/lib/supabase";

// Importing our refactored workflow components
import WorkflowDetailsForm from "@/components/workflow/WorkflowDetailsForm";
import WorkflowGenerationForm from "@/components/workflow/WorkflowGenerationForm";
import WorkflowSteps from "@/components/workflow/WorkflowSteps";
import WorkflowActions from "@/components/workflow/WorkflowActions";

const WorkflowCreatorPage = () => {
  const [prompt, setPrompt] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowData | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateWorkflow = async (e: React.FormEvent) => {
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

  const handleSaveWorkflow = async () => {
    if (!generatedWorkflow) return;
    
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('workflows')
        .insert([{
          name: workflowName,
          description: workflowDescription,
          prompt,
          nodes: generatedWorkflow.nodes,
          status: "active",
          user_id: user.id
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Workflow saved",
        description: "Your workflow has been saved successfully",
      });
      
      navigate("/workflow-manager");
    } catch (error: any) {
      toast({
        title: "Error saving workflow",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerateWorkflow({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <>
      <Helmet>
        <title>Create Workflow | AI Promptify</title>
      </Helmet>
      
      <div className="min-h-screen bg-automation-secondary bg-opacity-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate("/workflow-manager")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Workflow</h1>
                <p className="text-gray-600">Describe what you want to automate in natural language</p>
              </div>
            </div>
          </div>
          
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
                onSubmit={handleGenerateWorkflow}
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
                      onSave={handleSaveWorkflow}
                      isGenerating={isGenerating}
                      isSaving={isSaving}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowCreatorPage;
