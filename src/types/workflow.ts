
export interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'action';
  description: string;
}

export interface WorkflowData {
  name: string;
  description: string;
  nodes: WorkflowNode[];
}
