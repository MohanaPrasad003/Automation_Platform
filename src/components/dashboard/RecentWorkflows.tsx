
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const RecentWorkflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchWorkflows();
  }, []);
  
  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      
      setWorkflows(data || []);
    } catch (error: any) {
      console.error("Error fetching workflows:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Recent Workflows</h3>
            <p className="text-gray-600">
              Your recently created and executed workflows
            </p>
          </div>
          <Link 
            to="/workflow-manager"
            className="text-automation-primary text-sm font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-automation-primary" />
              <p className="mt-4 text-gray-600">Loading your workflows...</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't created any workflows yet.</p>
              <Link
                to="/workflow-creator"
                className="inline-flex items-center space-x-2 bg-automation-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                <span>Create your first workflow</span>
              </Link>
            </div>
          ) : (
            workflows.map((workflow, index) => (
              <div 
                key={workflow.id || index}
                className="p-4 border border-automation-border rounded-xl hover:border-automation-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/workflow-edit/${workflow.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{workflow.name}</h4>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                  </div>
                  <button className="text-gray-400 hover:text-automation-primary">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className={cn(
                    "px-2 py-1 rounded-full",
                    workflow.status === "active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  )}>
                    {workflow.status === "active" ? "Active" : "Paused"}
                  </span>
                  <span className="text-gray-500">
                    {workflow.execution_count || 0} executions
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/workflow-manager"
            className="text-automation-primary text-sm font-medium hover:underline"
          >
            View all workflows
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentWorkflows;
