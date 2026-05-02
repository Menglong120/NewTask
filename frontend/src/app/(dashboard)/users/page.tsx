'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  Search, UserPlus, Eye, KeyRound, Edit2, Trash2, Filter,
  ChevronLeft, ChevronRight, ShieldAlert, Mail,
  User, Shield, Briefcase, Loader2, MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { UserData, ProjectData, Paginate, DepartmentData, RoleData } from '@/types/user';
import { UserDialogs } from './dialog/dialog';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmActionDialog } from "@/components/confirm-action-dialog";

const UsersPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [paginate, setPaginate] = useState<Paginate | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<number>(3);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', role: '0', rowsPerPage: 5 });

  const [activeModal, setActiveModal] = useState<'view' | 'edit' | 'password' | 'create' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editRoleId, setEditRoleId] = useState<number>(0);
  const [editDepartmentId, setEditDepartmentId] = useState<string>('none');
  const [changePw, setChangePw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    firstname: '', lastname: '', username: '', email: '', password: '', roleId: 3
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchApi('/api/profile');
        if (res.result && res.data.length > 0) setCurrentUserRole(Number(res.data[0].role.id));
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
    const getDepartments = async () => {
      try {
        const res = await fetchApi('/api/departments?search=');
        if (res.result) setDepartments(res.data);
      } catch { }
    };
    getProfile(); getProjects(); getRoles(); getDepartments();
  }, []);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchApi(`/api/users?search=${filters.search}&role=${filters.role}&page=${page}&perpage=${filters.rowsPerPage}`);
      if (res.result) { setUsers(res.data.datas); setPaginate(res.data.paginate); }
    } catch { } finally { setLoading(false); }
  }, [filters.role, filters.rowsPerPage, filters.search]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const handleSearch = () => setFilters(prev => ({ ...prev, search: searchInput }));

  const getUserProjects = (userId: string) => {
    const names = projects.filter(p => p.members?.some(m => m.user?.id === userId)).map(p => p.name);
    if (!names.length) return 'No Project';
    if (names.length > 2) return names.slice(0, 2).join(', ') + '...';
    return names.join(', ');
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await fetchApi(`/api/user/${id}`, { method: 'DELETE' });
      fetchUsers(paginate?.page ?? 1);
      Swal.fire({ title: 'Deleted!', text: 'User removed', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch { }
    finally { setPendingDeleteUserId(null); }
  };

  const handleEditSave = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetchApi(`/api/user/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          new_role_id: editRoleId,
          department_id: editDepartmentId === 'none' ? null : Number(editDepartmentId),
        })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'User updated', position: 'top-end', toast: true, timer: 3000, showConfirmButton: false });
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

  const roleVariant = (roleId: number): 'destructive' | 'secondary' | 'outline' => {
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
      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>User Table</CardTitle>
            <CardDescription>Review members, roles, departments, and active projects.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Contact</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Department</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Role</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-3">Active Projects</TableHead>
                    <TableHead className="text-right py-3">Action</TableHead>
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
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border">
                              <AvatarImage src={`/upload/${user.avarta}`} onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                              <AvatarFallback className="bg-muted text-xs font-bold">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm tracking-tight truncate">{user.first_name} {user.last_name}</span>
                              <span className="text-[10px] text-muted-foreground font-medium truncate italic">@{user.display_name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wide px-2 h-5">
                            {user.department?.name || 'Unassigned'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleVariant(user.role.id)} className="text-[9px] font-bold uppercase tracking-wide px-2 h-5">
                            {isSA ? <ShieldAlert className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
                            {user.role.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[240px]">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Briefcase className="h-3 w-3 shrink-0" />
                            <span className="truncate">{getUserProjects(user.id)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setActiveModal('view'); }}>
                                <Eye className="h-4 w-4" />
                                View User
                              </DropdownMenuItem>
                              {canPw && (
                                <DropdownMenuItem onClick={() => { setSelectedUser(user); setActiveModal('password'); setChangePw(''); }}>
                                  <KeyRound className="h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                              )}
                              {canEdit && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setEditRoleId(user.role.id);
                                    setEditDepartmentId(user.department ? String(user.department.id) : 'none');
                                    setActiveModal('edit');
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit Access
                                </DropdownMenuItem>
                              )}
                              {canDelete && (canPw || canEdit) && <DropdownMenuSeparator />}
                              {canDelete && (
                                <DropdownMenuItem onClick={() => setPendingDeleteUserId(user.id)} variant="destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 md:flex-row">
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
        </CardContent>
      </Card>

      <UserDialogs
        activeModal={activeModal}
        closeModal={closeModal}
        selectedUser={selectedUser}
        getUserProjects={getUserProjects}
        roles={roles}
        departments={departments}
        editRoleId={editRoleId}
        setEditRoleId={setEditRoleId}
        editDepartmentId={editDepartmentId}
        setEditDepartmentId={setEditDepartmentId}
        handleEditSave={handleEditSave}
        changePw={changePw}
        setChangePw={setChangePw}
        showPw={showPw}
        setShowPw={setShowPw}
        handlePasswordSave={handlePasswordSave}
        createForm={createForm}
        setCreateForm={setCreateForm}
        handleCreateAccount={handleCreateAccount}
      />

      <ConfirmActionDialog
        open={pendingDeleteUserId !== null}
        onOpenChange={(open) => !open && setPendingDeleteUserId(null)}
        title="Delete user?"
        description="This user will be permanently removed from the workspace."
        confirmLabel="Delete user"
        onConfirm={() => {
          if (!pendingDeleteUserId) return
          return handleDeleteUser(pendingDeleteUserId)
        }}
      />

    </div>
  );
};

export default UsersPage;
