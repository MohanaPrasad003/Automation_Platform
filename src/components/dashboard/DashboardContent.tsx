
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import WorkflowCreator from "@/components/WorkflowCreator";
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
          <WorkflowCreator />
        </div>
        
        <RecentWorkflows />
      </div>
    </>
  );
};

export default DashboardContent;
