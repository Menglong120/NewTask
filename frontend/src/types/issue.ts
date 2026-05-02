export interface SubIssue {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: { id: number; name: string };
}

export interface Issue {
  id: number;
  name: string;
  description: string;
  start_date: string;
  due_date: string;
  estimated_date?: string;
  progress: number;
  status: { id: number; name: string; title?: string };
  priority: { id: number; name: string; title?: string };
  tracker: { id: number; name: string; title?: string };
  label: { id: number; name: string; title?: string };
  category?: { id: number; name: string; project?: { id: number; name: string } };
  assignee: {
    id: string;
    email: string;
    dis_name: string;
    first_name?: string;
    last_name?: string;
    status: number;
    avarta?: string;
    user?: { 
      id: string; 
      display_name?: string; 
      dis_name?: string;
      first_name?: string;
      last_name?: string;
      avarta: string; 
      email: string; 
    }
  };
  subIssues?: SubIssue[];
}

export interface Activity {
  id: number;
  title: string;
  activity: string;
  created_on: string;
  actor: { 
    dis_name?: string; 
    first_name?: string;
    last_name?: string;
    avarta: string;
  };
}

export interface Note {
  id: number;
  notes: string;
  created_on: string;
  noter: { 
    id: string; 
    disname: string; 
    first_name?: string;
    last_name?: string;
    avarta: string; 
    email: string; 
  };
}

export interface NewSubIssue {
  name: string;
  description: string;
  status_id: string;
  priority_id: string;
  tracker_id: string;
  label_id: string;
  assignee: string;
  start_date?: Date;
  due_date?: Date;
}

export interface NewIssue {
  name: string;
  tracker_id: string;
  status_id: string;
  priority_id: string;
  label_id: string;
  assignee_id: string;
  start_date: Date | undefined;
  due_date: Date | undefined;
  description: string;
}
