'use client';

import React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { NewIssue } from '@/types/issue';
import { ItemState, Member } from '@/types/project';

interface IssueDialogProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  newIssue: NewIssue;
  setNewIssue: (issue: NewIssue) => void;
  trackers: ItemState[];
  statuses: ItemState[];
  priorities: ItemState[];
  labels: ItemState[];
  members: Member[];
  submitting: boolean;
  handleCreateIssue: () => Promise<any>;
}

export function IssueDialog({
  isCreateModalOpen,
  setIsCreateModalOpen,
  newIssue,
  setNewIssue,
  trackers,
  statuses,
  priorities,
  labels,
  members,
  submitting,
  handleCreateIssue,
}: IssueDialogProps) {
  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-widest leading-none mb-1">Issue Directory</p>
              <p>Initialize New Issue</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4 overflow-y-auto max-h-[60vh] px-1">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold tracking-widest text-muted-foreground">Title</Label>
            <Input
              placeholder="Brief objective title..."
              value={newIssue.name}
              onChange={(e) => setNewIssue({ ...newIssue, name: e.target.value })}
              className="h-10 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">Tracker</Label>
              <Select value={newIssue.tracker_id} onValueChange={(v) => setNewIssue({ ...newIssue, tracker_id: v })}>
                <SelectTrigger className="h-10 text-xs font-bold w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {trackers.map(t => <SelectItem key={t.id} value={String(t.id)} className="text-[10px] font-bold">{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">Status</Label>
              <Select value={newIssue.status_id} onValueChange={(v) => setNewIssue({ ...newIssue, status_id: v })}>
                <SelectTrigger className="h-10 text-xs font-bold w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(s => <SelectItem key={s.id} value={String(s.id)} className="text-[10px] font-bold">{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">Priority</Label>
              <Select value={newIssue.priority_id} onValueChange={(v) => setNewIssue({ ...newIssue, priority_id: v })}>
                <SelectTrigger className="h-10 text-xs font-bold w-full">
                  <SelectValue placeholder="Select Impact" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(p => <SelectItem key={p.id} value={String(p.id)} className="text-[10px] font-bold">{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">Label</Label>
              <Select value={newIssue.label_id} onValueChange={(v) => setNewIssue({ ...newIssue, label_id: v })}>
                <SelectTrigger className="h-10 text-xs font-bold w-full">
                  <SelectValue placeholder="Select Tag" />
                </SelectTrigger>
                <SelectContent>
                  {labels.map(l => <SelectItem key={l.id} value={String(l.id)} className="text-[10px] font-bold">{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">Start Date</Label>
              <DatePicker
                selected={newIssue.start_date}
                onSelect={(v) => setNewIssue({ ...newIssue, start_date: v })}
                placeholder="Initiation"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">Due Date</Label>
              <DatePicker
                selected={newIssue.due_date}
                onSelect={(v) => setNewIssue({ ...newIssue, due_date: v })}
                placeholder="Target"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold tracking-widest text-muted-foreground">Assigned Team Member</Label>
            <div className="max-h-[150px] overflow-y-auto border rounded-xl divide-y">
              {members.map((m) => {
                const userObj = m.user;
                const isSelected = String(userObj.id) === newIssue.assignee_id;
                const name = userObj.first_name || userObj.last_name 
                           ? `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim() 
                           : (userObj.dis_name || userObj.display_name || m.email || 'User');
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-center gap-3 p-2 cursor-pointer transition-colors",
                      isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                    )}
                    onClick={() => setNewIssue({ ...newIssue, assignee_id: String(userObj.id) })}
                  >
                    <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0", isSelected ? "border-primary bg-primary" : "border-muted-foreground/30")}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <Avatar className="h-7 w-7 border">
                      <AvatarImage src={`/upload/${userObj.avarta || m.avarta}`} />
                      <AvatarFallback className="text-[8px] font-bold">
                        {userObj.first_name ? userObj.first_name[0] : (userObj.dis_name || name)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold truncate">{name}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{m.email || userObj.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold tracking-widest text-muted-foreground">Description</Label>
            <Textarea
              placeholder="Tactical objectives and requirements..."
              rows={3}
              className="font-medium resize-none shadow-none"
              value={newIssue.description}
              onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="mt-2 pt-4 border-t">
          <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateIssue} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Create Issue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
