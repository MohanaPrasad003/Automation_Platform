
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Calendar, Clock, ArrowRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ApiKeyManager from "@/components/ApiKeyManager";
import { supabase } from "@/lib/supabase";

const DashboardSidebar = () => {
  const [activeSection, setActiveSection] = useState("workflows");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    
    fetchUser();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  
  return (
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
  );
};

export default DashboardSidebar;
