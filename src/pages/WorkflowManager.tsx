import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import WorkflowList from "@/components/WorkflowList";
import { supabase, mockSupabaseData } from "@/lib/supabase";

const WorkflowManager = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "alphabetical">("newest");
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // For demo purposes, we'll continue without authentication
          console.log("No active session, using mock data");
          setIsUsingMockData(true);
        }
      } catch (error) {
        console.error("Auth check failed, using mock data", error);
        setIsUsingMockData(true);
      }
      
      fetchWorkflows();
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Apply filters and search when workflows, searchQuery, or statusFilter change
    let result = [...workflows];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(workflow => 
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(workflow => workflow.status === statusFilter);
    }
    
    // Apply sorting
    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortOrder === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredWorkflows(result);
  }, [workflows, searchQuery, statusFilter, sortOrder]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      
      if (isUsingMockData) {
        // Use mock data for demo purposes
        setWorkflows(mockSupabaseData.workflows);
        setFilteredWorkflows(mockSupabaseData.workflows);
        toast({
          title: "Demo Mode",
          description: "Using mock data for demonstration. Connect Supabase for full functionality.",
        });
      } else {
        // Try to fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('workflows')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setWorkflows(data || []);
          setFilteredWorkflows(data || []);
        } catch (supabaseError) {
          console.error("Supabase fetch failed, falling back to mock data", supabaseError);
          setIsUsingMockData(true);
          setWorkflows(mockSupabaseData.workflows);
          setFilteredWorkflows(mockSupabaseData.workflows);
          toast({
            title: "Supabase Connection Failed",
            description: "Using mock data for demonstration. Please check your Supabase configuration.",
            variant: "destructive",
          });
        }
      }
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
      if (isUsingMockData) {
        // Mock save for demo mode
        const newWorkflow = {
          ...workflowData,
          id: `mock-${Date.now()}`,
          created_at: new Date().toISOString()
        };
        
        const updatedWorkflows = [newWorkflow, ...mockSupabaseData.workflows];
        setWorkflows(updatedWorkflows);
        
        toast({
          title: "Workflow saved (Demo)",
          description: "Your workflow has been saved in demo mode.",
        });
        
        return newWorkflow;
      } else {
        // Try to save to Supabase
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
      }
    } catch (error: any) {
      toast({
        title: "Error saving workflow",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleStatusChange = (workflowId: string, newStatus: string) => {
    if (isUsingMockData) {
      // Handle status change in mock mode
      const updatedWorkflows = workflows.map(wf => 
        wf.id === workflowId ? { ...wf, status: newStatus } : wf
      );
      setWorkflows(updatedWorkflows);
      toast({
        title: "Status updated (Demo)",
        description: `Workflow status changed to ${newStatus} in demo mode.`,
      });
    } else {
      // Try to update in Supabase
      const updateWorkflow = async () => {
        try {
          const { error } = await supabase
            .from('workflows')
            .update({ status: newStatus })
            .eq('id', workflowId);
            
          if (error) throw error;
          
          toast({
            title: "Status updated",
            description: `Workflow status changed to ${newStatus}`,
          });
          
          fetchWorkflows();
        } catch (error: any) {
          toast({
            title: "Error updating status",
            description: error.message,
            variant: "destructive",
          });
        }
      };
      
      updateWorkflow();
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
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate("/workflow-templates")}
              >
                Templates
              </Button>
              
              <Button
                className="bg-automation-primary hover:bg-automation-primary/90"
                onClick={() => navigate("/workflow-creator")}
              >
                <Plus className="h-4 w-4 mr-2" /> New Workflow
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-10"
                    placeholder="Search workflows..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                          All
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("paused")}>
                          Paused
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                          Draft
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuLabel>Sort Workflows</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                          Newest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                          Oldest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOrder("alphabetical")}>
                          Alphabetical
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-automation-primary" />
                  <p className="mt-4 text-gray-600">Loading your workflows...</p>
                </div>
              ) : filteredWorkflows.length > 0 ? (
                <WorkflowList 
                  workflows={filteredWorkflows} 
                  onRefresh={fetchWorkflows}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No workflows found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria" 
                      : "You haven't created any workflows yet"}
                  </p>
                  
                  {!searchQuery && statusFilter === "all" && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        className="bg-automation-primary hover:bg-automation-primary/90"
                        onClick={() => navigate("/workflow-creator")}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Create Workflow
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => navigate("/workflow-templates")}
                      >
                        Browse Templates
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowManager;
