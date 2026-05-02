import React from 'react';

export interface Department {
  id: number;
  name: string;
  description: string | null;
  total_users: number | string;
  total_projects: number | string;
  created_on: string;
}

export interface DepartmentDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingDepartment: Department | null;
  form: { name: string; description: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>;
  submitting: boolean;
  handleSubmit: () => Promise<any>;
  pendingDeleteDepartment: Department | null;
  setPendingDeleteDepartment: (dept: Department | null) => void;
  handleDelete: (dept: Department) => Promise<any>;
}
