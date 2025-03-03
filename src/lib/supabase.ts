
import { createClient } from '@supabase/supabase-js';

// Default values for development/demo mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW9rZXkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5NzU5NiwiZXhwIjoxOTI4NjczNTk2fQ.ar1XnLRV_z-2Q0WmrxUdLcznnkJN-KMuVsC8YDmcnJ8';

// Log a warning if we're using demo credentials
if (supabaseUrl === 'https://example.supabase.co') {
  console.warn('Using mock Supabase client. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This function creates mocks for Supabase responses
export const mockSupabaseData = {
  workflows: [
    {
      id: '1',
      name: 'Email Newsletter',
      description: 'Send weekly newsletter to subscribers',
      status: 'active',
      created_at: '2023-10-15T09:00:00Z',
      execution_count: 28,
      nodes: [
        { name: 'Schedule', type: 'trigger' },
        { name: 'Fetch Content', type: 'action' },
        { name: 'Send Email', type: 'action' }
      ]
    },
    {
      id: '2',
      name: 'Social Media Posts',
      description: 'Automatically post to social media platforms',
      status: 'paused',
      created_at: '2023-09-20T14:30:00Z',
      execution_count: 12,
      nodes: [
        { name: 'Content Approval', type: 'trigger' },
        { name: 'Format Content', type: 'action' },
        { name: 'Post to Socials', type: 'action' }
      ]
    },
    {
      id: '3',
      name: 'Data Backup',
      description: 'Daily backup of database to cloud storage',
      status: 'active',
      created_at: '2023-11-05T23:15:00Z',
      execution_count: 42,
      nodes: [
        { name: 'Daily Trigger', type: 'trigger' },
        { name: 'Export Data', type: 'action' },
        { name: 'Upload to S3', type: 'action' }
      ]
    }
  ]
};

// Mock implementation for Supabase queries
export const mockSupabaseQuery = (tableName: string) => {
  const data = mockSupabaseData[tableName as keyof typeof mockSupabaseData] || [];
  
  return {
    from: () => mockSupabaseQuery(tableName),
    select: () => mockSupabaseQuery(tableName),
    insert: () => ({ select: () => ({ data: [data[0]], error: null }) }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    eq: () => ({ data, error: null }),
    order: () => mockSupabaseQuery(tableName),
    limit: () => ({ data, error: null }),
  };
};
