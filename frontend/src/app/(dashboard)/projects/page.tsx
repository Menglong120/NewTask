'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/datepicker';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  FolderOpen,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fetchApi } from '@/lib/api';
import ProjectKanbanBoard from '@/components/ProjectKanbanBoard';
import Swal from 'sweetalert2';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";

interface Project {
  id: number;
  name: string;
  description: string;
  start_date?: string;
  end_date?: string;
  status: { id: number; title: string; };
  members: Array<{ user: { id: string; display_name?: string; dis_name?: string; avarta: string; }; }>;
}

interface ProjectProgress { id: number; progress: number; issue: { total: string }; }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [progressData, setProgressData] = useState<ProjectProgress[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');

  // Modals
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'status' | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Forms
  const [newProject, setNewProject] = useState({ 
    name: '', 
    status_id: '', 
    start_date: undefined as Date | undefined, 
    end_date: undefined as Date | undefined, 
    description: '', 
    members: [] as string[] 
  });
  const [editForm, setEditForm] = useState({ 
    name: '', 
    description: '', 
    start_date: undefined as Date | undefined, 
    end_date: undefined as Date | undefined 
  });
  const [statusForm, setStatusForm] = useState({ status_id: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, progressRes, statusRes, userRes, profileRes] = await Promise.allSettled([
        fetchApi('/api/projects'),
        fetchApi('/api/analyst/dashboard/allprogress'),
        fetchApi('/api/projects/status'),
        fetchApi('/api/users?search=&role=0&page=1&perpage=1000'),
        fetchApi('/api/profile')
      ]);

      if (projectRes.status === 'fulfilled' && projectRes.value.result) {
        setProjects(projectRes.value.data.datas || projectRes.value.data);
      }
      if (progressRes.status === 'fulfilled' && progressRes.value.result) {
        setProgressData(progressRes.value.data);
      }
      if (statusRes.status === 'fulfilled' && statusRes.value.result) {
        setStatuses(statusRes.value.data.datas || statusRes.value.data);
      }
      let loggedInUserId = null;
      if (profileRes.status === 'fulfilled' && profileRes.value.result && profileRes.value.data.length > 0) {
        loggedInUserId = profileRes.value.data[0].id;
      }

      if (userRes.status === 'fulfilled' && userRes.value.result) {
        let fetchedUsers = userRes.value.data.datas || userRes.value.data;
        fetchedUsers = fetchedUsers.filter((u: any) =>
          Number(u.role?.id) !== 1 &&
          Number(u.role_id) !== 1
        );
        if (loggedInUserId) {
          fetchedUsers = fetchedUsers.filter((u: any) => u.id !== loggedInUserId);
        }
        setUsers(fetchedUsers);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.status_id) {
      return Swal.fire({ icon: 'error', title: 'Missing Information', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    }
    try {
      setSubmitting(true);
      const payload = {
        ...newProject,
        start_date: newProject.start_date?.toISOString(),
        end_date: newProject.end_date?.toISOString()
      };
      const res = await fetchApi('/api/project', { method: 'POST', body: JSON.stringify(payload) });
      if (res.result) {
        setActiveModal(null);
        setNewProject({ name: '', status_id: statuses.length > 0 ? String(statuses[0].id) : '', start_date: undefined, end_date: undefined, description: '', members: [] });
        fetchData();
        window.dispatchEvent(new Event('projectUpdate'));
        Swal.fire({ icon: 'success', title: 'Project created!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else { 
        Swal.fire({ title: 'Error', text: res.msg || 'Failed to create project', icon: 'error', background: '#121212', color: '#fff' }); 
      }
    } catch (error: any) { 
      Swal.fire({ title: 'System Error', text: error.message || 'An unexpected error occurred', icon: 'error', background: '#121212', color: '#fff' });
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleEditProject = async () => {
    if (!selectedProject || !editForm.name) return;
    try {
      setSubmitting(true);
      const payload = {
        ...editForm,
        start_date: editForm.start_date?.toISOString(),
        end_date: editForm.end_date?.toISOString()
      };
      const res = await fetchApi(`/api/projects/${selectedProject.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      if (res.result) {
        setActiveModal(null);
        fetchData();
        window.dispatchEvent(new Event('projectUpdate'));
        Swal.fire({ icon: 'success', title: 'Updated!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else { 
        Swal.fire({ title: 'Error', text: res.msg || 'Failed to update project', icon: 'error', background: '#121212', color: '#fff' }); 
      }
    } catch (error: any) {
      Swal.fire({ title: 'System Error', text: error.message || 'Failed to update project', icon: 'error', background: '#121212', color: '#fff' });
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleDeleteProject = async (id: number) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#333333',
      confirmButtonText: 'Yes, delete it!',
      background: '#121212',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetchApi(`/api/project/${id}`, { method: 'DELETE' });
        if (res.result) {
          fetchData();
          window.dispatchEvent(new Event('projectUpdate'));
          Swal.fire({ icon: 'success', title: 'Deleted!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        } else { 
          Swal.fire({ title: 'Error', text: res.msg || 'Failed to delete project', icon: 'error', background: '#121212', color: '#fff' }); 
        }
      } catch (error: any) {
        Swal.fire({ title: 'System Error', text: error.message || 'Failed to delete project', icon: 'error', background: '#121212', color: '#fff' });
      }
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setEditForm({ 
      name: project.name, 
      description: project.description || '', 
      start_date: project.start_date ? new Date(project.start_date) : undefined,
      end_date: project.end_date ? new Date(project.end_date) : undefined
    });
    setActiveModal('edit');
  };

  const openUpdateStatusModal = (project: Project) => {
    setSelectedProject(project);
    setStatusForm({ status_id: String(project.status.id) });
    setActiveModal('status');
  };

  const handleUpdateStatus = async () => {
    if (!selectedProject || !statusForm.status_id) {
      return Swal.fire({ icon: 'error', title: 'Missing Status', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    }
    try {
      setSubmitting(true);
      const res = await fetchApi(`/api/projectstatus/${selectedProject.id}`, { method: 'PUT', body: JSON.stringify(statusForm) });
      if (res.result) {
        setActiveModal(null);
        fetchData();
        window.dispatchEvent(new Event('projectUpdate'));
        Swal.fire({ icon: 'success', title: 'Status updated!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else { 
        Swal.fire({ title: 'Error', text: res.msg || 'Failed to update status', icon: 'error', background: '#121212', color: '#fff' }); 
      }
    } catch (error: any) {
      Swal.fire({ title: 'System Error', text: error.message || 'Failed to update status', icon: 'error', background: '#121212', color: '#fff' });
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleDirectUpdateStatus = async (projectId: number, newStatusId: string) => {
    try {
      const res = await fetchApi(`/api/projectstatus/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ status_id: newStatusId })
      });
      if (res.result) {
        fetchData();
        window.dispatchEvent(new Event('projectUpdate'));
        Swal.fire({ icon: 'success', title: 'Status synced!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else {
        Swal.fire({ title: 'Sync Error', text: res.msg || 'Update failed', icon: 'error', background: '#121212', color: '#fff' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      return p.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [projects, search]);

  const openCreateModal = (statusId?: string) => {
    if (statusId) {
      setNewProject(prev => ({ ...prev, status_id: statusId }));
    } else if (statuses.length > 0 && !newProject.status_id) {
      setNewProject(prev => ({ ...prev, status_id: String(statuses[0].id) }));
    }
    setActiveModal('create');
  };

  return (
    <div className="space-y-12 w-full px-4 lg:px-8 py-8 animate-in fade-in duration-700">

      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-card border p-6 rounded-lg relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => window.location.href = '/'}>Home</span>
              <ChevronDown className="h-3 w-3 -rotate-90 opacity-40" />
              <span className="text-primary/80">Projects</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight">Active Missions</h1>
            <p className="text-xs text-muted-foreground mt-1">Manage and monitor high-impact initiatives.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto relative z-10">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search missions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {search && (
            <Button variant="ghost" onClick={() => setSearch('')} className="h-10 px-3 text-destructive">
              <XCircle className="h-4 w-4 mr-2" /> Reset
            </Button>
          )}

          <Button onClick={() => openCreateModal()} className="h-10 px-4">
            <Plus className="h-4 w-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-dashed bg-muted/20 py-24">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <FolderOpen className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No projects found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your filters or create a new project to get started.</p>
            </div>
            <Button variant="outline" onClick={() => setSearch('')}>
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectKanbanBoard
          projects={filteredProjects}
          progressData={progressData}
          statuses={statuses}
          onEdit={openEditModal}
          onUpdateStatus={openUpdateStatusModal}
          onStatusChange={handleDirectUpdateStatus}
          onDelete={handleDeleteProject}
          onAddProject={(statusId) => openCreateModal(statusId)}
        />
      )}

      {/* Modals */}
      <Dialog open={activeModal === 'create'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Plus className="h-5 w-5" />
              </div>
              Initialize Mission
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Mission Name</Label>
                <Input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Project name" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Status</Label>
                <Select value={newProject.status_id} onValueChange={(val) => setNewProject({ ...newProject, status_id: val })}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Start Date</Label>
                <DatePicker selected={newProject.start_date} onSelect={(value) => setNewProject({ ...newProject, start_date: value })} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">End Date</Label>
                <DatePicker selected={newProject.end_date} onSelect={(value) => setNewProject({ ...newProject, end_date: value })} className="w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Description</Label>
              <Input value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Strategic objectives..." className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Team Members</Label>
              <Card className="p-2 max-h-48 overflow-y-auto">
                <div className="space-y-1">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer" onClick={() => {
                      const isChecked = newProject.members.includes(user.id);
                      const updated = !isChecked ? [...newProject.members, user.id] : newProject.members.filter(id => id !== user.id);
                      setNewProject({ ...newProject, members: updated });
                    }}>
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={newProject.members.includes(user.id)}
                        onCheckedChange={() => {}} // Controlled by div click for better UX in list
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/upload/${user.avarta}`} className="object-cover" />
                        <AvatarFallback className="text-[10px] font-bold">{user.display_name?.[0] || user.first_name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <Label className="text-xs font-bold leading-none cursor-pointer truncate">{user.display_name || user.dis_name || `${user.first_name} ${user.last_name}`}</Label>
                        <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={submitting} className="min-w-[140px]">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'edit'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Edit2 className="h-5 w-5" />
              </div>
              Modify Mission
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Mission Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Description</Label>
              <Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Start Date</Label>
                <DatePicker selected={editForm.start_date} onSelect={(value) => setEditForm({ ...editForm, start_date: value })} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">End Date</Label>
                <DatePicker selected={editForm.end_date} onSelect={(value) => setEditForm({ ...editForm, end_date: value })} className="w-full" />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={handleEditProject} disabled={submitting} className="min-w-[120px]">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'status'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              Update Status
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Strategic Status</Label>
              <Select value={statusForm.status_id} onValueChange={(val) => setStatusForm({ ...statusForm, status_id: val })}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Transition to..." />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Abort</Button>
            <Button onClick={handleUpdateStatus} disabled={submitting} className="min-w-[120px]">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Confirm Shift'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
