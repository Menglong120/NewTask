'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  Users, Loader2, Tag, Flag, Target, LayoutGrid,
  Search, Plus, MoreVertical, Trash2, Edit2, Shield,
  Mail, Calendar, X, Settings, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Member {
  id: number;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    dis_name: string;
    email: string;
    avarta: string;
    role: { name: string; id: number };
  };
  created_on: string;
}

interface ItemState {
  id: number;
  name: string;
  description?: string;
}

const ProjectSettingsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('members');

  // Data States
  const [members, setMembers] = useState<Member[]>([]);
  const [statuses, setStatuses] = useState<ItemState[]>([]);
  const [labels, setLabels] = useState<ItemState[]>([]);
  const [priorities, setPriorities] = useState<ItemState[]>([]);
  const [trackers, setTrackers] = useState<ItemState[]>([]);
  const [categories, setCategories] = useState<ItemState[]>([]);
  const [projectName, setProjectName] = useState('');

  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Modal State
  const [activeModal, setActiveModal] = useState<'status' | 'label' | 'priority' | 'tracker' | 'category' | 'member' | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Available users for member add
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedNewMember, setSelectedNewMember] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, memberRes, statusRes, labelRes, priorityRes, trackerRes, categoryRes] = await Promise.all([
        fetchApi(`/api/projects`),
        fetchApi(`/api/projects/members/${id}?search=${searchInput}&page=1&perpage=100`),
        fetchApi(`/api/projects/issue/statuses/${id}`),
        fetchApi(`/api/projects/issue/labels/${id}`),
        fetchApi(`/api/projects/issue/priorities/${id}`),
        fetchApi(`/api/projects/issue/trackers/${id}`),
        fetchApi(`/api/categories/${id}`)
      ]);

      if (projectRes.result) {
        const project = projectRes.data.datas.find((p: any) => p.id === Number(id));
        if (project) setProjectName(project.name);
      }

      if (memberRes.result) setMembers(memberRes.data.datas || memberRes.data || []);
      if (statusRes.result) setStatuses(statusRes.data.statuses || statusRes.data || []);
      if (labelRes.result) setLabels(labelRes.data.labels || labelRes.data || []);
      if (priorityRes.result) setPriorities(priorityRes.data.priorities || priorityRes.data || []);
      if (trackerRes.result) setTrackers(trackerRes.data.trackers || trackerRes.data || []);
      if (categoryRes.result) setCategories(categoryRes.data.categories || categoryRes.data || []);

    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id, searchInput]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (activeModal === 'member') {
        try {
          const res = await fetchApi('/api/users');
          if (res.result) {
            // Filter out users who are already members
            const existingMemberIds = new Set(members.map(m => m.user.id.toString()));
            const filtered = (res.data.datas || res.data).filter((u: any) => !existingMemberIds.has(u.id.toString()) && u.id !== 1);
            setAvailableUsers(filtered);
          }
        } catch (err) { console.error(err); }
      }
    };
    fetchUsers();
  }, [activeModal, members]);

  const handleCreateItem = async () => {
    if (!modalInput.trim()) {
      Swal.fire({ icon: 'error', title: 'Value cannot be empty', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }

    let endpoint = '';
    let categoryPrefix = '/api/projects/issue/';

    if (activeModal === 'status') endpoint = 'status';
    else if (activeModal === 'label') endpoint = 'label';
    else if (activeModal === 'priority') endpoint = 'priority';
    else if (activeModal === 'tracker') endpoint = 'tracker';
    else if (activeModal === 'category') {
      endpoint = 'category';
      categoryPrefix = '/api/';
    }

    try {
      setIsSaving(true);
      const res = await fetchApi(`${categoryPrefix}${endpoint}/${id}`, {
        method: 'POST',
        body: JSON.stringify({ name: modalInput, project_id: id })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Created successfully', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        setModalInput('');
        setActiveModal(null);
        fetchData();
      }
    } catch (err) { } finally { setIsSaving(false); }
  };

  const handleAddMember = async () => {
    if (!selectedNewMember) {
      Swal.fire({ icon: 'error', title: 'Please select a user', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetchApi(`/api/projects/member/${id}`, {
        method: 'POST',
        body: JSON.stringify({ user_id: JSON.stringify([selectedNewMember]) })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Member added successfully', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        setSelectedNewMember('');
        setActiveModal(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { id: 'status', label: 'Status', icon: Loader2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'labels', label: 'Labels', icon: Tag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'priorities', label: 'Priority', icon: Flag, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'trackers', label: 'Trackers', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  const renderGenericList = (items: ItemState[], type: 'status' | 'label' | 'priority' | 'tracker' | 'category', Icon: any, colorCls: string, bgCls: string) => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-xl">
        <h2 className="text-lg font-bold text-foreground capitalize flex items-center gap-2">
          <Icon className={cn("h-5 w-5", colorCls)} />
          {type} Configuration
        </h2>
        <Button
          size="sm"
          onClick={() => { setModalInput(''); setActiveModal(type); }}
          className="bg-primary hover:bg-primary/90 text-white font-bold h-9"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add {type}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full border border-dashed border-white/10 bg-white/[0.01] rounded-[2rem] py-20 flex flex-col items-center justify-center text-muted-foreground/50 font-semibold">
            <div className="p-4 bg-white/5 rounded-2xl mb-4">
              <Icon className="h-10 w-10 opacity-20" />
            </div>
            No {type}s configured.
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="group relative">
              <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-transparent rounded-[1.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <Card className="relative border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-all rounded-[1.5rem] overflow-hidden group/card shadow-lg">
                <div className="p-5 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl ring-1 ring-white/5 shadow-inner transition-transform duration-500 group-hover/card:scale-110", bgCls, colorCls)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm text-foreground/80 tracking-tight">{item.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 opacity-0 group-hover/card:opacity-100 transition-all rounded-lg hover:bg-white/10">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 dark w-36 p-1.5 rounded-xl backdrop-blur-2xl">
                      <DropdownMenuItem className="gap-2 cursor-pointer font-bold text-[10px] py-2.5 rounded-lg uppercase tracking-wider">
                        <Edit2 className="h-3.5 w-3.5 opacity-50" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer font-bold text-[10px] py-2.5 rounded-lg text-red-400/80 focus:text-red-400 focus:bg-red-500/10 uppercase tracking-wider">
                        <Trash2 className="h-3.5 w-3.5 opacity-50" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent space-y-12 max-w-[1700px] mx-auto py-10 animate-in fade-in duration-700">

      {/* Glass Header */}
      <header className="relative z-50 group px-4 lg:px-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <Card className="border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden relative rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <CardHeader className="p-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-8 w-full md:w-auto overflow-hidden">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-2xl ring-1 ring-white/10 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
                  <Settings className="h-8 w-8 drop-shadow-lg" />
                </div>
              </div>
              <div className="space-y-1.5 min-w-0 flex-1">
                <nav className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em] mb-1 truncate">
                  <span className="hover:text-primary cursor-pointer transition-colors shrink-0" onClick={() => window.location.href = '/projects'}>Projects Hub</span>
                  <ChevronRight className="h-3 w-3 opacity-20 shrink-0" />
                  <span className="text-foreground/40 truncate">{projectName || 'Current Project'}</span>
                  <ChevronRight className="h-3 w-3 opacity-20 shrink-0" />
                  <span className="text-primary/80 font-black shrink-0">Settings</span>
                </nav>
                <CardTitle className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 truncate">
                  Workflow Settings
                </CardTitle>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white/5 border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 backdrop-blur-sm rounded-full ring-1 ring-white/5 shadow-inner">
                ID: {id}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </header>

      <main className="relative z-10 px-4 lg:px-0">
        <Tabs defaultValue="members" orientation="vertical" className="w-full flex-col" onValueChange={setActiveTab}>
          <div className="flex flex-col lg:flex-row gap-12 items-start w-full">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-80 shrink-0 space-y-10 sticky top-12 z-40">

              {/* Navigation Card */}
              <div className="p-2 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <TabsList className="bg-transparent flex flex-col !h-auto w-full space-y-1.5 items-stretch p-0 relative z-10">
                  {tabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={cn(
                          "group relative w-full !h-auto flex items-center justify-start gap-4 px-5 py-3.5 rounded-[1.25rem] font-bold transition-all duration-300",
                          "text-muted-foreground/60 hover:text-white hover:bg-white/[0.03] border border-transparent",
                          "focus-visible:ring-0 focus-visible:ring-offset-0 outline-none",
                          isActive && "bg-white/[0.08] text-white border-white/5 shadow-[0_8px_20px_rgba(0,0,0,0.2)] ring-1 ring-white/5"
                        )}
                      >
                        {/* Icon Container */}
                        <div className={cn(
                          "p-2 rounded-xl transition-all duration-500 ring-1 ring-white/5 shadow-lg shrink-0",
                          isActive ? cn(tab.bg, tab.color, "scale-105 shadow-current/20 font-black") : "bg-white/5 group-hover:bg-white/10"
                        )}>
                          <tab.icon className="h-4 w-4 transition-all duration-500 group-hover:rotate-6 shrink-0" />
                        </div>

                        {/* Label */}
                        <span className="text-sm tracking-tight">{tab.label}</span>

                        {/* Active Indicator Glimmer */}
                        {isActive && (
                          <div className={cn("absolute right-4 h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", tab.color.replace('text-', 'bg-'))} />
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Enhanced Helper Card */}
              <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-black/10 to-transparent border border-white/10 backdrop-blur-3xl hidden lg:block relative overflow-hidden group/tip shadow-xl">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="relative z-10 space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Insights
                  </h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground/60 font-medium group-hover:text-foreground/80 transition-colors duration-500">
                    Fine-tune your project's workflow to maximize team velocity and tracking precision.
                  </p>
                </div>
              </div>
            </aside>

            <Card className="flex-1 border-white/10 bg-black/20 backdrop-blur-xl min-h-[700px] relative overflow-hidden rounded-[2.5rem] shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <CardContent className="p-8 relative z-10">
                <TabsContent value="members" className="mt-0 space-y-8 animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-foreground">Project Members</h2>
                      <p className="text-xs text-muted-foreground font-medium">Manage user access and roles within this project</p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-3">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search members..."
                          className="pl-9 h-10 bg-background border-white/10 text-foreground"
                          value={searchInput}
                          onChange={e => setSearchInput(e.target.value)}
                        />
                      </div>
                      <Button onClick={() => setActiveModal('member')} className="shrink-0 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4 mr-1.5" /> Add Member
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined At</TableHead>
                          <TableHead className="text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading && members.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                        ) : members.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold">No team members found.</TableCell></TableRow>
                        ) : members.map((mem) => (
                          <TableRow key={mem.id} className="border-white/[0.03] hover:bg-white/[0.03] group/row transition-all duration-300">
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-4 py-2">
                                <div className="relative">
                                  <Avatar className="h-12 w-12 ring-2 ring-white/10 ring-offset-4 ring-offset-black/50 transition-transform duration-300 group-hover/row:scale-105">
                                    <AvatarImage src={`/upload/${mem.user.avarta}`} className="object-cover" />
                                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-black transition-colors group-hover/row:bg-primary/30">
                                      {mem.user.first_name?.[0]}{mem.user.last_name?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-background rounded-full"></div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-black text-foreground text-sm tracking-tight">{mem.user.first_name} {mem.user.last_name}</span>
                                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">@{mem.user.dis_name || (mem.user as any).display_name}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground group-hover/row:text-foreground/80 transition-colors">
                                <div className="p-1.5 bg-white/5 rounded-lg"><Mail className="h-3.5 w-3.5" /></div>
                                {mem.user.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                "px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 group-hover/row:scale-105",
                                mem.user.role.id === 1 ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                                  mem.user.role.id === 2 ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' :
                                    'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                              )}>
                                {mem.user.role.name}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[11px] font-black text-muted-foreground uppercase opacity-60">
                              {new Date(mem.created_on).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover/row:opacity-100 transition-all rounded-xl">
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="status" className="mt-0">{renderGenericList(statuses, 'status', Loader2, 'text-indigo-400', 'bg-indigo-500/10')}</TabsContent>
                <TabsContent value="labels" className="mt-0">{renderGenericList(labels, 'label', Tag, 'text-emerald-400', 'bg-emerald-500/10')}</TabsContent>
                <TabsContent value="priorities" className="mt-0">{renderGenericList(priorities, 'priority', Flag, 'text-amber-400', 'bg-amber-500/10')}</TabsContent>
                <TabsContent value="trackers" className="mt-0">{renderGenericList(trackers, 'tracker', Target, 'text-purple-400', 'bg-purple-500/10')}</TabsContent>
                <TabsContent value="categories" className="mt-0">{renderGenericList(categories, 'category', LayoutGrid, 'text-rose-400', 'bg-rose-500/10')}</TabsContent>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </main>

      {/* Generic Modal Configuration Dialog */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-sm">
          <DialogHeader className="pt-2">
            <DialogTitle className="flex items-center gap-2 text-xl capitalize">
              {activeModal === 'member' ? (
                <><Users className="h-5 w-5 text-primary" /> Project Member</>
              ) : (
                <><Plus className="h-5 w-5 text-primary" /> New {activeModal}</>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {activeModal === 'member' ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-medium">Add a user to join this project's workspace.</p>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select User</Label>
                  <select
                    className="w-full px-3 py-2.5 bg-background border border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none text-foreground text-sm font-bold appearance-none transition-all"
                    value={selectedNewMember} onChange={e => setSelectedNewMember(e.target.value)}
                  >
                    <option value="">Choose a user...</option>
                    {availableUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.role?.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground capitalize">{activeModal} Name</Label>
                <Input
                  className="h-11 bg-background border-white/10 text-foreground font-bold"
                  placeholder={`Enter ${activeModal} title...`}
                  value={modalInput}
                  onChange={e => setModalInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateItem()}
                  autoFocus
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)} className="text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
            <Button
              onClick={activeModal === 'member' ? handleAddMember : handleCreateItem}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {activeModal === 'member' ? 'Add Member' : 'Create Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectSettingsPage;
