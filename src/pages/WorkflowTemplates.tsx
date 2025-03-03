
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { WorkflowData } from "@/types/workflow";

// Define template categories
const categories = [
  "All Templates",
  "Communication",
  "Marketing",
  "Sales",
  "Customer Support",
  "HR",
  "Finance",
  "Project Management"
];

// Define sample templates
const templates = [
  {
    id: "template-1",
    name: "Lead Capture Notification",
    description: "Automatically send a notification to your team when a new lead is captured through your website form.",
    category: "Sales",
    popularity: 95,
    tags: ["sales", "leads", "notification"],
    nodes: [
      {
        id: "1",
        name: "Form Submission Trigger",
        type: "trigger",
        description: "Triggered when a form is submitted on your website"
      },
      {
        id: "2",
        name: "Lead Data Processing",
        type: "action",
        description: "Process and validate lead information"
      },
      {
        id: "3",
        name: "Team Notification",
        type: "action",
        description: "Send notification to sales team"
      }
    ]
  },
  {
    id: "template-2",
    name: "Daily Task Summary",
    description: "Compile and send a daily summary of all tasks completed by your team.",
    category: "Project Management",
    popularity: 87,
    tags: ["project", "tasks", "summary"],
    nodes: [
      {
        id: "1",
        name: "Daily Schedule Trigger",
        type: "trigger",
        description: "Runs automatically at the end of each workday"
      },
      {
        id: "2",
        name: "Task Data Collection",
        type: "action",
        description: "Gather completed tasks from project management tool"
      },
      {
        id: "3",
        name: "Summary Generation",
        type: "action",
        description: "Create a formatted summary report"
      },
      {
        id: "4",
        name: "Email Delivery",
        type: "action",
        description: "Send summary email to team leads"
      }
    ]
  },
  {
    id: "template-3",
    name: "New Content Alert",
    description: "Monitor your blog or content platform and send alerts when new content is published.",
    category: "Marketing",
    popularity: 82,
    tags: ["marketing", "content", "alert"],
    nodes: [
      {
        id: "1",
        name: "Content Published Trigger",
        type: "trigger",
        description: "Triggered when new content is published"
      },
      {
        id: "2",
        name: "Content Metadata Extraction",
        type: "action",
        description: "Extract title, description, and URL of new content"
      },
      {
        id: "3",
        name: "Social Media Post",
        type: "action",
        description: "Create and schedule social media posts"
      }
    ]
  },
  {
    id: "template-4",
    name: "Customer Feedback Analyzer",
    description: "Collect and analyze customer feedback to generate insights for your team.",
    category: "Customer Support",
    popularity: 78,
    tags: ["customer", "feedback", "analysis"],
    nodes: [
      {
        id: "1",
        name: "Feedback Form Submission",
        type: "trigger",
        description: "Triggered when a customer submits feedback"
      },
      {
        id: "2",
        name: "Sentiment Analysis",
        type: "action",
        description: "Analyze feedback tone using AI"
      },
      {
        id: "3",
        name: "Categorization",
        type: "action",
        description: "Categorize feedback by topic and urgency"
      },
      {
        id: "4",
        name: "Team Alert",
        type: "action",
        description: "Alert relevant team members based on feedback content"
      }
    ]
  },
  {
    id: "template-5",
    name: "Invoice Payment Reminder",
    description: "Automatically send reminders to clients when invoices are approaching their due date.",
    category: "Finance",
    popularity: 75,
    tags: ["invoice", "payment", "reminder"],
    nodes: [
      {
        id: "1",
        name: "Date Check Trigger",
        type: "trigger",
        description: "Checks daily for upcoming invoice due dates"
      },
      {
        id: "2",
        name: "Invoice Status Check",
        type: "action",
        description: "Verify if invoice is still unpaid"
      },
      {
        id: "3",
        name: "Reminder Email",
        type: "action",
        description: "Send a friendly payment reminder email"
      }
    ]
  },
  {
    id: "template-6",
    name: "Employee Onboarding",
    description: "Streamline your employee onboarding process with automated task assignments and reminders.",
    category: "HR",
    popularity: 73,
    tags: ["hr", "onboarding", "employees"],
    nodes: [
      {
        id: "1",
        name: "New Employee Added",
        type: "trigger",
        description: "Triggered when a new employee record is created"
      },
      {
        id: "2",
        name: "Create Onboarding Tasks",
        type: "action",
        description: "Generate onboarding tasks for different departments"
      },
      {
        id: "3",
        name: "Equipment Request",
        type: "action",
        description: "Submit IT equipment request"
      },
      {
        id: "4",
        name: "Welcome Email",
        type: "action",
        description: "Send welcome email with first day information"
      }
    ]
  }
];

const WorkflowTemplates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All Templates" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: any) => {
    try {
      // Create a new workflow based on the template
      const workflowData: WorkflowData = {
        name: template.name,
        description: template.description,
        nodes: template.nodes
      };
      
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // Save to database
      const { data, error } = await supabase
        .from('workflows')
        .insert([{
          name: workflowData.name,
          description: workflowData.description,
          prompt: `Create a workflow for: ${workflowData.description}`,
          nodes: workflowData.nodes,
          status: "active",
          user_id: session.user.id,
          from_template: true,
          template_id: template.id
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Template applied",
        description: "Workflow created successfully from template",
      });
      
      // Navigate to the edit page for the new workflow
      navigate(`/workflow-edit/${data[0].id}`);
    } catch (error: any) {
      toast({
        title: "Error applying template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Workflow Templates | AI Promptify</title>
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
                <h1 className="text-2xl font-bold">Workflow Templates</h1>
                <p className="text-gray-600">Browse and use pre-built workflow templates</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative w-full md:w-2/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-10"
                    placeholder="Search templates..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-1/3">
                  <div className="flex overflow-x-auto pb-2 md:pb-0 -mx-2 md:mx-0 space-x-2 md:justify-end">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={`shrink-0 ${selectedCategory === category ? 'bg-automation-primary' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className="border border-automation-border rounded-xl hover:border-automation-primary transition-colors overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{template.name}</h3>
                            <div className="text-sm text-automation-primary font-medium mb-2">
                              {template.category}
                            </div>
                          </div>
                          <Sparkles className="h-5 w-5 text-indigo-500" />
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="mb-6">
                          <div className="text-sm text-gray-500 mb-1">
                            {template.nodes.length} steps
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-indigo-500 h-1.5 rounded-full" 
                              style={{ width: `${template.popularity}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Popularity</span>
                            <span>{template.popularity}%</span>
                          </div>
                        </div>
                        
                        <Button
                          className="w-full bg-automation-primary hover:bg-automation-primary/90"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use This Template
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No templates found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowTemplates;
