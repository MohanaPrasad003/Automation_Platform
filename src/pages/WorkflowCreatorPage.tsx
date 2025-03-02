
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import WorkflowCreator from "@/components/WorkflowCreator";
import { supabase } from "@/lib/supabase";

const WorkflowCreatorPage = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveWorkflow = async (workflowData: any) => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('workflows')
        .insert([{
          name: workflowData.name,
          description: workflowData.description,
          prompt: workflowData.prompt,
          nodes: workflowData.nodes,
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
      return data[0];
    } catch (error: any) {
      toast({
        title: "Error saving workflow",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setSaving(false);
    }
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
          
          <div className="grid grid-cols-1 gap-8">
            <WorkflowCreator 
              onSave={handleSaveWorkflow}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowCreatorPage;
