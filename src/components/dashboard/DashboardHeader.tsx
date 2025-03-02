
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DashboardHeader = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    
    fetchUser();
  }, []);
  
  return (
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
  );
};

export default DashboardHeader;
