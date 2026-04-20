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

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        await fetchApi(`/api/user/${id}`, { method: 'DELETE' });
        fetchUsers(paginate?.page ?? 1);
        Swal.fire({ title: 'Deleted!', text: 'User removed', icon: 'success', timer: 2000, showConfirmButton: false });
      } catch { }
    }
  };

  const handleEditSave = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetchApi(`/api/user/${selectedUser.id}`, { method: 'PUT', body: JSON.stringify({ new_role_id: editRoleId }) });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Role updated', position: 'top-end', toast: true, timer: 3000, showConfirmButton: false });
        fetchUsers(paginate?.page ?? 1); setActiveModal(null);
      }
    } catch { }
  };

  const handlePasswordSave = async () => {
    if (!selectedUser) return;
    if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/.test(changePw)) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Min 6 chars, 1 uppercase, 1 number.', position: 'top-end', toast: true, timer: 4000, showConfirmButton: false });
      return;
    }
    try {
      const res = await fetchApi(`/api/user/pass/${selectedUser.id}`, { method: 'PUT', body: JSON.stringify({ password: changePw }) });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Password changed', position: 'top-end', toast: true, timer: 3000, showConfirmButton: false });
        fetchUsers(paginate?.page ?? 1); setActiveModal(null); setChangePw('');
      }
    } catch { }
  };

  const handleCreateAccount = async () => {
    Swal.fire({ icon: 'info', title: 'Create account', text: 'Hook up to POST /api/user.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
    setActiveModal(null);
  };

  const roleVariant = (roleId: number) => {
    if (roleId === 1) return 'destructive';
    if (roleId === 2) return 'secondary';
    return 'outline';
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 animate-in fade-in duration-500">

      {/* Header controls */}
      <Card className="p-4 sm:p-6 shadow-sm border">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">User Directory</CardTitle>
              <CardDescription>Manage your team, system access, and roles.</CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select value={String(filters.rowsPerPage)} onValueChange={(v) => setFilters(f => ({ ...f, rowsPerPage: Number(v) }))}>
              <SelectTrigger className="w-[110px] h-9">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map(v => <SelectItem key={v} value={String(v)}>{v} rows</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.role} onValueChange={(v) => setFilters(f => ({ ...f, role: v }))}>
              <SelectTrigger className="w-[140px] h-9">
                <Shield className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Members</SelectItem>
                <SelectItem value="2">Admin</SelectItem>
                <SelectItem value="3">Normal User</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 h-9"
              />
            </div>

            <Button
              onClick={() => setActiveModal('create')}
              className="h-9 px-4"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border overflow-hidden">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-16">Profile</TableHead>
                <TableHead>User Details</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden lg:table-cell">Active Projects</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground font-medium">Loading user data...</span>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <User className="h-10 w-10 mb-2" />
                      <p className="text-sm font-bold">No users matches found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.map((user) => {
                const isSA = user.role.id === 1;
                const isAdmin = user.role.id === 2;
                const isUser = user.role.id === 3;
                const canDelete = !((currentUserRole === 2 && (isSA || isAdmin)) || (currentUserRole !== 2 && isSA));
                const canEdit = !((currentUserRole === 2 && (isSA || isAdmin)) || (currentUserRole !== 2 && isSA));
                const canPw = !((currentUserRole === 2 && (isSA || isAdmin || isUser)) || (currentUserRole !== 2 && isSA));

                return (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/upload/${user.avarta}`} onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">{user.first_name} {user.last_name}</span>
                        <span className="text-xs text-muted-foreground">@{user.display_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" /> {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant(user.role.id) as any} className="text-[10px] tracking-wide h-5">
                        {isSA ? <ShieldAlert className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
                        {user.role.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px]">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3 shrink-0" />
                        <span className="truncate">{getUserProjects(user.id)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"
                          onClick={() => { setSelectedUser(user); setActiveModal('view'); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canPw && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-emerald-500"
                            onClick={() => { setSelectedUser(user); setActiveModal('password'); setChangePw(''); }}>
                            <KeyRound className="h-4 w-4" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-indigo-500"
                            onClick={() => { setSelectedUser(user); setEditRoleId(user.role.id); setActiveModal('edit'); }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"
                            onClick={(e) => handleDeleteUser(user.id, e)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t bg-muted/20">
          {paginate && (
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-bold text-foreground">{paginate.total === 0 ? 0 : (paginate.page - 1) * paginate.perpage + 1}</span> to{' '}
              <span className="font-bold text-foreground">{Math.min(paginate.page * paginate.perpage, paginate.total)}</span> of{' '}
              <span className="font-bold text-foreground">{paginate.total}</span> users
            </span>
          )}
          {paginate && paginate.pages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => fetchUsers(paginate.page - 1)} disabled={paginate.page <= 1}>
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
                    className="h-8 w-8 text-xs"
                    onClick={() => fetchUsers(p)}>
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => fetchUsers(paginate.page + 1)} disabled={paginate.page >= paginate.pages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* ─── DIALOGS ─── */}

      {/* VIEW Dialog */}
      <Dialog open={activeModal === 'view'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" /> User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 border-4 border-muted mb-4 shadow-sm">
                <AvatarImage src={`/upload/${selectedUser.avarta}`} onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{selectedUser.first_name} {selectedUser.last_name}</h3>
              <p className="text-muted-foreground text-xs mb-6">@{selectedUser.display_name}</p>
              <div className="w-full space-y-4 rounded-lg bg-muted/30 p-4 border">
                {[
                  { label: 'Email', value: selectedUser.email },
                  { label: 'Role', value: selectedUser.role.name },
                  { label: 'Joined', value: new Date(selectedUser.created_on).toLocaleDateString() },
                  { label: 'Projects', value: getUserProjects(selectedUser.id) },
                  { label: 'Bio', value: selectedUser.description || 'No description available.' },
                ].map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-3 gap-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{label}</span>
                    <span className="col-span-2 text-sm break-words">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={closeModal} className="w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT ROLE Dialog */}
      <Dialog open={activeModal === 'edit'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-4 w-4 text-primary" /> Edit User Role
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-2">
              <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/upload/${selectedUser.avarta}`} />
                  <AvatarFallback className="text-xs font-bold">{selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{selectedUser.first_name} {selectedUser.last_name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{selectedUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Assign Role</Label>
                <Select value={String(editRoleId)} onValueChange={(v) => setEditRoleId(Number(v))}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.filter(r => r.id !== 1).map(r => (
                      <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleEditSave}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CHANGE PASSWORD Dialog */}
      <Dialog open={activeModal === 'password'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-500">
              <KeyRound className="h-4 w-4" /> Change Password
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-2">
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                  <KeyRound className="h-7 w-7" />
                </div>
                <p className="text-sm text-muted-foreground">New password for <span className="font-bold text-foreground">@{selectedUser.display_name}</span></p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={changePw}
                    onChange={e => setChangePw(e.target.value)}
                    placeholder="Enter strong password"
                    className="h-10 pr-10"
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">Requirement: Min 6 characters, 1 uppercase, 1 number.</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button onClick={handlePasswordSave} className="bg-emerald-600 hover:bg-emerald-500">Save Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE ACCOUNT Dialog */}
      <Dialog open={activeModal === 'create'} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" /> Create Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">First Name</Label>
                <Input value={createForm.firstname} onChange={e => setCreateForm(f => ({ ...f, firstname: e.target.value }))} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Last Name</Label>
                <Input value={createForm.lastname} onChange={e => setCreateForm(f => ({ ...f, lastname: e.target.value }))} className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Username</Label>
              <Input placeholder="@username" value={createForm.username} onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password</Label>
              <Input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assign Role</Label>
              <Select value={String(createForm.roleId)} onValueChange={(v) => setCreateForm(f => ({ ...f, roleId: Number(v) }))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(r => r.id !== 1).map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleCreateAccount}>
              <UserPlus className="h-4 w-4 mr-2" /> Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default UsersPage;
