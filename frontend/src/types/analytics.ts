export interface StatusChartData {
  name: string;
  total_issues: string | number;
}

export interface PriorityChartData {
  name: string;
  total_issues: string | number;
}

export interface AssigneeChartData {
  assignee: {
    dis_name: string;
    display_name?: string;
    email: string;
    role: { name: string };
    issuename: string;
    mainissue: string;
    progress: number;
  };
  status: { name: string };
}

export interface MonthlyChartData {
  month: string;
  total_issues: string | number;
}

export interface AnalyticsData {
  total: { issue: number; sub_issue: number };
  members: number;
  resources: number;
  statusData: StatusChartData[];
  priorityData: PriorityChartData[];
  assigneeData: AssigneeChartData[];
  monthlyData: MonthlyChartData[];
}
