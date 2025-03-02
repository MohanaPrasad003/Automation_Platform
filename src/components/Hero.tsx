
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-automation-secondary text-automation-primary text-sm font-medium animate-fade-in">
            Introducing AI-Powered Workflow Automation
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Automate Your Workflows with Natural Language
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Simply describe what you want to automate in plain English, and our AI will create and configure the workflow for you. No technical expertise required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/auth?mode=signup"
              className="w-full sm:w-auto btn-primary flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/#features"
              className="w-full sm:w-auto btn-secondary flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero Image with Glass Morphism */}
        <div className="relative mx-auto max-w-5xl animate-blur-in" style={{ animationDelay: "0.4s" }}>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-[2px] rounded-2xl"></div>
            
            {/* Workflow Creation Mockup */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-automation-secondary px-6 py-4 border-b border-automation-border flex items-center justify-between">
                  <h3 className="font-medium text-automation-text">Create New Workflow</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe your workflow
                    </label>
                    <div className="bg-automation-secondary bg-opacity-50 border border-automation-border rounded-lg p-4 text-gray-600">
                      Send me a Slack message when a new lead is added to my Google Sheet
                    </div>
                  </div>
                  
                  <div className="border border-automation-border rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <div className="w-5 h-5 rounded-sm bg-blue-500"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">Google Sheets Trigger</h4>
                        <p className="text-sm text-gray-500">Monitors for new rows</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center py-2">
                      <div className="h-8 border-l-2 border-dashed border-gray-300"></div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                        <div className="w-5 h-5 rounded-sm bg-purple-500"></div>
                      </div>
                      <div>
                        <h4 className="font-medium">Slack</h4>
                        <p className="text-sm text-gray-500">Sends notification</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full">
                    Generate Workflow
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-400 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
