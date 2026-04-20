'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  X, User, Calendar, Clock, Activity, MessageSquare, 
  CircleDot, Flag, Target, Tag, Trash2, Send, 
  ChevronRight, ChevronDown, Loader2, CalendarPlus, CalendarCheck,
  History, UserCircle, Edit3
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { DatePicker } from '@/components/ui/datepicker';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface IssueDetailDrawerProps {
  issueId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  statuses: any[];
  priorities: any[];
  trackers: any[];
  labels: any[];
}

const IssueDetailDrawer = ({ 
  issueId, 
  isOpen, 
  onClose, 
  onUpdate,
  statuses,
  priorities,
  trackers,
  labels 
}: IssueDetailDrawerProps) => {
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const fetchData = useCallback(async () => {
    if (!issueId) return;
    try {
      setLoading(true);
      const [issueRes, activityRes, notesRes] = await Promise.all([
        fetchApi(`/api/issue/${issueId}`),
        fetchApi(`/api/issue/activities/${issueId}`),
        fetchApi(`/api/issue/notes/${issueId}`)
      ]);

      if (issueRes.result) setIssue(issueRes.data.issues);
      if (activityRes.result) setActivities(activityRes.data);
      if (notesRes.result) setNotes(notesRes.data);
    } catch (error) {
      console.error('Failed to fetch issue details:', error);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    if (isOpen && issueId) {
      fetchData();
    } else {
      setIssue(null);
      setActivities([]);
      setNotes([]);
    }
  }, [isOpen, issueId, fetchData]);

  const handleUpdateField = async (field: string, value: any) => {
    if (!issueId) return;
    try {
      const fieldToEndpoint: Record<string, string> = {
        'status': 'status',
        'priority': 'priority',
        'tracker': 'tracker',
        'label': 'label',
        'assignee': 'assignee',
        'progress': 'progress',
        'start_date': 'startdate',
        'due_date': 'duedate'
      };

      const endpoint = fieldToEndpoint[field];
      const isDate = field === 'start_date' || field === 'due_date';
      const payload = isDate ? { date: value } : { item: value };

      const res = await fetchApi(`/api/issue/edit/${endpoint}/${issueId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.result) {
        // Create activity log
        await fetchApi(`/api/issue/activity/${issueId}`, {
          method: 'POST',
          body: JSON.stringify({
            title: `Update ${field}`,
            activity: `Updated ${field} to ${value}`
          })
        });
        fetchData();
        onUpdate();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !issueId) return;
    try {
      setSubmittingNote(true);
      const res = await fetchApi(`/api/issue/note/${issueId}`, {
        method: 'POST',
        body: JSON.stringify({ note: newNote })
      });

      if (res.result) {
        setNewNote('');
        const notesRes = await fetchApi(`/api/issue/notes/${issueId}`);
        if (notesRes.result) setNotes(notesRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingNote(false);
    }
  };

  const PropertyRow = ({ icon: Icon, label, children, className }: any) => (
    <div className={cn("flex items-center justify-between py-2 px-1 group/prop transition-colors hover:bg-muted/50 rounded-md", className)}>
      <div className="flex items-center gap-2 text-muted-foreground min-w-[120px]">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex-1 flex justify-end">
        {children}
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="p-0 border-l w-full sm:max-w-xl flex flex-col">
        {loading && !issue ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground p-6">
            <SheetHeader className="sr-only">
              <SheetTitle>Loading...</SheetTitle>
              <SheetDescription>Please wait while the issue details are being loaded.</SheetDescription>
            </SheetHeader>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-medium">Synchronizing Details...</span>
          </div>
        ) : issue ? (
          <>
            <ScrollArea className="flex-1 h-full">
              <div className="p-6 sm:p-8 space-y-8">
                {/* Header Section */}
                <SheetHeader className="space-y-3 text-left">
                   <div className="flex flex-wrap items-center gap-2">
                     <Badge variant="secondary" className="font-semibold text-[10px] uppercase tracking-wider">
                        ISSUE-{issue.id}
                     </Badge>
                     <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                       {issue.category?.name || 'Task'}
                     </span>
                   </div>
                   <SheetTitle className="text-xl sm:text-2xl font-bold leading-tight">
                     {issue.name || 'Untitled Issue'}
                   </SheetTitle>
                   <SheetDescription className="p-4 bg-muted/40 border rounded-lg text-sm leading-relaxed">
                       {issue.description || 'No description provided.'}
                   </SheetDescription>
                </SheetHeader>

                {/* Sub-issues Section */}
                {issue.subIssues && issue.subIssues.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <History className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Sub-tasks</span>
                    </div>
                    <div className="space-y-1.5">
                       {issue.subIssues.map((sub: any) => (
                         <div key={sub.id} className="flex items-center justify-between p-2.5 bg-muted/20 border rounded-md hover:bg-muted/40 transition-colors gap-3">
                            <span className="text-xs font-medium truncate">{sub.name}</span>
                            <Badge variant="outline" className="text-[9px] font-semibold h-4 shrink-0">
                              {sub.status?.name}
                            </Badge>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {/* Properties Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Properties</span>
                  </div>
                  <div className="space-y-1 bg-muted/20 p-4 rounded-lg border">
                    <PropertyRow icon={UserCircle} label="Assignee" className="flex-col sm:flex-row items-start sm:items-center gap-2">
                       <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                             <AvatarImage src={`/upload/${issue.creator?.avarta}`} />
                             <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                               {(issue.creator?.dis_name || 'U')[0]}
                             </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{issue.creator?.dis_name || issue.creator?.email || 'Unassigned'}</span>
                       </div>
                    </PropertyRow>

                    <PropertyRow icon={CircleDot} label="Status" className="border-t pt-2 flex-col sm:flex-row items-start sm:items-center gap-2">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-medium justify-between px-3 w-full sm:w-auto">
                               {issue.status?.name || 'Select status'}
                               <ChevronDown className="h-3 w-3 opacity-50" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             {statuses.map(s => (
                               <DropdownMenuItem key={s.id} onClick={() => handleUpdateField('status', s.id)} className="text-xs cursor-pointer">
                                 {s.name}
                               </DropdownMenuItem>
                             ))}
                           </DropdownMenuContent>
                         </DropdownMenu>
                    </PropertyRow>

                    <PropertyRow icon={Tag} label="Label" className="border-t pt-2 flex-col sm:flex-row items-start sm:items-center gap-2">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-medium justify-between px-3 w-full sm:w-auto">
                               {issue.label?.name || 'Select label'}
                               <ChevronDown className="h-3 w-3 opacity-50" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             {labels.map(l => (
                               <DropdownMenuItem key={l.id} onClick={() => handleUpdateField('label', l.id)} className="text-xs cursor-pointer">
                                 {l.name}
                               </DropdownMenuItem>
                             ))}
                           </DropdownMenuContent>
                         </DropdownMenu>
                    </PropertyRow>

                    <PropertyRow icon={Flag} label="Priority" className="border-t pt-2 flex-col sm:flex-row items-start sm:items-center gap-2">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-medium justify-between px-3 w-full sm:w-auto">
                               {issue.priority?.name || 'Select priority'}
                               <ChevronDown className="h-3 w-3 opacity-50" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             {priorities.map(p => (
                               <DropdownMenuItem key={p.id} onClick={() => handleUpdateField('priority', p.id)} className="text-xs cursor-pointer">
                                 {p.name}
                               </DropdownMenuItem>
                             ))}
                           </DropdownMenuContent>
                         </DropdownMenu>
                    </PropertyRow>

                    <PropertyRow icon={Target} label="Tracker" className="border-t pt-2 flex-col sm:flex-row items-start sm:items-center gap-2">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-medium justify-between px-3 w-full sm:w-auto">
                               {issue.tracker?.name || 'Select tracker'}
                               <ChevronDown className="h-3 w-3 opacity-50" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             {trackers.map(t => (
                               <DropdownMenuItem key={t.id} onClick={() => handleUpdateField('tracker', t.id)} className="text-xs cursor-pointer">
                                 {t.name}
                               </DropdownMenuItem>
                             ))}
                           </DropdownMenuContent>
                         </DropdownMenu>
                    </PropertyRow>

                    <PropertyRow icon={CalendarPlus} label="Start Date" className="border-t pt-2 flex-col sm:flex-row items-start sm:items-center gap-2">
                        <DatePicker
                          selected={issue.start_date ? new Date(issue.start_date) : undefined}
                          onSelect={(val) => handleUpdateField('start_date', val)}
                          className="h-8 w-full sm:w-auto"
                        />
                    </PropertyRow>

                    <PropertyRow icon={CalendarCheck} label="Due Date" className="border-t pt-2 flex-col sm:flex-row items-start sm:items-center gap-2">
                        <DatePicker
                          selected={issue.due_date ? new Date(issue.due_date) : undefined}
                          onSelect={(val) => handleUpdateField('due_date', val)}
                          className="h-8 w-full sm:w-auto"
                        />
                    </PropertyRow>
                  </div>
                </div>

                {/* Activities Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Activity</span>
                  </div>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                    {activities.length > 0 ? activities.map((act) => (
                      <div key={act.id} className="relative">
                        <div className="absolute -left-[2.3rem] top-1 h-3 w-3 rounded-full bg-background border-2 border-primary z-10" />
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold">{act.title}</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase">{act.created_on ? new Date(act.created_on).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{act.activity}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-xs text-muted-foreground italic py-2">No recent activity.</div>
                    )}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4 pb-20">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Notes</span>
                  </div>
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="flex gap-3 p-4 bg-muted/20 border rounded-lg">
                         <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={`/upload/${note.noter?.avarta}`} />
                            <AvatarFallback className="bg-primary/20 text-primary font-bold text-[10px]">
                               {(note.noter?.disname || note.noter?.email || 'U')[0]}
                            </AvatarFallback>
                         </Avatar>
                         <div className="flex-1 space-y-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                               <span className="text-xs font-bold truncate">{note.noter?.disname || note.noter?.email}</span>
                               <span className="text-[10px] text-muted-foreground font-medium shrink-0">{note.created_on ? new Date(note.created_on).toLocaleDateString() : ''}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: note.notes }} />
                         </div>
                      </div>
                    ))}

                    <div className="space-y-3 p-4 border rounded-lg bg-background">
                       <textarea 
                         placeholder="Add a comment..."
                         className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 resize-none min-h-[80px] font-medium"
                         value={newNote}
                         onChange={(e) => setNewNote(e.target.value)}
                       />
                       <div className="flex justify-end">
                         <Button 
                           size="sm" 
                           onClick={handleAddNote}
                           disabled={submittingNote || !newNote.trim()}
                         >
                           {submittingNote ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Send className="h-3.5 w-3.5 mr-2" />}
                           Post Note
                         </Button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default IssueDetailDrawer;
