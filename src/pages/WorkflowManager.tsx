
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import WorkflowCreator from "@/components/WorkflowCreator";
import WorkflowList from "@/components/WorkflowList";
import { supabase } from "@/lib/supabase";

const WorkflowManager = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
      fetchWorkflows();
    };
    
    checkAuth();
  }, [navigate]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setWorkflows(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching workflows",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflow = async (workflowData: any) => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert([workflowData])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Workflow saved",
        description: "Your workflow has been saved successfully",
      });
      
      fetchWorkflows();
      return data[0];
    } catch (error: any) {
      toast({
        title: "Error saving workflow",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Workflow Manager | AI Promptify</title>
      </Helmet>
      
      <div className="min-h-screen bg-automation-secondary bg-opacity-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Workflow Manager</h1>
                <p className="text-gray-600">Create and manage your automated workflows</p>
              </div>
            </div>
            
            <Button
              className="bg-automation-primary hover:bg-automation-primary/90"
              onClick={() => navigate("/workflow-creator")}
            >
              <Plus className="h-4 w-4 mr-2" /> New Workflow
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-automation-primary" />
                <p className="mt-4 text-gray-600">Loading your workflows...</p>
              </div>
            ) : (
              <WorkflowList 
                workflows={workflows} 
                onRefresh={fetchWorkflows} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowManager;
