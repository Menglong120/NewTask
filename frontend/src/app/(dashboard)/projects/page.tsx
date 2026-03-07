'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, XCircle,
  Calendar, Layers, LayoutTemplate, Filter, Users, ChevronDown,
  Clock, CheckCircle2, Loader2, PlayCircle, FolderOpen, ArrowRight, X
} from 'lucide-react';
import Swal from 'sweetalert2';

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
  const [statusFilter, setStatusFilter] = useState('');
  const [progressFilter, setProgressFilter] = useState('');

  // Dropdown states
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Forms
  const [newProject, setNewProject] = useState({ name: '', status_id: '', estimated_date: '', description: '', members: [] as string[] });
  const [editForm, setEditForm] = useState({ name: '', description: '', estimated_date: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, progressRes, statusRes, userRes] = await Promise.all([
        fetchApi('/api/projects'),
        fetchApi('/api/analyst/dashboard/allprogress'),
        fetchApi('/api/category/status'),
        fetchApi('/api/user/all')
      ]);

      if (projectRes.result) setProjects(projectRes.data.datas);
      if (progressRes.result) setProgressData(progressRes.data);
      if (statusRes.result) setStatuses(statusRes.data);
      if (userRes.result) setAllUsers(userRes.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCreateProject = async () => {
    if(!newProject.name || !newProject.status_id || !newProject.estimated_date) {
        return Swal.fire({ icon: 'error', title: 'Missing Fields', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    }
    try {
      setSubmitting(true);
      const res = await fetchApi('/api/project/create', { method: 'POST', body: JSON.stringify(newProject) });
      if (res.result) {
        setIsCreateModalOpen(false);
        setNewProject({ name: '', status_id: '', estimated_date: '', description: '', members: [] });
        fetchData();
        Swal.fire({ icon: 'success', title: 'Project created!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else { Swal.fire({ title: 'Error', text: res.msg || 'Failed to create project', icon: 'error', background: '#121212', color: '#fff' }); }
    } catch (error) {} finally { setSubmitting(false); }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !editForm.name || !editForm.estimated_date) {
        return Swal.fire({ icon: 'error', title: 'Missing Fields', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    }
    try {
      setSubmitting(true);
      const res = await fetchApi(`/api/project/update/${selectedProject.id}`, { method: 'POST', body: JSON.stringify(editForm) });
      if (res.result) {
        setIsEditModalOpen(false);
        fetchData();
        Swal.fire({ icon: 'success', title: 'Project updated!', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } else { Swal.fire({ title: 'Error', text: res.msg || 'Failed to update project', icon: 'error', background: '#121212', color: '#fff' }); }
    } catch (error) {} finally { setSubmitting(false); }
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
      } catch (error) {}
    }
  };

  const openEditModal = (project: Project) => {
    setOpenDropdownId(null);
    setSelectedProject(project);
    setEditForm({ name: project.name, description: project.description || '', estimated_date: project.estimated_date ? new Date(project.estimated_date).toISOString().split('T')[0] : '' });
    setIsEditModalOpen(true);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const progInfo = progressData.find(pd => pd.id === p.id);
      const progress = progInfo?.progress || 0;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === '' || p.status.title === statusFilter;
      const matchesProgress = progressFilter === '' || 
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
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative overflow-hidden">
        {/* Decorative Background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#696cff]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)]">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Company Projects</h1>
            <p className="text-sm text-white/50 font-medium tracking-wide">Manage, track, and collaborate on your initiatives</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full xl:w-auto relative z-10">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input 
              type="text" placeholder="Search projects..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 hover:bg-white/10 border border-transparent focus:bg-[#121212] focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all font-medium text-sm text-white outline-none placeholder:text-white/30 shadow-sm"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.2)] p-1 transition-all">
             <div className="relative border-r border-white/10">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none bg-transparent pl-3 pr-8 py-1.5 outline-none text-sm font-bold text-white/70 hover:text-white focus:text-white cursor-pointer w-full md:w-32 [&>option]:bg-[#121212] [&>option]:text-white">
                  <option value="">All Statuses</option>
                  <option value="To Start">To Start</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Close">Close</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
             </div>
             <div className="relative">
                <select value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)} className="appearance-none bg-transparent pl-3 pr-8 py-1.5 outline-none text-sm font-bold text-white/70 hover:text-white focus:text-white cursor-pointer w-full md:w-36 [&>option]:bg-[#121212] [&>option]:text-white">
                  <option value="">All Progress</option>
                  <option value="0">Not Started (0%)</option>
                  <option value="1-25">Started (1-25%)</option>
                  <option value="26-50">Quarter Done (26-50%)</option>
                  <option value="51-75">Half Done (51-75%)</option>
                  <option value="76-99">Almost Done (76-99%)</option>
                  <option value="100">Completed (100%)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
             </div>
          </div>
          
          {(search || statusFilter || progressFilter) && (
            <button onClick={() => { setSearch(''); setStatusFilter(''); setProgressFilter(''); }} className="px-3 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-1 shrink-0">
               <XCircle className="h-4 w-4" /> Clear
            </button>
          )}

          <button onClick={() => setIsCreateModalOpen(true)} className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-[0_0_15px_rgba(105,108,255,0.4)] text-sm hover:-translate-y-0.5 border border-indigo-400/20">
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24"><Loader2 className="h-10 w-10 animate-spin text-indigo-400" /></div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#121212]/50 backdrop-blur-md rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center py-24 text-center px-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
           <FolderOpen className="h-16 w-16 text-white/20 mb-4" />
           <h3 className="text-xl font-bold text-white mb-2 relative z-10">No projects found</h3>
           <p className="text-white/40 mt-2 max-w-sm relative z-10 font-medium">There are no projects matching your current filters. Adjust your search or create a new project to get started.</p>
           <button onClick={() => setIsCreateModalOpen(true)} className="mt-6 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 font-bold px-6 py-2.5 rounded-xl transition-all relative z-10">Create your first project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => {
            const progInfo = progressData.find(pd => pd.id === project.id);
            const progress = progInfo?.progress || 0;
            const issues = progInfo?.issue.total || '0';
            const estimatedDate = project.estimated_date ? new Date(project.estimated_date) : null;
            const daysRemaining = estimatedDate ? Math.ceil((estimatedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
            
            const badgeClasses = project.status.title === 'Done' || project.status.title === 'Close' 
                ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20 border border-emerald-500/10' 
                : project.status.title === 'In Progress' 
                    ? 'bg-sky-500/10 text-sky-400 ring-sky-500/20 border border-sky-500/10' 
                    : 'bg-amber-500/10 text-amber-400 ring-amber-500/20 border border-amber-500/10';

            return (
              <div key={project.id} className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] border border-white/5 hover:border-indigo-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(105,108,255,0.15)] transition-all duration-300 group flex flex-col relative overflow-hidden hover:-translate-y-1">
                
                {/* Subtle top gradient line for project cards */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-indigo-500/50 transition-colors"></div>

                {/* Card Header */}
                <div className="p-6 pb-4 flex justify-between items-start relative z-10">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 ring-inset ${badgeClasses}`}>
                    {project.status.title === 'Done' || project.status.title === 'Close' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : project.status.title === 'In Progress' ? <PlayCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {project.status.title}
                  </span>
                  
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === project.id ? null : project.id); }} className="p-1.5 text-white/30 hover:text-white/80 bg-white/5 hover:bg-white/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 border border-transparent hover:border-white/10">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openDropdownId === project.id && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl shadow-black/60 z-20 py-1.5 origin-top-right animate-in fade-in zoom-in-95 backdrop-blur-xl">
                           <button onClick={() => openEditModal(project)} className="w-full text-left px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors"><Edit2 className="h-4 w-4" /> Edit</button>
                           <button onClick={() => handleDeleteProject(project.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"><Trash2 className="h-4 w-4" /> Delete</button>
                        </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 flex-1 flex flex-col relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-1 truncate" title={project.name}>{project.name}</h3>
                  <p className="text-sm text-white/40 font-medium line-clamp-2 mb-6 h-10 leading-relaxed">
                    {project.description || 'No description provided for this project. Update it in settings.'}
                  </p>
                  
                  {/* Members & Progress Info Row */}
                  <div className="flex items-end justify-between mb-3 mt-auto">
                    <div className="flex -space-x-2 overflow-hidden items-center group/av">
                       {project.members.slice(0, 4).map((m, i) => (
                          <img key={i} src={`/upload/${m.user?.avarta}`} className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121212] object-cover bg-white/10 transition-transform group-hover/av:scale-105" title={m.user?.display_name || m.user?.dis_name} onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                       ))}
                       {project.members.length > 4 && (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-[#121212] bg-[#1a1a1a] border border-white/10 text-xs font-bold text-white/70 transition-transform group-hover/av:scale-105">
                             +{project.members.length - 4}
                          </div>
                       )}
                       {project.members.length === 0 && (
                          <div className="inline-flex h-8 items-center justify-center px-3 rounded-full bg-white/5 text-xs font-bold text-white/30 border border-white/10 border-dashed">No members</div>
                       )}
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">{Math.round(progress)}<span className="text-sm text-white/30 ml-0.5">%</span></span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-full h-1.5 mb-2 overflow-hidden relative">
                     <div className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-1000 ${progress < 30 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : progress < 70 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : progress < 100 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} style={{ width: `${progress}%` }}>
                       <div className="absolute inset-0 bg-white/20" style={{ animation: 'shimmer 2s infinite linear' }}></div>
                     </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-1.5 text-xs font-bold text-white/50 bg-[#0a0a0a] px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
                      <Layers className="h-3.5 w-3.5 text-indigo-400" /> {issues} Issues
                   </div>
                   <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border shadow-inner ${daysRemaining < 0 ? 'text-red-400 bg-red-500/10 border-red-500/20' : daysRemaining === 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-white/50 bg-[#0a0a0a] border-white/5'}`}>
                      <Calendar className="h-3.5 w-3.5 opacity-70" /> 
                      {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : daysRemaining === 0 ? 'Due today' : `${daysRemaining}d left`}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col my-auto relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32"></div>
            
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3"><Plus className="h-5 w-5 text-indigo-400 p-1 bg-indigo-500/20 rounded-md ring-1 ring-indigo-500/30" /> Start New Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-white/30 hover:text-white/80 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="p-8 space-y-6 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Project Name <span className="text-red-500">*</span></label>
                       <input type="text" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner placeholder:text-white/20" placeholder="e.g. Website Redesign" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} />
                   </div>
                   
                   <div className="space-y-2 relative">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Initial Status <span className="text-red-500">*</span></label>
                       <select className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none appearance-none shadow-inner [&>option]:bg-[#121212]" value={newProject.status_id} onChange={(e) => setNewProject({...newProject, status_id: e.target.value})}>
                          <option value="">Select Status...</option>
                          {statuses.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                       </select>
                       <ChevronDown className="absolute right-4 top-[38px] h-4 w-4 text-white/30 pointer-events-none" />
                   </div>
                   
                   <div className="space-y-2">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Target Date <span className="text-red-500">*</span></label>
                       <input type="date" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner [color-scheme:dark]" value={newProject.estimated_date} onChange={(e) => setNewProject({...newProject, estimated_date: e.target.value})} />
                   </div>
                   
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Description</label>
                       <textarea rows={3} className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-white outline-none resize-none shadow-inner placeholder:text-white/20" placeholder="What are the goals of this project?" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
                   </div>
                   
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Add Team Members</label>
                       <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#0a0a0a] border border-white/10 rounded-xl p-3 max-h-[180px] overflow-y-auto gap-2 shadow-inner custom-scrollbar">
                           {allUsers.map(user => (
                               <label key={user.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer transition-all">
                                   <input type="checkbox" className="w-4 h-4 rounded text-indigo-500 bg-[#121212] border-white/20 focus:ring-indigo-500/30 focus:ring-offset-0" checked={newProject.members.includes(user.id)} onChange={(e) => { const members = e.target.checked ? [...newProject.members, user.id] : newProject.members.filter(id => id !== user.id); setNewProject({...newProject, members}); }} />
                                   <div className="flex items-center gap-2.5">
                                       <img src={`/upload/${user.avarta}`} className="w-7 h-7 rounded-full object-cover bg-white/10 border border-white/10" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                                       <span className="text-sm font-bold text-white/70">{user.display_name || user.dis_name || user.first_name}</span>
                                   </div>
                               </label>
                           ))}
                       </div>
                   </div>
               </div>
            </div>
            
            <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3 mt-auto relative z-10">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-white/20">Cancel</button>
                <button onClick={handleCreateProject} disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_0_15px_rgba(105,108,255,0.4)] transition-all disabled:opacity-50 flex items-center gap-2 border border-indigo-400/20 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#121212]">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create Project
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32"></div>

            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3"><Edit2 className="h-5 w-5 text-indigo-400 p-1 bg-indigo-500/20 rounded-md ring-1 ring-indigo-500/30" /> Edit Project details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-white/30 hover:text-white/80 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="p-8 space-y-6 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Project Name <span className="text-red-500">*</span></label>
                       <input type="text" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                   </div>
                   
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Target Date <span className="text-red-500">*</span></label>
                       <input type="date" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner [color-scheme:dark]" value={editForm.estimated_date} onChange={(e) => setEditForm({...editForm, estimated_date: e.target.value})} />
                   </div>
                   
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1">Description</label>
                       <textarea rows={4} className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-white outline-none resize-none shadow-inner" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
                   </div>
               </div>
            </div>
            
            <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3 mt-auto relative z-10">
                <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-white/20">Cancel</button>
                <button onClick={handleUpdateProject} disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_0_15px_rgba(105,108,255,0.4)] transition-all disabled:opacity-50 flex items-center gap-2 border border-indigo-400/20 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#121212]">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-4 w-4" />} Save Changes
                </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Global Styles for Scrollbar & Animations passed inline for scoped components */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #555; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
};

export default ProjectsPage;
