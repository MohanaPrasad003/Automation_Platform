
import { 
  MessageSquare, 
  Zap, 
  Shield, 
  LineChart, 
  Layers, 
  Key
} from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-automation-secondary bg-opacity-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white text-automation-primary text-sm font-medium">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Automation Made Simple
          </h2>
          <p className="text-lg text-gray-600">
            Our platform combines the power of AI with n8n's workflow engine to make automation accessible to everyone, regardless of technical background.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Natural Language Input"
            description="Describe what you want to automate in plain English. No technical jargon needed."
            delay={0}
          />
          
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="AI-Generated Workflows"
            description="Our AI analyzes your description and generates a complete, functional workflow."
            delay={0.1}
          />
          
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure API Management"
            description="Safely store and manage your API keys with enterprise-grade encryption."
            delay={0.2}
          />
          
          <FeatureCard
            icon={<LineChart className="h-6 w-6" />}
            title="Execution Monitoring"
            description="Track the performance and status of your workflows in real-time."
            delay={0.3}
          />
          
          <FeatureCard
            icon={<Layers className="h-6 w-6" />}
            title="Multi-Service Integration"
            description="Connect with hundreds of services including Google, Slack, and more."
            delay={0.4}
          />
          
          <FeatureCard
            icon={<Key className="h-6 w-6" />}
            title="User Authentication"
            description="Secure account management with robust authentication protocols."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <div 
    className="bg-white rounded-2xl p-6 shadow-sm card-hover animate-fade-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="h-12 w-12 rounded-xl bg-automation-secondary flex items-center justify-center mb-5">
      <div className="text-automation-primary">
        {icon}
      </div>
    </div>
    
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Features;
