
import { Link } from "react-router-dom";
import { Plus, Sparkles, BarChart3 } from "lucide-react";
import RecentWorkflows from "./RecentWorkflows";

const DashboardContent = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          to="/workflow-creator"
          className="inline-flex items-center space-x-2 bg-automation-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Workflow</span>
        </Link>
        
        <Link
          to="/workflow-templates"
          className="inline-flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Explore Templates</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly Executions</h3>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="h-48 flex items-center justify-center">
              <BarChart3 className="h-32 w-32 text-gray-300" />
              <span className="text-gray-500 ml-4">No data yet</span>
            </div>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-white p-6 rounded-xl shadow-sm h-full">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <Link
                to="/workflow-creator"
                className="block p-4 border border-automation-border rounded-lg hover:border-automation-primary transition-colors"
              >
                <h4 className="font-medium mb-1">Create Workflow</h4>
                <p className="text-sm text-gray-600">
                  Build a new automation from scratch
                </p>
              </Link>
              
              <Link
                to="/workflow-templates"
                className="block p-4 border border-automation-border rounded-lg hover:border-automation-primary transition-colors"
              >
                <h4 className="font-medium mb-1">Browse Templates</h4>
                <p className="text-sm text-gray-600">
                  Start with pre-built automation templates
                </p>
              </Link>
              
              <Link
                to="/workflow-manager"
                className="block p-4 border border-automation-border rounded-lg hover:border-automation-primary transition-colors"
              >
                <h4 className="font-medium mb-1">Manage Workflows</h4>
                <p className="text-sm text-gray-600">
                  View and edit your existing automations
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentWorkflows />
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Popular Templates</h3>
                <p className="text-gray-600">
                  Quick-start with these popular workflow templates
                </p>
              </div>
              <Link 
                to="/workflow-templates"
                className="text-automation-primary text-sm font-medium hover:underline"
              >
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-automation-border rounded-xl hover:border-automation-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">Lead Capture Notification</h4>
                    <p className="text-sm text-gray-600">Notify your team when new leads are captured</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
              
              <div className="p-4 border border-automation-border rounded-xl hover:border-automation-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">Daily Task Summary</h4>
                    <p className="text-sm text-gray-600">Get daily summaries of completed tasks</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
              
              <div className="p-4 border border-automation-border rounded-xl hover:border-automation-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">New Content Alert</h4>
                    <p className="text-sm text-gray-600">Get notified when new content is published</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
