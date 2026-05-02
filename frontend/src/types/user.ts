export interface UserOption {
  id: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avarta?: string;
}

export interface ProfileData {
  id: string;
  role?: {
    id: number;
    name: string;
  };
}

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  description: string;
  avarta: string;
  created_on: string;
  department: { id: number; name: string } | null;
  role: { id: number; name: string };
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  display_name?: string;
  dis_name?: string;
  email: string;
  description: string;
  avarta: string;
  role: { name: string; id: number };
}

export interface ProjectData {
  id: number;
  name: string;
  members: { user: { id: string } }[];
}

export interface Paginate {
  page: number;
  perpage: number;
  total: number;
  pages: number;
}

export interface DepartmentData {
  id: number;
  name: string;
}

export interface RoleData {
  id: number;
  name: string;
}
