'use client';

import React from 'react';
import { Eye, Edit2, KeyRound, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { UserData, RoleData, DepartmentData } from '@/types/user';

interface UserDialogsProps {
  activeModal: 'view' | 'edit' | 'password' | 'create' | null;
  closeModal: () => void;
  selectedUser: UserData | null;
  getUserProjects: (userId: string) => string;
  roles: RoleData[];
  departments: DepartmentData[];
  editRoleId: number;
  setEditRoleId: (id: number) => void;
  editDepartmentId: string;
  setEditDepartmentId: (id: string) => void;
  handleEditSave: () => Promise<void>;
  changePw: string;
  setChangePw: (pw: string) => void;
  showPw: boolean;
  setShowPw: (show: boolean) => void;
  handlePasswordSave: () => Promise<void>;
  createForm: any;
  setCreateForm: React.Dispatch<React.SetStateAction<any>>;
  handleCreateAccount: () => Promise<void>;
}

export function UserDialogs({
  activeModal,
  closeModal,
  selectedUser,
  getUserProjects,
  roles,
  departments,
  editRoleId,
  setEditRoleId,
  editDepartmentId,
  setEditDepartmentId,
  handleEditSave,
  changePw,
  setChangePw,
  showPw,
  setShowPw,
  handlePasswordSave,
  createForm,
  setCreateForm,
  handleCreateAccount,
}: UserDialogsProps) {
  return (
    <>
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
                  { label: 'Department', value: selectedUser.department?.name || 'Unassigned' },
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
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.filter(r => r.id !== 1).map(r => (
                      <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Assign Department</Label>
                <Select value={editDepartmentId} onValueChange={setEditDepartmentId}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Department</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={String(department.id)}>{department.name}</SelectItem>
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
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={changePw}
                    onChange={e => setChangePw(e.target.value)}
                    placeholder="Enter strong password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
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
            <Button onClick={handlePasswordSave} className="bg-emerald-600 hover:bg-emerald-500 text-white">Save Password</Button>
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
                <Input value={createForm.firstname} onChange={e => setCreateForm((f: any) => ({ ...f, firstname: e.target.value }))} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Last Name</Label>
                <Input value={createForm.lastname} onChange={e => setCreateForm((f: any) => ({ ...f, lastname: e.target.value }))} className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Username</Label>
              <Input placeholder="@username" value={createForm.username} onChange={e => setCreateForm((f: any) => ({ ...f, username: e.target.value }))} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input type="email" value={createForm.email} onChange={e => setCreateForm((f: any) => ({ ...f, email: e.target.value }))} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password</Label>
              <Input type="password" value={createForm.password} onChange={e => setCreateForm((f: any) => ({ ...f, password: e.target.value }))} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assign Role</Label>
              <Select value={String(createForm.roleId)} onValueChange={(v) => setCreateForm((f: any) => ({ ...f, roleId: Number(v) }))}>
                <SelectTrigger className="h-9 w-full">
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
    </>
  );
}
