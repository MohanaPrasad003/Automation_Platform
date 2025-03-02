
import { WorkflowNode } from "@/types/workflow";

interface WorkflowStepsProps {
  nodes: WorkflowNode[];
}

const WorkflowSteps = ({ nodes }: WorkflowStepsProps) => {
  return (
    <div className="space-y-6">
      {nodes.map((node, index) => (
        <div key={node.id}>
          <div className="flex items-start">
            <div 
              className="w-10 h-10 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center" 
              style={{ 
                backgroundColor: node.type === 'trigger' ? '#EBF5FF' : '#F3E8FF',
                color: node.type === 'trigger' ? '#3B82F6' : '#9333EA'
              }}
            >
              {index + 1}
            </div>
            <div>
              <h5 className="font-medium">{node.name}</h5>
              <p className="text-sm text-gray-600">{node.description}</p>
            </div>
          </div>
          {index < nodes.length - 1 && (
            <div className="pl-5 ml-[14px] mt-2 mb-2 border-l-2 border-dashed border-gray-200 h-6"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkflowSteps;
