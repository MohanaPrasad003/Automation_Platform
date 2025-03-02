
import { useState } from "react";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const WorkflowCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowData | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Simulate workflow generation
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockWorkflow: WorkflowData = {
        name: "New Lead Notification",
        description: "Sends a Slack message when a new lead is added to Google Sheets",
        nodes: [
          {
            id: "1",
            name: "Google Sheets Trigger",
            type: "trigger",
            description: "Monitors for new rows in the specified sheet"
          },
          {
            id: "2",
            name: "Slack",
            type: "action",
            description: "Sends a notification to the specified channel"
          }
        ]
      };
      
      setGeneratedWorkflow(mockWorkflow);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Create Workflow</h3>
          <p className="text-gray-600">
            Describe what you want to automate in simple words
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Textarea
              placeholder="e.g., Send a Slack message when a new lead is added to my Google Sheet"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 resize-none rounded-xl border-automation-border focus:ring-automation-primary"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!prompt.trim() || isGenerating}
              className="bg-automation-primary hover:bg-automation-primary/90 flex items-center gap-2"
            >
              {isGenerating ? (
                <>Generating <Sparkles className="h-4 w-4 animate-pulse" /></>
              ) : (
                <>Generate Workflow <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </form>

        {generatedWorkflow && (
          <div className="mt-8 animate-fade-in">
            <div className="border-t border-automation-border pt-6">
              <h4 className="font-medium mb-2">{generatedWorkflow.name}</h4>
              <p className="text-gray-600 text-sm mb-6">
                {generatedWorkflow.description}
              </p>
              
              <div className="space-y-6">
                {generatedWorkflow.nodes.map((node, index) => (
                  <div key={node.id}>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center" 
                           style={{ 
                             backgroundColor: node.type === 'trigger' ? '#EBF5FF' : '#F3E8FF',
                             color: node.type === 'trigger' ? '#3B82F6' : '#9333EA'
                           }}>
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium">{node.name}</h5>
                        <p className="text-sm text-gray-600">{node.description}</p>
                      </div>
                    </div>
                    {index < generatedWorkflow.nodes.length - 1 && (
                      <div className="pl-5 ml-[14px] mt-2 mb-2 border-l-2 border-dashed border-gray-200 h-6"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex space-x-4">
                <Button variant="outline" className="flex-1 rounded-xl">
                  Edit
                </Button>
                <Button className="flex-1 rounded-xl bg-automation-primary hover:bg-automation-primary/90">
                  Deploy <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'action';
  description: string;
}

interface WorkflowData {
  name: string;
  description: string;
  nodes: WorkflowNode[];
}

export default WorkflowCreator;
