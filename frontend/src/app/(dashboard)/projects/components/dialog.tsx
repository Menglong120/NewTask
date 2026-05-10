'use client';

import React from 'react';
import { Plus, Edit2, CheckCircle2, Loader2, Search, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/datepicker';
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusOption, NewProject, EditProjectForm, StatusForm, DepartmentOption } from '@/types/project';
import { UserOption } from '@/types/user';

interface ProjectDialogsProps {
  activeModal: 'create' | 'edit' | 'status' | null;
  setActiveModal: (modal: 'create' | 'edit' | 'status' | null) => void;
  newProject: NewProject;
  setNewProject: React.Dispatch<React.SetStateAction<NewProject>>;
  editForm: EditProjectForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditProjectForm>>;
  statusForm: StatusForm;
  setStatusForm: React.Dispatch<React.SetStateAction<StatusForm>>;
  statuses: StatusOption[];
  departments: DepartmentOption[];
  users: UserOption[];
  memberSearch: string;
  setMemberSearch: (search: string) => void;
  submitting: boolean;
  handleCreateProject: () => Promise<any>;
  handleEditProject: () => Promise<any>;
  handleUpdateStatus: () => Promise<any>;
}

export function ProjectDialogs({
  activeModal,
  setActiveModal,
  newProject,
  setNewProject,
  editForm,
  setEditForm,
  statusForm,
  setStatusForm,
  statuses,
  departments,
  users,
  memberSearch,
  setMemberSearch,
  submitting,
  handleCreateProject,
  handleEditProject,
  handleUpdateStatus,
}: ProjectDialogsProps) {
  return (
    <>
      {/* Create Project Dialog */}
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
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Mission Name</Label>
              <Input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Project name" className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Status</Label>
                <Select value={newProject.status_id} onValueChange={(val) => setNewProject({ ...newProject, status_id: val })}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Department</Label>
                <Select value={newProject.department_id} onValueChange={(val) => setNewProject({ ...newProject, department_id: val })}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Department</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={String(department.id)}>{department.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Label className="text-xs font-semibold">Project Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-auto min-h-10 py-2 px-3"
                  >
                    <div className="flex flex-wrap gap-1 items-center">
                      {newProject.member_ids.length > 0 ? (
                        newProject.member_ids.map((id: string) => {
                          const user = users.find((u) => String(u.id) === id);
                          return (
                            <Badge key={id} variant="secondary" className="text-[10px] h-5 px-1.5 font-medium">
                              {user?.display_name || user?.first_name || 'User'}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-muted-foreground text-xs font-normal">Select team members...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="pl-8 h-8 text-xs"
                      />
                    </div>
                  </div>
                  <ScrollArea 
                    className="h-64" 
                    onWheel={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                   >
                    <div className="p-1">
                      {users
                        .filter((user) => {
                          const name = `${user.display_name || ''} ${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
                          return name.includes(memberSearch.toLowerCase());
                        })
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                            onClick={() => {
                              const currentIds = [...newProject.member_ids];
                              const userId = String(user.id);
                              if (currentIds.includes(userId)) {
                                setNewProject({
                                  ...newProject,
                                  member_ids: currentIds.filter((id) => id !== userId),
                                });
                              } else {
                                setNewProject({
                                  ...newProject,
                                  member_ids: [...currentIds, userId],
                                });
                              }
                            }}
                          >
                            <Checkbox
                              checked={newProject.member_ids.includes(String(user.id))}
                              onCheckedChange={() => {}} // Handled by div onClick
                            />
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/upload/${user.avarta}`} />
                              <AvatarFallback className="text-[10px]">
                                {(user.display_name || user.first_name || '?').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">
                                {user.display_name || `${user.first_name} ${user.last_name}`}
                              </span>
                            </div>
                            {newProject.member_ids.includes(String(user.id)) && (
                              <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                            )}
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Description</Label>
              <Input value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Strategic objectives..." className="h-10" />
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

      {/* Edit Project Dialog */}
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
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Department</Label>
              <Select value={editForm.department_id} onValueChange={(val) => setEditForm({ ...editForm, department_id: val })}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Department</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={String(department.id)}>{department.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Update Status Dialog */}
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
                <SelectTrigger className="h-10 w-full">
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
    </>
  );
}
