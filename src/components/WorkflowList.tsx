
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface WorkflowListProps {
  workflows: any[];
  onRefresh: () => void;
  onStatusChange?: (workflowId: string, newStatus: string) => void;
}

const WorkflowList = ({ workflows, onRefresh, onStatusChange }: WorkflowListProps) => {
  const [actionWorkflow, setActionWorkflow] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const toggleWorkflowStatus = async (workflow: any) => {
    try {
      setLoadingId(workflow.id);
      const newStatus = workflow.status === "active" ? "paused" : "active";
      
      // If onStatusChange is provided, use it; otherwise, fall back to the internal implementation
      if (onStatusChange) {
        onStatusChange(workflow.id, newStatus);
        setLoadingId(null);
        return;
      }
      
      const { error } = await supabase
        .from('workflows')
        .update({ status: newStatus })
        .eq('id', workflow.id);
        
      if (error) throw error;
      
      toast({
        title: `Workflow ${newStatus}`,
        description: `The workflow has been ${newStatus}`,
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error updating workflow",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };
  
  const deleteWorkflow = async () => {
    if (!actionWorkflow) return;
    
    try {
      setLoadingId(actionWorkflow.id);
      
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', actionWorkflow.id);
        
      if (error) throw error;
      
      toast({
        title: "Workflow deleted",
        description: "The workflow has been deleted",
      });
      
      setDeleteDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error deleting workflow",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
      setActionWorkflow(null);
    }
  };
  
  const handleEdit = (workflow: any) => {
    navigate(`/workflow-edit/${workflow.id}`);
  };
  
  const handleRunNow = async (workflow: any) => {
    try {
      setLoadingId(workflow.id);
      
      // TODO: Integrate with actual n8n API to run the workflow
      // This is a mock execution for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Workflow executed",
        description: "The workflow has been executed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error executing workflow",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (workflows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">No workflows found</h3>
        <p className="text-gray-600 mb-6">
          You haven't created any workflows yet. Get started by creating your first workflow.
        </p>
        <Button 
          className="bg-automation-primary hover:bg-automation-primary/90"
          onClick={() => navigate("/workflow-creator")}
        >
          Create Your First Workflow
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-automation-border">
      <div className="p-6 border-b border-automation-border">
        <h2 className="text-xl font-semibold">Your Workflows</h2>
        <p className="text-gray-600">Manage and monitor your automated workflows</p>
      </div>
      
      <div className="divide-y divide-automation-border">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <span className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    workflow.status === "active" ? "bg-green-500" : "bg-yellow-500"
                  )} />
                  <h3 className="font-medium">{workflow.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {workflow.nodes?.map((node: any, index: number) => (
                    <span 
                      key={index}
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        node.type === "trigger" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-purple-100 text-purple-700"
                      )}
                    >
                      {node.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRunNow(workflow)}
                  disabled={loadingId === workflow.id || workflow.status !== "active"}
                >
                  {loadingId === workflow.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Run now"
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(workflow)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleWorkflowStatus(workflow)}>
                      {workflow.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => {
                        setActionWorkflow(workflow);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              workflow and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={deleteWorkflow}
            >
              {loadingId === actionWorkflow?.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkflowList;
