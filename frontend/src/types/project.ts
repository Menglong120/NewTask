import { Department } from './department';

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date?: string;
  end_date?: string;
  department?: { id: number; name: string } | null;
  status: ProjectStatus;
  members: ProjectMember[];
}

export interface ProjectStatus {
  id: number;
  title: string;
}

export interface ProjectMember {
  user: {
    id: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    dis_name?: string;
    avarta: string;
    email?: string;
  };
}

export interface ProjectProgress {
  id: number;
  name: string;
  progress: number;
  status: { id: number; title: string };
  issue: {
    total: string;
  };
}

export interface StatusOption {
  id: number;
  title: string;
}

export interface Member {
  id: number;
  user: {
    id: string;
    first_name?: string;
    last_name?: string;
    dis_name?: string;
    display_name?: string;
    email: string;
    avarta: string;
    role: { name: string; id: number };
  };
  dis_name?: string;
  email?: string;
  avarta?: string;
  created_on: string;
}

export interface ProjectSummary {
  id: number;
  name: string;
}

export interface ItemState {
  id: number;
  name: string;
  description?: string;
}

export interface AvailableUser {
  id: number;
  first_name: string;
  last_name: string;
  display_name?: string;
  dis_name: string;
  avarta: string;
  email?: string;
  role: { id: number; name: string };
}

export type DepartmentOption = Pick<Department, 'id' | 'name'>;

export interface NewProject {
  name: string;
  description: string;
  status_id: string;
  department_id: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
  member_ids: string[];
}

export interface EditProjectForm {
  name: string;
  description: string;
  department_id: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}

export interface StatusForm {
  status_id: string;
}
