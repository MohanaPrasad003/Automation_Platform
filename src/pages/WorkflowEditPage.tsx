
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { WorkflowData } from "@/types/workflow";
import { supabase } from "@/lib/supabase";

// Importing our refactored workflow components
import WorkflowDetailsForm from "@/components/workflow/WorkflowDetailsForm";
import WorkflowGenerationForm from "@/components/workflow/WorkflowGenerationForm";
import WorkflowSteps from "@/components/workflow/WorkflowSteps";
import WorkflowActions from "@/components/workflow/WorkflowActions";

const WorkflowEditPage = () => {
  const [prompt, setPrompt] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowData | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const fetchWorkflow = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setPrompt(data.prompt || "");
      setWorkflowName(data.name || "");
      setWorkflowDescription(data.description || "");
      
      if (data.nodes) {
        setGeneratedWorkflow({
          name: data.name,
          description: data.description,
          nodes: data.nodes
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching workflow",
        description: error.message,
        variant: "destructive",
      });
      navigate("/workflow-manager");
    } finally {
      setLoading(false);
    }
  };

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
        const generatedName = data.workflow.name || workflowName;
        const generatedDescription = data.workflow.description || workflowDescription;
        
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
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateWorkflow = async () => {
    if (!generatedWorkflow || !id) return;
    
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from('workflows')
        .update({
          name: workflowName,
          description: workflowDescription,
          prompt,
          nodes: generatedWorkflow.nodes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Workflow updated",
        description: "Your workflow has been updated successfully",
      });
      
      navigate("/workflow-manager");
    } catch (error: any) {
      toast({
        title: "Error updating workflow",
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
        <title>Edit Workflow | AI Promptify</title>
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
                <h1 className="text-2xl font-bold">Edit Workflow</h1>
                <p className="text-gray-600">Modify your existing workflow</p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-automation-primary" />
              <p className="mt-4 text-gray-600">Loading workflow...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Edit Workflow</h3>
                  <p className="text-gray-600">
                    Modify your workflow or regenerate it with a new prompt
                  </p>
                </div>

                <WorkflowGenerationForm
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onSubmit={handleGenerateWorkflow}
                  isGenerating={isGenerating}
                />

                {generatedWorkflow && (
                  <div className="mt-8">
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
                        onSave={handleUpdateWorkflow}
                        isGenerating={isGenerating}
                        isSaving={isSaving}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkflowEditPage;
