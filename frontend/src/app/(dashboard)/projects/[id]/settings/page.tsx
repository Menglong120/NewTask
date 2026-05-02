'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  Users, Loader2, Tag, Flag, Target,
  Search, Plus, MoreVertical, Trash2, Edit2,
  Mail, Settings, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { Member, ProjectSummary, ItemState, AvailableUser } from '@/types/project';
import { SettingsDialog } from './dialog/dialog';

type TabIcon = React.ComponentType<{ className?: string }>;

const ProjectSettingsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('members');

  // Data States
  const [members, setMembers] = useState<Member[]>([]);
  const [statuses, setStatuses] = useState<ItemState[]>([]);
  const [labels, setLabels] = useState<ItemState[]>([]);
  const [priorities, setPriorities] = useState<ItemState[]>([]);
  const [trackers, setTrackers] = useState<ItemState[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Modal State
  const [activeModal, setActiveModal] = useState<'status' | 'label' | 'priority' | 'tracker' | 'member' | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Available users for member add
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<{ id: number; type: string } | null>(null);
  const [pendingDeleteMemberId, setPendingDeleteMemberId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectRes, memberRes, statusRes, labelRes, priorityRes, trackerRes] = await Promise.all([
        fetchApi(`/api/projects`),
        fetchApi(`/api/projects/members/${id}?search=${searchInput}&page=1&perpage=100`),
        fetchApi(`/api/projects/issue/statuses/${id}`),
        fetchApi(`/api/projects/issue/labels/${id}`),
        fetchApi(`/api/projects/issue/priorities/${id}`),
        fetchApi(`/api/projects/issue/trackers/${id}`)
      ]);

      if (projectRes.result) {
        const project = (projectRes.data.datas as ProjectSummary[]).find((p) => p.id === Number(id));
        if (project) {
          setProjectName(project.name);
        }
      }

      if (memberRes.result) setMembers(memberRes.data.datas || memberRes.data || []);
      if (statusRes.result) setStatuses(statusRes.data.statuses || statusRes.data || []);
      if (labelRes.result) setLabels(labelRes.data.labels || labelRes.data || []);
      if (priorityRes.result) setPriorities(priorityRes.data.priorities || priorityRes.data || []);
      if (trackerRes.result) setTrackers(trackerRes.data.trackers || trackerRes.data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, [id, searchInput]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (activeModal === 'member') {
        try {
          const existingMemberIds = new Set(members.map(m => m.user.id.toString()));
          const usersRes = await fetchApi('/api/users?search=&role=0&page=1&perpage=999');
          if (usersRes.result) {
            const filtered = (usersRes.data.datas || []).filter((user: AvailableUser) =>
              !existingMemberIds.has(String(user.id))
            );
            setAvailableUsers(filtered);
          }
        } catch (error) { console.error(error); }
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
    } catch { } finally { setIsSaving(false); }
  };

  const handleAddMember = async () => {
    if (selectedNewMembers.length === 0) {
      Swal.fire({ icon: 'error', title: 'Please select at least one user', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetchApi(`/api/projects/member/${id}`, {
        method: 'POST',
        body: JSON.stringify({ user_id: JSON.stringify(selectedNewMembers) })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Members added successfully', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        setSelectedNewMembers([]);
        setActiveModal(null);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditItem = async (item: ItemState, type: string) => {
    const { value: newName } = await Swal.fire({
      title: `Rename ${type}`,
      input: 'text',
      inputValue: item.name,
      showCancelButton: true,
      background: '#121212',
      color: '#fff',
      confirmButtonColor: '#696cff',
      inputValidator: (value) => {
        if (!value) return 'You need to write something!'
      }
    });

    if (newName) {
      let endpoint = '';
      if (type === 'status') endpoint = `/api/issue/status/${item.id}`;
      else if (type === 'label') endpoint = `/api/label/${item.id}`;
      else if (type === 'priority') endpoint = `/api/priority/${item.id}`;
      else if (type === 'tracker') endpoint = `/api/issue/tracker/${item.id}`;


      try {
        const res = await fetchApi(endpoint, {
          method: 'PUT',
          body: JSON.stringify({ name: newName })
        });
        if (res.result) {
          Swal.fire({ icon: 'success', title: 'Updated successfully', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
          fetchData();
        }
      } catch { }
    }
  };

  const handleDeleteItem = async (id: number, type: string) => {
    let endpoint = '';
    if (type === 'status') endpoint = `/api/issue/status/${id}`;
    else if (type === 'label') endpoint = `/api/label/${id}`;
    else if (type === 'priority') endpoint = `/api/priority/${id}`;
    else if (type === 'tracker') endpoint = `/api/issue/tracker/${id}`;

    try {
      const res = await fetchApi(endpoint, { method: 'DELETE' });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Deleted successfully', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        fetchData();
      }
    } catch { }
    finally { setPendingDeleteItem(null); }
  };

  const handleDeleteMember = async (memberId: number) => {
    try {
      const res = await fetchApi(`/api/projects/member/${memberId}`, { method: 'DELETE' });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Member removed', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        fetchData();
      }
    } catch { }
    finally { setPendingDeleteMemberId(null); }
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { id: 'status', label: 'Status', icon: Loader2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'labels', label: 'Labels', icon: Tag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'priorities', label: 'Priority', icon: Flag, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'trackers', label: 'Trackers', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const renderGenericList = (items: ItemState[], type: 'status' | 'label' | 'priority' | 'tracker', Icon: TabIcon, colorCls: string, bgCls: string) => {
    const safeItems = Array.isArray(items) ? items : [];
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex justify-between items-center bg-muted/40 border p-4 rounded-xl">
          <h2 className="text-sm font-bold text-foreground capitalize flex items-center gap-2">
            <Icon className={cn("h-4 w-4", colorCls)} />
            {type} Management
          </h2>
          <Button
            size="sm"
            onClick={() => { setModalInput(''); setActiveModal(type); }}
            className="h-8 px-3 text-xs"
          >
            <Plus className="h-3 w-3 mr-2" /> Add {type}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeItems.length === 0 ? (
            <div className="col-span-full border border-dashed rounded-xl py-12 flex flex-col items-center justify-center text-muted-foreground">
              <Icon className="h-8 w-8 opacity-20 mb-3" />
              <p className="text-sm font-medium">No {type}s configured yet.</p>
            </div>
          ) : (
            safeItems.map(item => (
              <Card key={item.id} className="group hover:border-primary/50 transition-all duration-200 shadow-sm">
                <div className="px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", bgCls, colorCls)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditItem(item, type)} className="cursor-pointer">
                        <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPendingDeleteItem({ id: item.id, type })} className="cursor-pointer text-destructive focus:text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto px-4 py-6 animate-in fade-in duration-500">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/40 p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Settings className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => window.location.href = '/projects'}>Projects</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground/60">{projectName || 'Current Project'}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">Settings</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight">Project Configuration</h1>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1 font-mono text-xs">
          ID: {id}
        </Badge>
      </header>

      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Tabs defaultValue="members" onValueChange={setActiveTab} orientation="horizontal" className="w-full space-y-6">
          {/* Horizontal Navigation */}
          <Card className="p-1.5 shadow-sm border bg-card/50 backdrop-blur-sm top-[72px] z-20">
            <TabsList className="bg-transparent flex h-auto w-full gap-1 p-0 border-none shadow-none overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold transition-all border-none shadow-none whitespace-nowrap",
                    "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg shrink-0",
                    activeTab === tab.id ? tab.bg : "bg-muted/50"
                  )}>
                    <tab.icon className={cn("h-3.5 w-3.5", activeTab === tab.id ? tab.color : "text-muted-foreground")} />
                  </div>
                  <span className="text-xs tracking-tight">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Card>

          {/* Content Area */}
          <Card className="shadow-sm border overflow-hidden min-h-[600px] bg-card w-full">
            <CardContent className="p-6">
              <TabsContent value="members" className="mt-0 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                  <div>
                    <h2 className="text-lg font-bold">Project Members</h2>
                    <p className="text-sm text-muted-foreground">Manage user access and permissions</p>
                  </div>
                  <div className="flex w-full sm:w-auto items-center gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search members..."
                        className="pl-9 h-9 text-sm"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => { setActiveModal('member'); setSelectedNewMembers([]); }} className="h-9">
                      <Plus className="h-4 w-4 mr-2" /> Add Member
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Member</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Contact</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Role</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Joined</TableHead>
                        <TableHead className="text-right py-3">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading && members.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                      ) : members.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">No project members found.</TableCell></TableRow>
                      ) : members.map((mem) => (
                        <TableRow key={mem.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border">
                                <AvatarImage src={`/upload/${mem.user.avarta}`} className="object-cover" />
                                <AvatarFallback className="bg-muted text-xs font-bold">
                                  {mem.user.first_name?.[0] || mem.user.dis_name?.[0] || mem.user.display_name?.[0] || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm tracking-tight truncate">
                                  {mem.user.first_name || mem.user.last_name 
                                    ? `${mem.user.first_name || ''} ${mem.user.last_name || ''}`.trim() 
                                    : (mem.user.dis_name || mem.user.display_name || 'Unknown Member')}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium truncate italic">@{mem.user.dis_name || mem.user.display_name || 'user'}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" />
                              <span className="truncate">{mem.user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={mem.user.role.id === 1 ? 'destructive' : mem.user.role.id === 2 ? 'secondary' : 'outline'} className="text-[9px] font-bold uppercase tracking-wide px-2 h-5">
                              {mem.user.role.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[10px] font-medium text-muted-foreground">
                            {new Date(mem.created_on).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPendingDeleteMemberId(mem.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-0">{renderGenericList(statuses, 'status', Loader2, 'text-primary', 'bg-primary/10')}</TabsContent>
              <TabsContent value="labels" className="mt-0">{renderGenericList(labels, 'label', Tag, 'text-emerald-500', 'bg-emerald-500/10')}</TabsContent>
              <TabsContent value="priorities" className="mt-0">{renderGenericList(priorities, 'priority', Flag, 'text-orange-500', 'bg-orange-500/10')}</TabsContent>
              <TabsContent value="trackers" className="mt-0">{renderGenericList(trackers, 'tracker', Target, 'text-purple-500', 'bg-purple-500/10')}</TabsContent>

            </CardContent>
          </Card>

        </Tabs>
      </main>

      <SettingsDialog
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        modalInput={modalInput}
        setModalInput={setModalInput}
        availableUsers={availableUsers}
        selectedNewMembers={selectedNewMembers}
        setSelectedNewMembers={setSelectedNewMembers}
        isSaving={isSaving}
        handleCreateItem={handleCreateItem}
        handleAddMember={handleAddMember}
      />

      <ConfirmActionDialog
        open={pendingDeleteItem !== null}
        onOpenChange={(open) => !open && setPendingDeleteItem(null)}
        title="Delete item?"
        description={pendingDeleteItem ? `This will permanently delete this ${pendingDeleteItem.type}.` : 'This action is permanent.'}
        confirmLabel="Delete item"
        onConfirm={() => {
          if (!pendingDeleteItem) return
          return handleDeleteItem(pendingDeleteItem.id, pendingDeleteItem.type)
        }}
      />
      <ConfirmActionDialog
        open={pendingDeleteMemberId !== null}
        onOpenChange={(open) => !open && setPendingDeleteMemberId(null)}
        title="Remove member?"
        description="They will lose access to this project."
        confirmLabel="Remove member"
        onConfirm={() => {
          if (pendingDeleteMemberId === null) return
          return handleDeleteMember(pendingDeleteMemberId)
        }}
      />
    </div>
  );
};

export default ProjectSettingsPage;
