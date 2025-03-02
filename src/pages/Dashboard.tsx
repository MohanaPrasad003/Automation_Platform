
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Plus, 
  Search, 
  User, 
  Bell, 
  ChevronDown,
  Zap,
  Calendar,
  Clock,
  MoreHorizontal,
  LogOut,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import WorkflowCreator from "@/components/WorkflowCreator";
import ApiKeyManager from "@/components/ApiKeyManager";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("workflows");
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    
    setUser(session.user);
    fetchWorkflows();
  };
  
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
      // Don't show error toast on first load
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  
  return (
    <>
      <Helmet>
        <title>Dashboard | AI Promptify</title>
      </Helmet>
      
      <div className="min-h-screen bg-automation-secondary bg-opacity-50 flex flex-col">
        <header className="bg-white border-b border-automation-border py-4">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-automation-text"
            >
              <span className="bg-automation-primary text-white rounded-lg p-1">AI</span>
              <span>Promptify</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-automation-secondary border border-transparent focus:border-automation-border focus:outline-none w-64"
                />
              </div>
              
              <button className="p-2 relative text-gray-600 hover:text-automation-primary transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-automation-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{user?.email ? user.email.split('@')[0] : 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
                
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <aside className="w-full md:w-64 space-y-6">
              <nav className="bg-white rounded-xl shadow-sm p-3 border border-automation-border">
                <ul className="space-y-1">
                  {[
                    { id: "workflows", label: "Workflows", icon: <Zap className="h-4 w-4" /> },
                    { id: "scheduled", label: "Scheduled", icon: <Calendar className="h-4 w-4" /> },
                    { id: "executions", label: "Executions", icon: <Clock className="h-4 w-4" /> },
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          activeSection === item.id
                            ? "bg-automation-primary text-white"
                            : "text-gray-600 hover:bg-automation-secondary"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {user && <ApiKeyManager userId={user.id} />}
              
              <button 
                className="w-full flex items-center justify-between p-4 text-sm text-gray-600 hover:text-automation-primary transition-colors"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
            </aside>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-automation-text">Dashboard</h1>
                  <p className="text-gray-600">Manage your automated workflows</p>
                </div>
                
                <Link
                  to="/workflow-creator"
                  className="inline-flex items-center space-x-2 bg-automation-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Workflow</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <WorkflowCreator />
                </div>
                
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
                            <Plus className="h-4 w-4" />
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
