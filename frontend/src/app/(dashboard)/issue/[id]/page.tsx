'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  ChevronRight, CircleDot, Flag, Target, Tag,
  Clock, Loader2, PlayCircle, CheckCircle2,
  MessageSquare, History, User2,
  Send, Plus, MoreVertical, Edit3, Save, X, ArrowLeft,
  LayoutPanelLeft, Trash2, CalendarPlus, CalendarCheck,
  CheckCircle, ClipboardList,
  Activity as ActivityIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/datepicker';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ConfirmActionDialog } from '@/components/confirm-action-dialog';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Issue {
  id: number;
  name: string;
  description: string;
  start_date: string;
  due_date: string;
  progress: number;
  status: { id: number; name: string };
  priority: { id: number; name: string };
  tracker: { id: number; name: string };
  label: { id: number; name: string };
  category: { id: number; name: string; project?: { id: number; name: string } };
  assignee: { id: string; email: string; dis_name: string; avarta: string };
}

interface Activity {
  id: number;
  title: string;
  activity: string;
  created_on: string;
  actor: { dis_name: string; avarta: string };
}

interface Note {
  id: number;
  notes: string;
  created_on: string;
  noter: { id: string; disname: string; avarta: string; email: string };
}

interface NewSubIssue {
  name: string;
  description: string;
  status_id: string;
  priority_id: string;
  tracker_id: string;
  label_id: string;
  assignee: string;
  start_date?: Date;
  due_date?: Date;
}

// ─── Component ────────────────────────────────────────────────────────────────

const IssueDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  // Core data
  const [issue, setIssue] = useState<Issue | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subIssues, setSubIssues] = useState<any[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState('');

  // Project metadata (populated after issue load)
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [trackers, setTrackers] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Sub-issue creation modal
  const [isAddSubIssueOpen, setIsAddSubIssueOpen] = useState(false);
  const [newSubIssue, setNewSubIssue] = useState<NewSubIssue>({
    name: '', description: '', status_id: '', priority_id: '',
    tracker_id: '', label_id: '', assignee: '',
  });
  const [pendingDeleteSubIssueId, setPendingDeleteSubIssueId] = useState<number | null>(null);

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  const fetchFullData = useCallback(async () => {
    try {
      setLoading(true);
      const [issueRes, notesRes, activitiesRes, subIssuesRes] = await Promise.all([
        fetchApi(`/api/issue/${id}`),
        fetchApi(`/api/issue/notes/${id}`),
        fetchApi(`/api/issue/activities/${id}`),
        fetchApi(`/api/sub/issues/${id}?search=&page=1&perpage=100`),
      ]);

      if (issueRes.result) {
        // Backend returns issue detail inside data.issues key
        const issueData = issueRes.data.issues;
        setIssue(issueData);
        setEditedDesc(issueData?.description || '');

        // Derive project ID from multiple possible locations
        const projId =
          issueRes.data.project?.id ||
          issueData?.category?.project_id ||
          issueData?.category?.project?.id;

        if (projId) {
          const [sRes, pRes, tRes, lRes, mRes] = await Promise.all([
            fetchApi(`/api/projects/issue/statuses/${projId}`),
            fetchApi(`/api/projects/issue/priorities/${projId}`),
            fetchApi(`/api/projects/issue/trackers/${projId}`),
            fetchApi(`/api/projects/issue/labels/${projId}`),
            fetchApi(`/api/projects/members/${projId}?search=&page=1&perpage=100`),
          ]);
          if (sRes.result) setStatuses(sRes.data.statuses || []);
          if (pRes.result) setPriorities(pRes.data.priorities || []);
          if (tRes.result) setTrackers(tRes.data.trackers || []);
          if (lRes.result) setLabels(lRes.data.labels || []);
          if (mRes.result) setMembers(mRes.data.datas || mRes.data || []);
        }
      }

      // Notes & activities return plain arrays as data
      if (notesRes.result) setNotes(notesRes.data || []);
      if (activitiesRes.result) setActivities(activitiesRes.data || []);
      if (subIssuesRes.result) setSubIssues(
        subIssuesRes.data.sub_issues?.datas || subIssuesRes.data.sub_issues || []
      );

    } catch (err) {
      console.error('Failed to fetch issue details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) fetchFullData(); }, [id, fetchFullData]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  /** Update any single issue field via the dedicated edit endpoints */
  const handleUpdateField = useCallback(async (field: string, value: any) => {
    try {
      const fieldMap: Record<string, string> = {
        status: 'status',
        priority: 'priority',
        tracker: 'tracker',
        label: 'label',
        assignee: 'assignee',
        progress: 'progress',
        start_date: 'startdate',
        due_date: 'duedate',
      };

      let res;
      if (field === 'description') {
        // Full PUT because there is no description-only endpoint
        res = await fetchApi(`/api/issue/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: issue?.name, description: value }),
        });
      } else {
        const isDate = field === 'start_date' || field === 'due_date';
        const finalValue = isDate && value instanceof Date ? value.toISOString() : value;
        const payload = isDate ? { date: finalValue } : { item: value };
        res = await fetchApi(`/api/issue/edit/${fieldMap[field]}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }

      if (res?.result) {
        // Log activity
        await fetchApi(`/api/issue/activity/${id}`, {
          method: 'POST',
          body: JSON.stringify({
            title: `Update ${field.charAt(0).toUpperCase() + field.slice(1)}`,
            activity: `Updated ${field} of issue`,
          }),
        });
        Swal.fire({ icon: 'success', title: 'Property Updated', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        fetchFullData();
        if (field === 'description') setIsEditingDesc(false);
      }
    } catch (e) { console.error(e); }
  }, [id, issue, fetchFullData]);

  /** Create a new note on this issue */
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      setSubmitting(true);
      // Backend noteValidator expects field: "notes"
      const res = await fetchApi(`/api/issue/note/${id}`, {
        method: 'POST',
        body: JSON.stringify({ notes: newNote }),
      });
      if (res.result) { setNewNote(''); fetchFullData(); }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  /** Create a full sub-issue via the modal (all required fields) */
  const handleAddSubIssue = async () => {
    const { name, status_id, priority_id, tracker_id, label_id } = newSubIssue;
    if (!name || !status_id || !priority_id || !tracker_id || !label_id) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill in Name, Status, Priority, Tracker and Label.' });
      return;
    }
    try {
      setSubmitting(true);
      
      // Ensure dates are strings for the backend
      const payload = {
        ...newSubIssue,
        start_date: newSubIssue.start_date?.toISOString(),
        due_date: newSubIssue.due_date?.toISOString(),
      };

      const res = await fetchApi(`/api/sub/issue/${id}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.result) {
        await fetchApi(`/api/issue/activity/${id}`, {
          method: 'POST',
          body: JSON.stringify({ title: 'Sub-Issue Created', activity: `Created sub-issue: ${name}` }),
        });
        Swal.fire({ icon: 'success', title: 'Sub-Issue Created', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        setIsAddSubIssueOpen(false);
        setNewSubIssue({ name: '', description: '', status_id: '', priority_id: '', tracker_id: '', label_id: '', assignee: '' });
        fetchFullData();
      }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  /** Toggle sub-issue done/undone (status 2 = done, any other = in-progress) */
  const handleToggleSubIssueStatus = async (subId: number, currentStatusId: number) => {
    try {
      const nextStatusId = currentStatusId === 2 ? 1 : 2;
      const res = await fetchApi(`/api/sub/issue/status/${subId}`, {
        method: 'PUT',
        body: JSON.stringify({ item: nextStatusId }),
      });
      if (res.result) fetchFullData();
    } catch (e) { console.error(e); }
  };

  /** Delete a sub-issue with confirmation */
  const handleDeleteSubIssue = async (subId: number) => {
    try {
      const res = await fetchApi(`/api/sub/issue/${subId}`, { method: 'DELETE' });
      if (res.result) {
        fetchFullData();
        Swal.fire({ icon: 'success', title: 'Deleted', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
      }
    } catch (e) { console.error(e); }
    finally { setPendingDeleteSubIssueId(null); }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading issue details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <X className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-xl font-semibold">Issue not found</p>
        <Button variant="outline" onClick={() => router.back()}>Back to dashboard</Button>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 gap-2 px-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to directory
          </Button>
          <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground/60">{issue.category?.project?.name}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{issue.category?.name}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground normal-case flex items-center gap-3">
                {issue.name}
                <Badge variant="outline" className="font-mono text-[10px] tracking-normal h-5 border-primary/20 text-primary/70">#{issue.id}</Badge>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => setIsEditingDesc(true)} className="gap-2 h-9 border">
            <Edit3 className="h-4 w-4" /> Describe
          </Button>
          <Dialog open={isAddSubIssueOpen} onOpenChange={setIsAddSubIssueOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 h-9 shadow-sm">
                <Plus className="h-4 w-4" /> Add Sub-Issue
              </Button>
            </DialogTrigger>
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
                  <Select onValueChange={(v) => setNewSubIssue({ ...newSubIssue, status_id: v })}>
                    <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      {statuses.map(s => <SelectItem key={s.id} value={String(s.id)} className="text-[10px] font-bold uppercase">{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Impact Level</Label>
                  <Select onValueChange={(v) => setNewSubIssue({ ...newSubIssue, priority_id: v })}>
                    <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => <SelectItem key={p.id} value={String(p.id)} className="text-[10px] font-bold uppercase">{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Directive Tag</Label>
                  <Select onValueChange={(v) => setNewSubIssue({ ...newSubIssue, label_id: v })}>
                    <SelectTrigger className="text-xs font-bold uppercase"><SelectValue placeholder="Label" /></SelectTrigger>
                    <SelectContent>
                      {labels.map(l => <SelectItem key={l.id} value={String(l.id)} className="text-[10px] font-bold uppercase">{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Execution Model</Label>
                  <Select onValueChange={(v) => setNewSubIssue({ ...newSubIssue, tracker_id: v })}>
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
                  <Select onValueChange={(v) => setNewSubIssue({ ...newSubIssue, assignee: v })}>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 border">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingDesc(true)} className="gap-2">
                <Edit3 className="h-4 w-4 text-primary" /> Edit Narrative
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateField('progress', 100)} className="gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                <Trash2 className="h-4 w-4" /> Terminate Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Operational Narrative Card */}
          <Card className="border shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-background border rounded-lg">
                  <Edit3 className="h-3.5 w-3.5 text-primary" />
                </div>
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mission Briefing</CardTitle>
              </div>
              {!isEditingDesc && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingDesc(true)} className="h-7 text-[10px] font-bold uppercase tracking-widest hover:bg-background">
                  Modify Brief
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {isEditingDesc ? (
                <div className="space-y-4">
                  <Textarea
                    className="min-h-[250px] font-medium leading-relaxed resize-none border-dashed"
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setIsEditingDesc(false); setEditedDesc(issue.description || ''); }}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleUpdateField('description', editedDesc)}>
                      Update Briefing
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-[1.8] text-foreground/80 whitespace-pre-wrap">
                  {issue.description || 'No operational briefing available for this mission.'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Sub-Tabs Navigation */}
          <Tabs defaultValue="subtasks" className="w-full">
            <TabsList className="w-full justify-start bg-muted/30 p-1 rounded-xl mb-6 h-auto border">
              <TabsTrigger value="subtasks" className="rounded-lg px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Sub-Objectives ({subIssues.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Activity Feed
              </TabsTrigger>
              <TabsTrigger value="notes" className="rounded-lg px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Intel Exchange ({notes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subtasks" className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Secondary Protocols</p>
                <Button size="sm" variant="outline" onClick={() => setIsAddSubIssueOpen(true)} className="h-7 text-[10px] font-bold uppercase tracking-widest">
                  New Objective
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {subIssues.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center gap-3 border border-dashed rounded-2xl bg-muted/10">
                    <div className="p-3 bg-background border rounded-full">
                      <Target className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Zero Secondary Protocol Detected</p>
                  </div>
                ) : (
                  subIssues.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/30 transition-all group shadow-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleSubIssueStatus(sub.id, sub.status?.id)}
                          className={cn(
                            "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all shadow-inner",
                            sub.status?.id === 2 ? "bg-primary border-primary text-white" : "bg-muted/10 hover:border-primary/40"
                          )}
                        >
                          {sub.status?.id === 2 && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                        <div className="flex flex-col gap-0.5">
                          <span className={cn("text-sm font-bold uppercase tracking-tight", sub.status?.id === 2 && "text-muted-foreground line-through")}>
                            {sub.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-muted-foreground/40">#{sub.id}</span>
                            <Badge variant="outline" className="text-[8px] font-bold h-4 px-1 uppercase tracking-widest border-transparent bg-muted/40">
                              {sub.status?.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground/40 hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => router.push(`/issue/${issue.id}?sub=${sub.id}`)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPendingDeleteSubIssueId(sub.id)} className="text-destructive gap-2 text-xs font-bold uppercase">
                              <Trash2 className="h-3.5 w-3.5" /> Purge Protocol
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 animate-in fade-in slide-in-from-top-2">
              {activities.length === 0 ? (
                <div className="py-20 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-30">Static Log History</div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-muted">
                  {activities.map((act) => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[19px] top-1 h-3 w-3 rounded-full bg-primary border-4 border-background ring-1 ring-primary/20 shadow-sm" />
                      <div className="bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                        <div className="flex gap-4 items-start">
                          <Avatar className="h-9 w-9 border-2 border-background shadow-sm shrink-0">
                            <AvatarImage src={`/upload/${act.actor?.avarta}`} />
                            <AvatarFallback className="text-[10px] font-bold bg-muted/20">{(act.actor?.dis_name || 'U')[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{act.title}</p>
                              <span className="text-[9px] font-bold text-muted-foreground/40">{new Date(act.created_on).toLocaleString()}</span>
                            </div>
                            <p 
                              className="text-sm font-medium leading-relaxed [&>strong]:text-primary [&>strong]:font-bold"
                              dangerouslySetInnerHTML={{ __html: act.activity }}
                            />
                            <div className="pt-2 flex items-center gap-2">
                              <div className="h-0.5 w-4 bg-primary/20 rounded-full" />
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">{act.actor?.dis_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-8 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-6">
                <div className="bg-card border shadow-sm rounded-2xl p-4 focus-within:ring-2 ring-primary/10 transition-all">
                  <Textarea
                    placeholder="Exchange tactical intelligence..."
                    className="border-none shadow-none focus-visible:ring-0 min-h-[120px] font-medium p-2 resize-none"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="flex justify-between items-center pt-4 border-t mt-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase">
                      <MessageSquare className="h-3 w-3" /> Encrypted Channel
                    </div>
                    <Button
                      size="sm"
                      className="h-8 gap-2 font-bold uppercase tracking-widest px-6"
                      onClick={handleAddNote}
                      disabled={submitting || !newNote.trim()}
                    >
                      {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Broadcast
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {notes.length === 0 ? (
                    <div className="py-12 text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">No intelligence shared</div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="flex gap-4 group">
                        <Avatar className="h-10 w-10 border shadow-sm shrink-0 mt-1">
                          <AvatarImage src={`/upload/${note.noter?.avarta}`} />
                          <AvatarFallback className="text-[10px] font-bold">{(note.noter?.disname || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-bold uppercase tracking-tight text-foreground/80">{note.noter?.disname}</span>
                            <span className="text-[9px] font-bold text-muted-foreground/30">{new Date(note.created_on).toLocaleString()}</span>
                          </div>
                          <div className="bg-muted/10 border p-5 rounded-2xl rounded-tl-none shadow-sm group-hover:bg-muted/20 transition-all">
                            <p className="text-sm leading-relaxed text-foreground/80">{note.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Tactical Properties Sidebar */}
        <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-24">
          <Card className="shadow-sm border rounded-2xl overflow-hidden">
            <CardHeader className="py-4 border-b bg-muted/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-background border rounded-lg">
                  <ActivityIcon className="h-3.5 w-3.5 text-primary" />
                </div>
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mission Diagnostics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Execution Progress Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Completion Status</p>
                    <p className="text-2xl font-black text-primary tracking-tighter">{issue.progress}%</p>
                  </div>
                </div>
                <Progress value={issue.progress} className="h-2 shadow-inner" />
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[0, 25, 50, 75, 100].map((p) => (
                    <Button
                      key={p}
                      variant={issue.progress === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateField('progress', p)}
                      className={cn(
                        "h-7 text-[9px] font-bold uppercase p-0 border shadow-none",
                        issue.progress === p ? "shadow-md" : "hover:bg-muted/50 border-muted"
                      )}
                    >
                      {p}%
                    </Button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-muted/60" />

              {/* Property Grid */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                    <CircleDot className="h-3 w-3 text-sky-500" /> Current State
                  </Label>
                  <Select value={String(issue.status?.id)} onValueChange={(v) => handleUpdateField('status', v)}>
                    <SelectTrigger className="h-10 text-[11px] font-bold uppercase tracking-widest border-muted shadow-none bg-muted/5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map(s => <SelectItem key={s.id} value={String(s.id)} className="text-[10px] font-bold uppercase">{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                    <Flag className="h-3 w-3 text-orange-500" /> Lethality / Priority
                  </Label>
                  <Select value={String(issue.priority?.id)} onValueChange={(v) => handleUpdateField('priority', v)}>
                    <SelectTrigger className="h-10 text-[11px] font-bold uppercase tracking-widest border-muted shadow-none bg-muted/5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => <SelectItem key={p.id} value={String(p.id)} className="text-[10px] font-bold uppercase">{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                    <Target className="h-3 w-3 text-purple-500" /> Operational Tracker
                  </Label>
                  <Select value={String(issue.tracker?.id)} onValueChange={(v) => handleUpdateField('tracker', v)}>
                    <SelectTrigger className="h-10 text-[11px] font-bold uppercase tracking-widest border-muted shadow-none bg-muted/5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {trackers.map(t => <SelectItem key={t.id} value={String(t.id)} className="text-[10px] font-bold uppercase">{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                    <Tag className="h-3 w-3 text-blue-500" /> Directive Label
                  </Label>
                  <Select value={String(issue.label?.id)} onValueChange={(v) => handleUpdateField('label', v)}>
                    <SelectTrigger className="h-10 text-[11px] font-bold uppercase tracking-widest border-muted shadow-none bg-muted/5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {labels.map(l => <SelectItem key={l.id} value={String(l.id)} className="text-[10px] font-bold uppercase">{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                    <User2 className="h-3 w-3 text-foreground/40" /> Active Assignee
                  </Label>
                  <Select value={issue.assignee?.id ? String(issue.assignee.id) : ''} onValueChange={(v) => handleUpdateField('assignee', v)}>
                    <SelectTrigger className="h-10 text-[11px] font-bold uppercase tracking-tight border-muted shadow-none bg-muted/5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-5 w-5 border shadow-sm">
                          <AvatarImage src={`/upload/${issue.assignee?.avarta}`} />
                          <AvatarFallback className="text-[7px] font-bold">{(issue.assignee?.dis_name || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <SelectValue placeholder="Unassigned Specialist" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((m) => {
                        const mId = String(m.user?.id || m.id || '');
                        return (
                          <SelectItem key={mId} value={mId}>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                              <Avatar className="h-5 w-5 border shrink-0">
                                <AvatarImage src={`/upload/${m.user?.avarta || m.avarta}`} />
                                <AvatarFallback className="text-[7px]">{(m.user?.dis_name || 'U')[0]}</AvatarFallback>
                              </Avatar>
                              {m.user?.dis_name || m.user?.email || m.email}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="h-px bg-muted/60" />

                {/* Timeline Management */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                      <CalendarPlus className="h-3 w-3 opacity-40" /> Start
                    </Label>
                    <DatePicker
                      selected={issue.start_date ? new Date(issue.start_date) : undefined}
                      onSelect={(v) => handleUpdateField('start_date', v)}
                      className="h-9 text-[10px] font-bold uppercase border-muted bg-muted/5 shadow-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                      <CalendarCheck className="h-3 w-3 opacity-40" /> Deadline
                    </Label>
                    <DatePicker
                      selected={issue.due_date ? new Date(issue.due_date) : undefined}
                      onSelect={(v) => handleUpdateField('due_date', v)}
                      className="h-9 text-[10px] font-bold uppercase border-muted bg-muted/5 shadow-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      <ConfirmActionDialog
        open={pendingDeleteSubIssueId !== null}
        onOpenChange={(open) => !open && setPendingDeleteSubIssueId(null)}
        title="Delete sub-issue?"
        description="This sub-issue will be permanently removed from the issue breakdown."
        confirmLabel="Delete sub-issue"
        onConfirm={() => {
          if (pendingDeleteSubIssueId === null) return
          return handleDeleteSubIssue(pendingDeleteSubIssueId)
        }}
      />
    </>
  );
};

export default IssueDetailPage;
