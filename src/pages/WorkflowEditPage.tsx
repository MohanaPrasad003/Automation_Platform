
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import WorkflowCreator from "@/components/WorkflowCreator";
import { supabase } from "@/lib/supabase";

const WorkflowEditPage = () => {
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      
      setWorkflow(data);
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

  const handleUpdateWorkflow = async (workflowData: any) => {
    if (!id) return null;
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('workflows')
        .update({
          name: workflowData.name,
          description: workflowData.description,
          prompt: workflowData.prompt,
          nodes: workflowData.nodes,
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
      return data[0];
    } catch (error: any) {
      toast({
        title: "Error updating workflow",
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
          
          <div className="grid grid-cols-1 gap-8">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-automation-primary" />
                <p className="mt-4 text-gray-600">Loading workflow...</p>
              </div>
            ) : (
              <WorkflowCreator 
                onSave={handleUpdateWorkflow}
                saving={saving}
                existingWorkflow={workflow}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowEditPage;
