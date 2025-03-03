
import { WorkflowNode } from "@/types/workflow";

interface WorkflowStepsProps {
  nodes: WorkflowNode[];
}

const getNodeColor = (type: string) => {
  switch(type) {
    case 'trigger': 
      return {
        bg: '#EBF5FF',
        text: '#3B82F6'
      };
    case 'action': 
      return {
        bg: '#F3E8FF',
        text: '#9333EA'
      };
    case 'condition': 
      return {
        bg: '#FEF3C7',
        text: '#D97706'
      };
    case 'filter': 
      return {
        bg: '#ECFDF5', 
        text: '#10B981'
      };
    case 'transformer': 
      return {
        bg: '#FEE2E2', 
        text: '#EF4444'
      };
    default: 
      return {
        bg: '#F3F4F6',
        text: '#6B7280'
      };
  }
};

const WorkflowSteps = ({ nodes }: WorkflowStepsProps) => {
  return (
    <div className="space-y-6">
      {nodes.map((node, index) => (
        <div key={node.id}>
          <div className="flex items-start">
            <div 
              className="w-10 h-10 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center" 
              style={{ 
                backgroundColor: getNodeColor(node.type).bg,
                color: getNodeColor(node.type).text
              }}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{node.name}</h5>
                  <p className="text-sm text-gray-600">{node.description}</p>
                </div>
                <span 
                  className="text-xs px-2 py-1 rounded-full capitalize" 
                  style={{
                    backgroundColor: getNodeColor(node.type).bg,
                    color: getNodeColor(node.type).text
                  }}
                >
                  {node.type}
                </span>
              </div>
              
              {node.config && Object.keys(node.config).length > 0 && (
                <div className="mt-2 bg-gray-50 p-2 rounded-md text-xs">
                  <div className="font-medium text-gray-500 mb-1">Configuration:</div>
                  <pre className="text-gray-600 overflow-x-auto">
                    {JSON.stringify(node.config, null, 2)}
                  </pre>
                </div>
              )}
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
