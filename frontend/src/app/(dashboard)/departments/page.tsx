'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, FolderOpen, Loader2, MoreVertical, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  description: string | null;
  total_users: number | string;
  total_projects: number | string;
  created_on: string;
}

const emptyForm = { name: '', description: '' };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchApi(`/api/departments?search=${encodeURIComponent(search)}`);
      if (res.result) {
        setDepartments(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const totals = useMemo(() => {
    return departments.reduce(
      (acc, department) => {
        acc.users += Number(department.total_users || 0);
        acc.projects += Number(department.total_projects || 0);
        return acc;
      },
      { users: 0, projects: 0 }
    );
  }, [departments]);

  const openCreate = () => {
    setEditingDepartment(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (department: Department) => {
    setEditingDepartment(department);
    setForm({
      name: department.name,
      description: department.description || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (form.name.trim().length < 2) {
      await Swal.fire({ icon: 'error', title: 'Department name is too short', text: 'Use at least 2 characters.' });
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = editingDepartment ? `/api/department/${editingDepartment.id}` : '/api/department';
      const method = editingDepartment ? 'PUT' : 'POST';
      const res = await fetchApi(endpoint, {
        method,
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
        }),
      });

      if (res.result) {
        setDialogOpen(false);
        setForm(emptyForm);
        setEditingDepartment(null);
        fetchDepartments();
        Swal.fire({
          icon: 'success',
          title: editingDepartment ? 'Department updated' : 'Department created',
          toast: true,
          position: 'top-end',
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save department';
      Swal.fire({ icon: 'error', title: 'Save failed', text: message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (department: Department) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: `Delete ${department.name}?`,
      text: 'This only works if no users or projects are assigned to this department.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetchApi(`/api/department/${department.id}`, { method: 'DELETE' });
      if (res.result) {
        fetchDepartments();
        Swal.fire({
          icon: 'success',
          title: 'Department deleted',
          toast: true,
          position: 'top-end',
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete department';
      Swal.fire({ icon: 'error', title: 'Delete failed', text: message });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-3xl font-bold">{departments.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Assigned Users</p>
              <p className="text-3xl font-bold">{totals.users}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Projects In Departments</p>
              <p className="text-3xl font-bold">{totals.projects}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Department Table</CardTitle>
            <CardDescription>Super admin can see how many users and projects belong to each department.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search department..." className="pl-9" />
            </div>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Department</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Description</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Users</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Projects</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Created</TableHead>
                    <TableHead className="text-right py-3"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                        <span className="text-sm text-muted-foreground">Loading departments...</span>
                      </TableCell>
                    </TableRow>
                  ) : departments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                        No departments found.
                      </TableCell>
                    </TableRow>
                  ) : departments.map((department) => (
                    <TableRow key={department.id} className="group">
                      <TableCell>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm tracking-tight truncate">{department.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[320px]">
                        <span className="text-[10px] text-muted-foreground font-medium line-clamp-2">
                          {department.description || 'No description'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wide px-2 h-5">
                          {department.total_users}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wide px-2 h-5">
                          {department.total_projects}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] font-medium text-muted-foreground">
                        {new Date(department.created_on).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => openEdit(department)}>
                              <Pencil className="h-4 w-4" />
                              Edit Department
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(department)} variant="destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete Department
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDepartment ? 'Edit Department' : 'Create Department'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Department Name</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Engineering" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Short description for this department"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingDepartment ? 'Save Changes' : 'Create Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
