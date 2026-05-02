'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  Plus, Search, ChevronRight, ChevronDown, CircleDot, Flag, Target, Tag,
  Loader2, CheckCircle2, ClipboardList, Trash2,
  CalendarPlus, CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/datepicker';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import IssueKanbanBoard from '@/components/IssueKanbanBoard';
import IssueDetailDrawer from '@/components/IssueDetailDrawer';
import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { Issue, SubIssue } from '@/types/issue';
import { ItemState, Member } from '@/types/project';
import { IssueDialog } from './dialog/dialog';

const ProjectIssuesPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [expandedIssues, setExpandedIssues] = useState<Record<number, boolean>>({});
  const [projectId, setProjectId] = useState<number | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pendingDeleteIssueId, setPendingDeleteIssueId] = useState<number | null>(null);

  // Dropdown data options
  const [statuses, setStatuses] = useState<ItemState[]>([]);
  const [priorities, setPriorities] = useState<ItemState[]>([]);
  const [trackers, setTrackers] = useState<ItemState[]>([]);
  const [labels, setLabels] = useState<ItemState[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({
    name: '',
    tracker_id: '',
    status_id: '',
    priority_id: '',
    label_id: '',
    assignee_id: '',
    start_date: undefined as Date | undefined,
    due_date: undefined as Date | undefined,
    description: ''
  });

  const fetchCategoryAndIssues = React.useCallback(async () => {
    try {
      setLoading(true);
      const [projectRes, issuesRes] = await Promise.all([
        fetchApi(`/api/projects`),
        fetchApi(`/api/projects/issues/${id}?search=${search}&page=&perpage=`)
      ]);

      if (projectRes.result) {
        const project = projectRes.data?.datas?.find((p: any) => p.id === Number(id));
        if (project) setProjectName(project.name);
      }

      if (issuesRes.result) {
        const baseIssues = issuesRes.data.issues?.datas || issuesRes.data.issues || issuesRes.data || [];
        // Fetch sub-issues for each issue
        const issuesWithSubs = await Promise.all(baseIssues.map(async (issue: Issue) => {
          const subRes = await fetchApi(`/api/sub/issues/${issue.id}?search=&page=1&perpage=`);
          return {
            ...issue,
            subIssues: subRes.result ? (subRes.data.sub_issues?.datas || subRes.data.sub_issues || []) : []
          };
        }));
        setIssues(issuesWithSubs);
      }

      setProjectId(Number(id));
      const [statusRes, priorityRes, trackerRes, labelRes, memberRes] = await Promise.all([
        fetchApi(`/api/projects/issue/statuses/${id}`),
        fetchApi(`/api/projects/issue/priorities/${id}`),
        fetchApi(`/api/projects/issue/trackers/${id}`),
        fetchApi(`/api/projects/issue/labels/${id}`),
        fetchApi(`/api/projects/members/${id}?search=&page=&perpage=`)
      ]);

      if (statusRes.result) setStatuses(statusRes.data.statuses || []);
      if (priorityRes.result) setPriorities(priorityRes.data.priorities || []);
      if (trackerRes.result) setTrackers(trackerRes.data.trackers || []);
      if (labelRes.result) setLabels(labelRes.data.labels || []);
      if (memberRes.result) setMembers(memberRes.data.datas || memberRes.data || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, search]);

  useEffect(() => {
    if (id) fetchCategoryAndIssues();
  }, [id, fetchCategoryAndIssues]);

  const refreshData = () => fetchCategoryAndIssues();

  const handleUpdateIssueField = async (issueId: number, field: string, valueId: string | number | Date | undefined) => {
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
      if (!endpoint) return;

      const isDate = field === 'start_date' || field === 'due_date';
      const finalValue = isDate && valueId instanceof Date ? format(valueId, 'yyyy-MM-dd HH:mm:ss') : valueId;
      const payload = isDate ? { date: finalValue } : { item: valueId };

      const res = await fetchApi(`/api/issue/edit/${endpoint}/${issueId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.result) {
        await fetchApi(`/api/issue/activity/${issueId}`, {
          method: 'POST',
          body: JSON.stringify({
            title: `Update ${field.charAt(0).toUpperCase() + field.slice(1)}`,
            activity: `Updated ${field} of issue`
          })
        });

        Swal.fire({ icon: 'success', title: 'Updated!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        refreshData();
      } else {
        Swal.fire({ icon: 'error', title: 'Failed', text: res.msg || 'Update failed', background: '#121212', color: '#fff' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteIssue = async (issueId: number) => {
    try {
      const res = await fetchApi(`/api/issue/${issueId}`, { method: 'DELETE' });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Deleted!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        refreshData();
      } else {
        Swal.fire({ icon: 'error', title: 'Failed', text: res.msg || 'Delete failed', background: '#121212', color: '#fff' });
      }
    } catch (e) { }
    finally { setPendingDeleteIssueId(null); }
  };

  const handleCreateIssue = async () => {
    if (!newIssue.name || !newIssue.tracker_id || !newIssue.status_id || !newIssue.priority_id) {
      return Swal.fire({ icon: 'error', title: 'Check Mandatory Fields', text: 'Name, Tracker, Status and Priority are required.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    }
    try {
      setSubmitting(true);
      const payload = {
        name: newIssue.name,
        description: newIssue.description || '',
        tracker_id: Number(newIssue.tracker_id),
        status_id: Number(newIssue.status_id),
        priority_id: Number(newIssue.priority_id),
        label_id: newIssue.label_id ? Number(newIssue.label_id) : null,
        assignee: newIssue.assignee_id ? Number(newIssue.assignee_id) : null,
        start_date: newIssue.start_date ? format(newIssue.start_date, 'yyyy-MM-dd HH:mm:ss') : null,
        due_date: newIssue.due_date ? format(newIssue.due_date, 'yyyy-MM-dd HH:mm:ss') : null,
      };
      const res = await fetchApi(`/api/projects/issue/${id}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.result) {
        await fetchApi(`/api/issue/activity/${res.data?.id || res.data?.insertId || 0}`, {
          method: 'POST',
          body: JSON.stringify({
            title: 'Issue Action',
            activity: `created an new issue - ${newIssue.name}`
          })
        });
        console.log('res', res);

        setIsCreateModalOpen(false);
        setNewIssue({ name: '', tracker_id: '', status_id: '', priority_id: '', label_id: '', assignee_id: '', start_date: undefined, due_date: undefined, description: '' });
        Swal.fire({ icon: 'success', title: 'Issue Created!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        refreshData();
      } else {
        Swal.fire({ title: 'Error', text: res.msg || 'Failed to create issue', icon: 'error', background: '#121212', color: '#fff' });
      }
    } catch (e: any) {
      Swal.fire({ title: 'Network Error', text: e?.message || 'Could not reach the server. Is the backend running?', icon: 'error', background: '#121212', color: '#fff' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground  tracking-widest">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 truncate">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground truncate">{projectName || 'Project'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground normal-case">Issues</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              placeholder="Search issues..."
              className="pl-9 h-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Tabs value={viewMode} onValueChange={(val: any) => setViewMode(val)} className="w-[150px]">
            <TabsList className="grid w-full grid-cols-2 h-9 p-1">
              <TabsTrigger value="list" className="text-[10px]  font-bold">List</TabsTrigger>
              <TabsTrigger value="board" className="text-[10px]  font-bold">Board</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="gap-2 h-9 shadow-sm">
            <Plus className="h-4 w-4" /> New Issue
          </Button>
        </div>
      </div>

      {/* Issues Content Container */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-xs font-bold  tracking-widest">Loading directory...</p>
          </div>
        ) : issues.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/10 py-32 rounded-2xl flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-4 rounded-full bg-background border shadow-sm">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">No issues found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">This project is currently empty. <br />Create a new issue to begin tracking your objectives.</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Initialize Mission
            </Button>
          </Card>
        ) : viewMode === 'board' ? (
          <IssueKanbanBoard
            issues={issues}
            statuses={statuses}
            priorities={priorities}
            onUpdateIssue={handleUpdateIssueField}
            onDelete={(issueId) => setPendingDeleteIssueId(issueId)}
            onViewDetail={(issueId) => router.push(`/issue/${issueId}`)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {issues.map(issue => (
              <React.Fragment key={issue.id}>
                <div
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setIsDrawerOpen(true);
                  }}
                  className="group relative bg-card border shadow-sm hover:shadow-md hover:border-primary/30 p-5 rounded-xl transition-all duration-300 flex flex-col lg:flex-row gap-6 lg:items-center cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 rounded-lg transition-all",
                          expandedIssues[issue.id] ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedIssues(prev => ({ ...prev, [issue.id]: !prev[issue.id] }));
                        }}
                      >
                        {expandedIssues[issue.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground/60  tracking-widest">#{issue.id}</span>
                        <h3 className="font-bold text-lg tracking-tight truncate group-hover:text-primary transition-colors">
                          {issue.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pl-12">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${issue.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-primary min-w-[70px] text-right">
                          {issue.progress || 0}% Done
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 pl-12 lg:pl-0 w-full lg:w-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* State Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 gap-2 text-[10px] font-bold  tracking-widest border shadow-none bg-muted/20">
                            <CircleDot className="h-3.5 w-3.5 text-sky-500" />
                            {issue.status?.name || 'Status'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel className="text-[9px]  font-bold text-muted-foreground px-3">Update Status</DropdownMenuLabel>
                          {statuses.map(s => (
                            <DropdownMenuItem key={s.id} onClick={() => handleUpdateIssueField(issue.id, 'status', s.id)} className="text-[10px] font-bold  py-2">
                              {s.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Labels Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 gap-2 text-[10px] font-bold  tracking-widest border shadow-none bg-muted/20">
                            <Tag className="h-3.5 w-3.5 text-blue-500" />
                            {issue.label?.name || 'Label'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel className="text-[9px]  font-bold text-muted-foreground px-3">Update Label</DropdownMenuLabel>
                          {labels.map(l => (
                            <DropdownMenuItem key={l.id} onClick={() => handleUpdateIssueField(issue.id, 'label', l.id)} className="text-[10px] font-bold  py-2">
                              {l.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Priority Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-3 gap-2 text-[10px] font-bold  tracking-widest border shadow-none bg-muted/20">
                            <Flag className={cn("h-3.5 w-3.5", issue.priority?.name?.toLowerCase().includes('high') ? "text-red-500" : "text-orange-500")} />
                            {issue.priority?.name || 'Priority'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel className="text-[9px]  font-bold text-muted-foreground px-3">Update Priority</DropdownMenuLabel>
                          {priorities.map(p => (
                            <DropdownMenuItem key={p.id} onClick={() => handleUpdateIssueField(issue.id, 'priority', p.id)} className="text-[10px] font-bold  py-2">
                              {p.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4 lg:border-l lg:pl-6">
                      <Avatar className="h-8 w-8 border shadow-sm shrink-0">
                        <AvatarImage src={`/upload/${issue.assignee?.user?.avarta || issue.assignee?.avarta}`} />
                        <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                          {(issue.assignee?.user?.first_name || issue.assignee?.user?.dis_name || issue.assignee?.user?.display_name || issue.assignee?.dis_name || 'U')[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex items-center gap-3">
                        <DatePicker
                          selected={issue.start_date ? new Date(issue.start_date) : undefined}
                          onSelect={(value) => handleUpdateIssueField(issue.id, 'start_date', value)}
                          placeholder="Start"
                          dateFormat="PP"
                          className="w-[110px] h-8 px-2 text-[10px] font-bold "
                        />
                        <DatePicker
                          selected={issue.due_date ? new Date(issue.due_date) : undefined}
                          onSelect={(value) => handleUpdateIssueField(issue.id, 'due_date', value)}
                          placeholder="Due"
                          dateFormat="PP"
                          className="w-[110px] h-8 px-2 text-[10px] font-bold "
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPendingDeleteIssueId(issue.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Sub-issues Expansion */}
                {expandedIssues[issue.id] && issue.subIssues && issue.subIssues.length > 0 && (
                  <div className="ml-12 mt-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    {issue.subIssues.map(sub => (
                      <div key={sub.id} className="bg-muted/30 border-l-2 border-primary/20 hover:border-primary p-3 rounded-r-lg flex items-center justify-between transition-all ml-4 py-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black text-muted-foreground/40 shrink-0">#{sub.id}</span>
                          <div>
                            <p className="text-xs font-bold text-foreground/90  tracking-tight">{sub.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge variant="outline" className="text-[8px] font-bold h-4 px-1.5  tracking-widest bg-background">
                                {sub.status?.name}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-muted rounded-full">
                                  <div className="h-full bg-primary/60" style={{ width: `${sub.progress || 0}%` }} />
                                </div>
                                <span className="text-[8px] font-bold text-muted-foreground/60">{sub.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => router.push(`/issue/${issue.id}?sub=${sub.id}`)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <IssueDialog
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        newIssue={newIssue}
        setNewIssue={setNewIssue}
        trackers={trackers}
        statuses={statuses}
        priorities={priorities}
        labels={labels}
        members={members}
        submitting={submitting}
        handleCreateIssue={handleCreateIssue}
      />


      <IssueDetailDrawer
        issueId={selectedIssueId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={refreshData}
        statuses={statuses}
        priorities={priorities}
        trackers={trackers}
        labels={labels}
      />
      <ConfirmActionDialog
        open={pendingDeleteIssueId !== null}
        onOpenChange={(open) => !open && setPendingDeleteIssueId(null)}
        title="Delete issue?"
        description="Permanent action. This issue record cannot be recovered."
        confirmLabel="Delete issue"
        onConfirm={() => {
          if (pendingDeleteIssueId === null) return
          return handleDeleteIssue(pendingDeleteIssueId)
        }}
      />
    </div>
  );
};

export default ProjectIssuesPage;
