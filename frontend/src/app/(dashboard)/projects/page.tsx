'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Plus, Search, MoreVertical, Edit2, Trash2, XCircle,
  Calendar, Layers, LayoutTemplate, Filter, Users, ChevronDown,
  Clock, CheckCircle2, Loader2, PlayCircle, FolderOpen, ArrowRight, X, Target
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface Project {
  id: number;
  name: string;
  description: string;
  estimated_date: string;
  status: { id: number; title: string; };
  members: Array<{ user: { id: string; display_name?: string; dis_name?: string; avarta: string; }; }>;
}

interface ProjectProgress { id: number; progress: number; issue: { total: string }; }

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [progressData, setProgressData] = useState<ProjectProgress[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [progressFilter, setProgressFilter] = useState('ALL');

  // Modals
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Forms
  const [newProject, setNewProject] = useState({ name: '', status_id: '', estimated_date: '', description: '', members: [] as string[] });
  const [editForm, setEditForm] = useState({ name: '', description: '', estimated_date: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, progressRes, statusRes, userRes] = await Promise.allSettled([
        fetchApi('/api/projects'),
        fetchApi('/api/analyst/dashboard/allprogress'),
        fetchApi('/api/projects/status'),
        fetchApi('/api/users')
      ]);

      if (projectRes.status === 'fulfilled' && projectRes.value.result) {
        setProjects(projectRes.value.data.datas || projectRes.value.data);
      }
      if (progressRes.status === 'fulfilled' && progressRes.value.result) {
        setProgressData(progressRes.value.data);
      }
      if (statusRes.status === 'fulfilled' && statusRes.value.result) {
        // Handle both paginated and non-paginated status data
        setStatuses(statusRes.value.data.datas || statusRes.value.data);
      }
      if (userRes.status === 'fulfilled' && userRes.value.result) {
        // Handle both paginated and non-paginated user data
        setAllUsers(userRes.value.data.datas || userRes.value.data);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.status_id || !newProject.estimated_date) {
      return Swal.fire({ icon: 'error', title: 'Missing Fields', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    }
    try {
      setSubmitting(true);
      const res = await fetchApi('/api/project/create', { method: 'POST', body: JSON.stringify(newProject) });
      if (res.result) {
        setActiveModal(null);
        setNewProject({ name: '', status_id: '', estimated_date: '', description: '', members: [] });
        fetchData();
        Swal.fire({ icon: 'success', title: 'Project created!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else { Swal.fire({ title: 'Error', text: res.msg || 'Failed to create project', icon: 'error', background: '#121212', color: '#fff' }); }
    } catch (error) { } finally { setSubmitting(false); }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !editForm.name || !editForm.estimated_date) {
      return Swal.fire({ icon: 'error', title: 'Missing Fields', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    }
    try {
      setSubmitting(true);
      const res = await fetchApi(`/api/project/update/${selectedProject.id}`, { method: 'POST', body: JSON.stringify(editForm) });
      if (res.result) {
        setActiveModal(null);
        fetchData();
        Swal.fire({ icon: 'success', title: 'Project updated!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else { Swal.fire({ title: 'Error', text: res.msg || 'Failed to update project', icon: 'error', background: '#121212', color: '#fff' }); }
    } catch (error) { } finally { setSubmitting(false); }
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
        const res = await fetchApi(`/api/project/delete/${id}`, { method: 'DELETE' });
        if (res.result) {
          fetchData();
          Swal.fire({ icon: 'success', title: 'Deleted!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        } else { Swal.fire({ title: 'Error', text: res.msg || 'Failed to delete project', icon: 'error', background: '#121212', color: '#fff' }); }
      } catch (error) { }
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setEditForm({ name: project.name, description: project.description || '', estimated_date: project.estimated_date ? new Date(project.estimated_date).toISOString().split('T')[0] : '' });
    setActiveModal('edit');
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const progInfo = progressData.find(pd => pd.id === p.id);
      const progress = progInfo?.progress || 0;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status.title === statusFilter;
      const matchesProgress = progressFilter === 'ALL' ||
        (progressFilter === '0' && progress === 0) ||
        (progressFilter === '1-25' && progress > 0 && progress <= 25) ||
        (progressFilter === '26-50' && progress > 25 && progress <= 50) ||
        (progressFilter === '51-75' && progress > 50 && progress <= 75) ||
        (progressFilter === '76-99' && progress > 75 && progress < 100) ||
        (progressFilter === '100' && progress === 100);
      return matchesSearch && matchesStatus && matchesProgress;
    });
  }, [projects, progressData, search, statusFilter, progressFilter]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card border border-white/5 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects Hub</h1>
            <p className="text-sm text-muted-foreground">Manage and track your company initiatives</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto relative z-10">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-background border-white/10 text-foreground"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-background border-white/10 text-foreground h-10">
              <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 dark">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="To Start">To Start</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={progressFilter} onValueChange={setProgressFilter}>
            <SelectTrigger className="w-[160px] bg-background border-white/10 text-foreground h-10">
              <Target className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              <SelectValue placeholder="Progress" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 dark">
              <SelectItem value="ALL">All Progress</SelectItem>
              <SelectItem value="0">Not Started (0%)</SelectItem>
              <SelectItem value="1-25">Started (1-25%)</SelectItem>
              <SelectItem value="26-50">Quarter (26-50%)</SelectItem>
              <SelectItem value="51-75">Half (51-75%)</SelectItem>
              <SelectItem value="76-99">Almost (76-99%)</SelectItem>
              <SelectItem value="100">Done (100%)</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== 'ALL' || progressFilter !== 'ALL') && (
            <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter('ALL'); setProgressFilter('ALL'); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10 px-3">
              <XCircle className="h-4 w-4 mr-1.5" /> Reset
            </Button>
          )}

          <Button onClick={() => setActiveModal('create')} className="bg-primary hover:bg-primary/90 text-white h-10 px-5 shadow-lg shadow-primary/20 font-bold">
            <Plus className="h-4 w-4 mr-1.5" /> New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading your projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-dashed border-white/10 bg-transparent py-24">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              <FolderOpen className="h-12 w-12 text-muted-foreground opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">No projects found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your filters or create a new project to get started.</p>
            </div>
            <Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('ALL'); setProgressFilter('ALL'); }} className="border-white/10 hover:bg-white/5">
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => {
            const progInfo = progressData.find(pd => pd.id === project.id);
            const progress = progInfo?.progress || 0;
            const issues = progInfo?.issue.total || '0';
            const estimatedDate = project.estimated_date ? new Date(project.estimated_date) : null;
            const daysRemaining = estimatedDate ? Math.ceil((estimatedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

            const badgeVariant = project.status.title === 'Done' ? 'success' : project.status.title === 'In Progress' ? 'info' : 'warning';
            // Custom badge logic using Tailwind classes if variant doesn't fit
            const badgeClasses = project.status.title === 'Done'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : project.status.title === 'In Progress'
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

            return (
              <Card key={project.id} className="group border-white/5 bg-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all" />

                <CardHeader className="p-6 pb-2 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge className={cn('px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border', badgeClasses)}>
                      {project.status.title}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 dark w-40">
                        <DropdownMenuItem onClick={() => openEditModal(project)} className="gap-2 cursor-pointer font-semibold">
                          <Edit2 className="h-3.5 w-3.5" /> Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="gap-2 cursor-pointer font-semibold text-red-400 focus:text-red-400 focus:bg-red-500/10">
                          <Trash2 className="h-3.5 w-3.5" /> Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" title={project.name} onClick={() => window.location.href = `/projects/${project.id}`}>
                    {project.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0 flex-1 space-y-6">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] leading-relaxed">
                    {project.description || 'Elevate your enterprise with this innovative project initiative.'}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 4).map((m, i) => (
                          <Avatar key={i} className="h-8 w-8 ring-2 ring-card group-hover:ring-primary/20 transition-all">
                            <AvatarImage src={`/upload/${m.user?.avarta}`} />
                            <AvatarFallback className="text-[10px] bg-indigo-600/20 text-indigo-300">
                              {m.user?.display_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 4 && (
                          <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground ring-2 ring-card">
                            +{project.members.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-2xl font-black text-foreground">{Math.round(progress)}<span className="text-sm text-muted-foreground ml-0.5">%</span></span>
                    </div>
                    <Progress value={progress} className="h-1.5 bg-white/5 [&>div]:bg-primary" />
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-auto bg-white/[0.01]">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                    <Layers className="h-3.5 w-3.5 text-primary opacity-70" /> {issues} Issues
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 text-[11px] font-bold",
                    daysRemaining < 0 ? "text-red-400" : daysRemaining <= 3 ? "text-amber-400" : "text-muted-foreground"
                  )}>
                    <Calendar className="h-3.5 w-3.5 opacity-50" />
                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : daysRemaining === 0 ? 'Due Today' : `${daysRemaining}d left`}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* --- DIALOGS --- */}

      {/* Create Project Dialog */}
      <Dialog open={activeModal === 'create'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5 text-primary" /> Start New Project
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Name</Label>
              <Input
                placeholder="e.g. Website Overhaul"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="h-11 bg-background border-white/10 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inital Status</Label>
              <Select value={newProject.status_id} onValueChange={(v) => setNewProject({ ...newProject, status_id: v })}>
                <SelectTrigger className="bg-background border-white/10 text-foreground h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 dark">
                  {statuses.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Date</Label>
              <Input
                type="date"
                value={newProject.estimated_date}
                onChange={(e) => setNewProject({ ...newProject, estimated_date: e.target.value })}
                className="h-11 bg-background border-white/10 text-foreground [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
              <textarea
                rows={3}
                placeholder="Briefly describe the project goals..."
                className="w-full px-3 py-3 bg-background border border-white/10 rounded-md focus:ring-1 focus:ring-primary outline-none text-foreground text-sm font-medium transition-all"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Team Members</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-3 bg-background border border-white/10 rounded-xl custom-scrollbar">
                {allUsers.map(user => (
                  <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group" onClick={() => {
                    const members = newProject.members.includes(user.id)
                      ? newProject.members.filter(id => id !== user.id)
                      : [...newProject.members, user.id];
                    setNewProject({ ...newProject, members });
                  }}>
                    <div className={cn(
                      "w-4 h-4 rounded border border-white/20 flex items-center justify-center transition-all",
                      newProject.members.includes(user.id) ? "bg-primary border-primary" : "bg-transparent"
                    )}>
                      {newProject.members.includes(user.id) && <X className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-[11px] font-bold text-white/70 group-hover:text-white truncate">
                      {user.display_name || user.first_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)} className="text-muted-foreground hover:text-foreground">Cancel</Button>
            <Button onClick={handleCreateProject} disabled={submitting} className="bg-primary hover:bg-primary/90 text-white font-bold px-6">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={activeModal === 'edit'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit2 className="h-5 w-5 text-primary" /> Edit Project
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="h-11 bg-background border-white/10 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Date</Label>
              <Input
                type="date"
                value={editForm.estimated_date}
                onChange={(e) => setEditForm({ ...editForm, estimated_date: e.target.value })}
                className="h-11 bg-background border-white/10 text-foreground [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
              <textarea
                rows={4}
                className="w-full px-3 py-3 bg-background border border-white/10 rounded-md focus:ring-1 focus:ring-primary outline-none text-foreground text-sm font-medium transition-all"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)} className="text-muted-foreground hover:text-foreground">Cancel</Button>
            <Button onClick={handleUpdateProject} disabled={submitting} className="bg-primary hover:bg-primary/90 text-white font-bold px-6">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
