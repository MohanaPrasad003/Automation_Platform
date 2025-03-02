
import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const DashboardLayout = ({ 
  children, 
  title = "Dashboard",
  description = "Manage your automated workflows" 
}: DashboardLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | AI Promptify</title>
      </Helmet>
      
      <div className="min-h-screen bg-automation-secondary bg-opacity-50 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <DashboardSidebar />
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-automation-text">{title}</h1>
                  <p className="text-gray-600">{description}</p>
                </div>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
