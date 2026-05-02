'use client';

import React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/datepicker';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { NewSubIssue } from '@/types/issue';
import { ItemState, Member } from '@/types/project';

interface AddSubIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newSubIssue: NewSubIssue;
  setNewSubIssue: React.Dispatch<React.SetStateAction<NewSubIssue>>;
  handleAddSubIssue: () => Promise<any>;
  submitting: boolean;
  statuses: ItemState[];
  priorities: ItemState[];
  labels: ItemState[];
  trackers: ItemState[];
  members: Member[];
}

export function AddSubIssueDialog({
  open,
  onOpenChange,
  newSubIssue,
  setNewSubIssue,
  handleAddSubIssue,
  submitting,
  statuses,
  priorities,
  labels,
  trackers,
  members,
}: AddSubIssueDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Plus className="h-5 w-5" />
            </div>
            <span>Initialize Sub-Issue</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4 overflow-y-auto max-h-[60vh] px-1">
          <div className="col-span-2 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject Identifier</Label>
            <Input
              placeholder="Brief objective title..."
              value={newSubIssue.name}
              onChange={(e) => setNewSubIssue({ ...newSubIssue, name: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tactical Briefing</Label>
            <Textarea
              placeholder="Define execution steps..."
              className="min-h-[120px] resize-none"
              value={newSubIssue.description}
              onChange={(e) => setNewSubIssue({ ...newSubIssue, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mission State</Label>
            <Select value={newSubIssue.status_id} onValueChange={(v) => setNewSubIssue({ ...newSubIssue, status_id: v })}>
              <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => <SelectItem key={s.id} value={String(s.id)} className="text-[10px] font-bold uppercase">{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Impact Level</Label>
            <Select value={newSubIssue.priority_id} onValueChange={(v) => setNewSubIssue({ ...newSubIssue, priority_id: v })}>
              <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                {priorities.map(p => <SelectItem key={p.id} value={String(p.id)} className="text-[10px] font-bold uppercase">{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Directive Tag</Label>
            <Select value={newSubIssue.label_id} onValueChange={(v) => setNewSubIssue({ ...newSubIssue, label_id: v })}>
              <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Label" /></SelectTrigger>
              <SelectContent>
                {labels.map(l => <SelectItem key={l.id} value={String(l.id)} className="text-[10px] font-bold uppercase">{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Execution Model</Label>
            <Select value={newSubIssue.tracker_id} onValueChange={(v) => setNewSubIssue({ ...newSubIssue, tracker_id: v })}>
              <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Tracker" /></SelectTrigger>
              <SelectContent>
                {trackers.map(t => <SelectItem key={t.id} value={String(t.id)} className="text-[10px] font-bold uppercase">{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start Window</Label>
            <DatePicker
              selected={newSubIssue.start_date}
              onSelect={(value) => setNewSubIssue({ ...newSubIssue, start_date: value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Deadline</Label>
            <DatePicker
              selected={newSubIssue.due_date}
              onSelect={(value) => setNewSubIssue({ ...newSubIssue, due_date: value })}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assigned Operational Specialist</Label>
            <Select value={newSubIssue.assignee} onValueChange={(v) => setNewSubIssue({ ...newSubIssue, assignee: v })}>
              <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Select Agent" /></SelectTrigger>
              <SelectContent>
                {members.map(m => (
                  <SelectItem key={m.id} value={String(m.user?.id || m.id)} className="text-[10px] font-bold uppercase">
                    {m.user?.dis_name || m.user?.email || m.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddSubIssue} disabled={submitting} className="px-8 shadow-md">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Confirm Initialization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
