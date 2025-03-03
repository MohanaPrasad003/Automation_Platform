
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import RecentWorkflows from "./RecentWorkflows";

const DashboardContent = () => {
  return (
    <>
      <Link
        to="/workflow-creator"
        className="inline-flex items-center space-x-2 bg-automation-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>New Workflow</span>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Create a Workflow</h3>
            <p className="text-gray-600 mb-4">
              Automate tasks between your favorite apps with AI-powered workflows.
            </p>
            <Link
              to="/workflow-creator"
              className="inline-flex items-center space-x-2 text-automation-primary font-medium hover:underline"
            >
              <span>Get started</span>
            </Link>
          </div>
        </div>
        
        <RecentWorkflows />
      </div>
    </>
  );
};

export default DashboardContent;
