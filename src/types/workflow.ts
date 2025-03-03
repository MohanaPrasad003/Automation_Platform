
export interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition' | 'filter' | 'transformer';
  description: string;
  config?: Record<string, any>;
  next?: string[];
  errorNext?: string;
}

export interface WorkflowData {
  name: string;
  description: string;
  nodes: WorkflowNode[];
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'paused' | 'draft' | 'error';
  execution_count?: number;
  last_executed?: string;
  from_template?: boolean;
  template_id?: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'success' | 'failed' | 'running';
  started_at: string;
  completed_at?: string;
  logs: WorkflowExecutionLog[];
  error?: string;
  duration_ms?: number;
}

export interface WorkflowExecutionLog {
  node_id: string;
  node_name: string;
  status: 'success' | 'failed' | 'running';
  started_at: string;
  completed_at?: string;
  output?: any;
  error?: string;
}

export interface WorkflowStats {
  total_executions: number;
  success_rate: number;
  average_duration_ms: number;
  last_executed: string;
  executions_by_day: {
    date: string;
    count: number;
    success_count: number;
    failure_count: number;
  }[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: number;
  tags: string[];
  nodes: WorkflowNode[];
}
