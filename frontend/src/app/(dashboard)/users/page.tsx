'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  Search, UserPlus, Eye, KeyRound, Edit2, Trash2, Filter,
  ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert, Mail,
  User, Shield, Briefcase, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  description: string;
  avarta: string;
  created_on: string;
  role: { id: number; name: string; };
}
interface ProjectData { id: number; name: string; members: { user: { id: string } }[]; }
interface Paginate { page: number; perpage: number; total: number; pages: number; }

const UsersPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [paginate, setPaginate] = useState<Paginate | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<number>(3);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', role: '0', rowsPerPage: 5 });

  const [activeModal, setActiveModal] = useState<'view' | 'edit' | 'password' | 'create' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editRoleId, setEditRoleId] = useState<number>(0);
  const [changePw, setChangePw] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [createForm, setCreateForm] = useState({
    firstname: '', lastname: '', username: '', email: '', password: '', roleId: 3
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchApi('/api/profile');
        if (res.result && res.data.length > 0) setCurrentUserRole(res.data[0].role.id);
      } catch { }
    };
    const getProjects = async () => {
      try {
        const res = await fetchApi('/api/projects?search=&page=&perpage=');
        if (res.result) setProjects(res.data.datas);
      } catch { }
    };
    const getRoles = async () => {
      try {
        const res = await fetchApi('/api/roles');
        if (res.result) setRoles(res.data);
      } catch { }
    };
    getProfile(); getProjects(); getRoles();
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchApi(`/api/users?search=${filters.search}&role=${filters.role}&page=${page}&perpage=${filters.rowsPerPage}`);
      if (res.result) { setUsers(res.data.datas); setPaginate(res.data.paginate); }
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(1); }, [filters.role, filters.rowsPerPage, filters.search]);

  const handleSearch = () => setFilters(prev => ({ ...prev, search: searchInput }));

  const getUserProjects = (userId: string) => {
    const names = projects.filter(p => p.members?.some(m => m.user?.id === userId)).map(p => p.name);
    if (!names.length) return 'No Project';
    if (names.length > 2) return names.slice(0, 2).join(', ') + '...';
    return names.join(', ');
  };

  const handleDeleteUser = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Are you sure?', text: 'You want to delete this user!', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#EF4444', cancelButtonColor: '#333',
      confirmButtonText: 'Yes, delete it!', background: '#121212', color: '#fff'
    });
    if (result.isConfirmed) {
      try {
        await fetchApi(`/api/user/${id}`, { method: 'DELETE' });
        fetchUsers(paginate?.page ?? 1);
        Swal.fire({ title: 'Deleted!', text: 'User removed', icon: 'success', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } catch { }
    }
  };

  const handleEditSave = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetchApi(`/api/user/${selectedUser.id}`, { method: 'PUT', body: JSON.stringify({ new_role_id: editRoleId }) });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Role updated', position: 'top-end', toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        fetchUsers(paginate?.page ?? 1); setActiveModal(null);
      }
    } catch { }
  };

  const handlePasswordSave = async () => {
    if (!selectedUser) return;
    if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/.test(changePw)) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Min 6 chars, 1 uppercase, 1 number.', position: 'top-end', toast: true, timer: 4000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }
    try {
      const res = await fetchApi(`/api/user/pass/${selectedUser.id}`, { method: 'PUT', body: JSON.stringify({ password: changePw }) });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Password changed', position: 'top-end', toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        fetchUsers(paginate?.page ?? 1); setActiveModal(null); setChangePw('');
      }
    } catch { }
  };

  const handleCreateAccount = async () => {
    Swal.fire({ icon: 'info', title: 'Create account', text: 'Hook up to POST /api/user.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    setActiveModal(null);
  };

  const roleBadge = (roleId: number) => {
    if (roleId === 1) return 'bg-red-500/15 text-red-400 border-red-500/20';
    if (roleId === 2) return 'bg-purple-500/15 text-purple-400 border-purple-500/20';
    return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">

      {/* Header controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card border border-white/5 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/15 text-blue-400 rounded-xl">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">User Directory</h1>
            <p className="text-sm text-muted-foreground">Manage system access and roles</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Select value={String(filters.rowsPerPage)} onValueChange={(v) => setFilters(f => ({ ...f, rowsPerPage: Number(v) }))}>
            <SelectTrigger className="w-[110px] bg-background border-white/10 text-foreground h-9">
              <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 dark">
              {[5, 10, 20, 50].map(v => <SelectItem key={v} value={String(v)}>{v} rows</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.role} onValueChange={(v) => setFilters(f => ({ ...f, role: v }))}>
            <SelectTrigger className="w-[140px] bg-background border-white/10 text-foreground h-9">
              <Shield className="h-3.5 w-3.5 text-muted-foreground mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 dark">
              <SelectItem value="0">All Members</SelectItem>
              <SelectItem value="2">Admin</SelectItem>
              <SelectItem value="3">Normal User</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 h-9 bg-background border-white/10 text-foreground"
            />
          </div>

          <Button
            onClick={() => setActiveModal('create')}
            className="bg-primary hover:bg-primary/90 text-white h-9 px-4 shadow-lg shadow-primary/20 font-semibold"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                {['Profile', 'Info', 'Contact', 'Role', 'Projects', 'Actions'].map(h => (
                  <th key={h} className={cn(
                    'py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider',
                    (h === 'Contact') && 'hidden md:table-cell',
                    (h === 'Projects') && 'hidden lg:table-cell',
                    (h === 'Actions') && 'text-right'
                  )}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && users.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">
                  <Loader2 className="animate-spin h-7 w-7 mx-auto mb-3 text-primary" />
                  <span className="font-semibold">Loading directory...</span>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-muted-foreground">
                  <CheckCircle2 className="h-14 w-14 mx-auto opacity-15 mb-3" />
                  <p className="font-bold text-foreground">No users found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                </td></tr>
              ) : users.map((user) => {
                const isSA = user.role.id === 1;
                const isAdmin = user.role.id === 2;
                const isUser = user.role.id === 3;
                const canDelete = !((currentUserRole === 2 && (isSA || isAdmin)) || (currentUserRole !== 2 && isSA));
                const canEdit = !((currentUserRole === 2 && (isSA || isAdmin)) || (currentUserRole !== 2 && isSA));
                const canPw = !((currentUserRole === 2 && (isSA || isAdmin || isUser)) || (currentUserRole !== 2 && isSA));

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-5">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={`/upload/${user.avarta}`} onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                        <AvatarFallback className="bg-indigo-600/20 text-indigo-300 text-xs font-bold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-muted-foreground">@{user.display_name}</p>
                    </td>
                    <td className="py-3.5 px-5 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground/50" /> {user.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge className={cn('border font-semibold text-xs', roleBadge(user.role.id))}>
                        {user.role.id === 1 ? <ShieldAlert className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
                        {user.role.name}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 hidden lg:table-cell max-w-[180px]">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{getUserProjects(user.id)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                          onClick={() => { setSelectedUser(user); setActiveModal('view'); }}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {canPw && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                            onClick={() => { setSelectedUser(user); setActiveModal('password'); setChangePw(''); }}>
                            <KeyRound className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg"
                            onClick={() => { setSelectedUser(user); setEditRoleId(user.role.id); setActiveModal('edit'); }}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            onClick={(e) => handleDeleteUser(user.id, e)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
          {paginate && (
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{paginate.total === 0 ? 0 : (paginate.page - 1) * paginate.perpage + 1}</span> to{' '}
              <span className="font-bold text-foreground">{Math.min(paginate.page * paginate.perpage, paginate.total)}</span> of{' '}
              <span className="font-bold text-foreground">{paginate.total}</span> users
            </span>
          )}
          {paginate && paginate.pages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" className="h-8 w-8 border-white/10 bg-background text-foreground hover:bg-white/5 rounded-lg" onClick={() => fetchUsers(paginate.page - 1)} disabled={paginate.page <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, paginate.pages) }, (_, i) => {
                let p = i + 1;
                if (paginate.pages > 5 && paginate.page > 3) {
                  p = paginate.page - 2 + i;
                  if (p > paginate.pages) p = paginate.pages - (4 - i);
                }
                return (
                  <Button key={p} variant={p === paginate.page ? 'default' : 'ghost'} size="icon"
                    className={cn('h-8 w-8 rounded-lg text-sm', p === paginate.page ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}
                    onClick={() => fetchUsers(p)}>
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="icon" className="h-8 w-8 border-white/10 bg-background text-foreground hover:bg-white/5 rounded-lg" onClick={() => fetchUsers(paginate.page + 1)} disabled={paginate.page >= paginate.pages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ─── DIALOGS ─── */}

      {/* VIEW Dialog */}
      <Dialog open={activeModal === 'view'} onOpenChange={closeModal}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-4 w-4 text-blue-400" /> User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col items-center py-2">
              <Avatar className="h-24 w-24 border-4 border-white/5 mb-4">
                <AvatarImage src={`/upload/${selectedUser.avarta}`} onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-2xl font-bold">
                  {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-black text-foreground">{selectedUser.first_name} {selectedUser.last_name}</h3>
              <p className="text-muted-foreground text-sm mb-6">@{selectedUser.display_name}</p>
              <div className="w-full space-y-3 bg-background rounded-xl p-4 border border-white/5">
                {[
                  { label: 'Email', value: selectedUser.email },
                  { label: 'Role', value: selectedUser.role.name },
                  { label: 'Joined', value: new Date(selectedUser.created_on).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }) },
                  { label: 'Projects', value: getUserProjects(selectedUser.id) },
                  { label: 'Bio', value: selectedUser.description || 'No description available.' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="w-1/3 text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">{label}</span>
                    <span className="text-sm text-foreground break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeModal} className="w-full border-white/10 text-foreground hover:bg-white/5">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT ROLE Dialog */}
      <Dialog open={activeModal === 'edit'} onOpenChange={closeModal}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Edit2 className="h-4 w-4 text-primary" /> Edit Role
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-5 py-2">
              <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 p-4 rounded-xl">
                <Avatar className="h-12 w-12 border border-white/10">
                  <AvatarImage src={`/upload/${selectedUser.avarta}`} />
                  <AvatarFallback className="bg-indigo-600/20 text-indigo-300 font-bold">
                    {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-foreground">{selectedUser.first_name} {selectedUser.last_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assign Role</Label>
                <Select value={String(editRoleId)} onValueChange={(v) => setEditRoleId(Number(v))}>
                  <SelectTrigger className="bg-background border-white/10 text-foreground h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 dark">
                    {roles.filter(r => r.id !== 1).map(r => (
                      <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeModal} className="text-muted-foreground hover:text-foreground">Cancel</Button>
            <Button onClick={handleEditSave} className="bg-primary hover:bg-primary/90 text-white">Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CHANGE PASSWORD Dialog */}
      <Dialog open={activeModal === 'password'} onOpenChange={closeModal}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-4 w-4 text-emerald-400" /> Change Password
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-5 py-2">
              <div className="flex flex-col items-center text-center mb-2">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-3">
                  <KeyRound className="h-8 w-8" />
                </div>
                <p className="text-muted-foreground text-sm">New password for <span className="font-bold text-foreground">@{selectedUser.display_name}</span></p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={changePw}
                    onChange={e => setChangePw(e.target.value)}
                    placeholder="Enter strong password"
                    className="h-11 bg-background border-white/10 text-foreground pr-11"
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Min 6 chars, 1 uppercase, 1 number required.</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeModal} className="text-muted-foreground hover:text-foreground">Cancel</Button>
            <Button onClick={handlePasswordSave} className="bg-emerald-600 hover:bg-emerald-500 text-white">Save Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE ACCOUNT Dialog */}
      <Dialog open={activeModal === 'create'} onOpenChange={closeModal}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-4 w-4 text-primary" /> Create Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                <Input value={createForm.firstname} onChange={e => setCreateForm(f => ({ ...f, firstname: e.target.value }))} className="h-10 bg-background border-white/10 text-foreground" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                <Input value={createForm.lastname} onChange={e => setCreateForm(f => ({ ...f, lastname: e.target.value }))} className="h-10 bg-background border-white/10 text-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
              <Input placeholder="@username" value={createForm.username} onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))} className="h-10 bg-background border-white/10 text-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} className="h-10 bg-background border-white/10 text-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
              <Input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} className="h-10 bg-background border-white/10 text-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</Label>
              <Select value={String(createForm.roleId)} onValueChange={(v) => setCreateForm(f => ({ ...f, roleId: Number(v) }))}>
                <SelectTrigger className="h-10 bg-background border-white/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 dark">
                  {roles.filter(r => r.id !== 1).map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeModal} className="text-muted-foreground hover:text-foreground">Cancel</Button>
            <Button onClick={handleCreateAccount} className="bg-primary hover:bg-primary/90 text-white">
              <UserPlus className="h-4 w-4 mr-1.5" /> Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default UsersPage;
