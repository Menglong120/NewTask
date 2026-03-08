'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  Plus, Search, ChevronRight, MoreHorizontal, LayoutGrid,
  FolderOpen, CircleDot, Flag, Target, Tag, UserCircle,
  Calendar, Clock, Loader2, PlayCircle, CheckCircle2, ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Issue {
  id: number;
  name: string;
  description: string;
  start_date: string;
  due_date: string;
  estimated_date: string;
  progress: number;
  status: { id: number; name: string; title?: string };
  priority: { id: number; name: string; title?: string };
  tracker: { id: number; name: string; title?: string };
  label: { id: number; name: string; title?: string };
  assignee: {
    id: string;
    email: string;
    dis_name: string;
    status: number;
    user?: { id: string; display_name: string; avarta: string; email: string; }
  };
}

const IssuesCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dropdown data options
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [trackers, setTrackers] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoryAndIssues = async () => {
      try {
        setLoading(true);
        const [cateRes, issuesRes] = await Promise.all([
          fetchApi(`/api/category/${id}`),
          fetchApi(`/api/category/issues/${id}?search=${search}&page=&perpage=`)
        ]);

        let projId = null;

        if (cateRes.result) {
          setCategoryName(cateRes.data.category?.name || cateRes.data.name);
          setProjectName(cateRes.data.project?.name);
          projId = cateRes.data.project?.id;
        }

        if (issuesRes.result) {
          setIssues(issuesRes.data.issues?.datas || issuesRes.data.issues || []);
        }

        if (projId) {
          const [statusRes, priorityRes, trackerRes, labelRes, memberRes] = await Promise.all([
            fetchApi(`/api/projects/issue/statuses/${projId}`),
            fetchApi(`/api/projects/issue/priorities/${projId}`),
            fetchApi(`/api/projects/issue/trackers/${projId}`),
            fetchApi(`/api/projects/issue/labels/${projId}`),
            fetchApi(`/api/projects/members/${projId}?search=&page=&perpage=`)
          ]);

          if (statusRes.result) setStatuses(statusRes.data.statuses);
          if (priorityRes.result) setPriorities(priorityRes.data.priorities);
          if (trackerRes.result) setTrackers(trackerRes.data.trackers);
          if (labelRes.result) setLabels(labelRes.data.labels);
          if (memberRes.result) setMembers(memberRes.data.datas || memberRes.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoryAndIssues();
  }, [id, search]);

  const getAssigneeName = (assignee: any) => {
    if (!assignee) return 'Assignee';
    if (assignee.user) return assignee.user.display_name || assignee.user.email || 'Assignee';
    if (assignee.email) return assignee.status === 1 ? (!assignee.dis_name ? assignee.email : assignee.dis_name) : assignee.email;
    return 'Assignee';
  };

  const handleUpdateIssueField = async (issueId: number, field: string, valueId: string | number) => {
    Swal.fire({ icon: 'info', title: 'Update triggered', text: `Field ${field} selected ${valueId}`, toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* Header & Breadcrumb */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Workspace</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{projectName || 'Project'}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">{categoryName || 'Category'}</span>
              </div>
              <CardTitle className="text-2xl font-bold">Issue Directory</CardTitle>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter category tasks..."
                className="pl-10 h-10 border-white/10 bg-background text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="h-10 gap-2 font-bold bg-primary shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> New Issue
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Issues List Container */}
      <Card className="border-white/5 bg-card min-h-[500px] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
        <CardContent className="p-6 relative z-10 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">Indexing Data...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">Zero Backlog</h3>
              <p className="text-muted-foreground max-w-xs font-medium">This category hasn't been populated with issues yet. Ready to start?</p>
            </div>
          ) : (
            issues.map(issue => (
              <div key={issue.id} className="group relative bg-[#0a0a0a]/50 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all flex flex-col xl:flex-row gap-4 xl:gap-8 xl:items-center">

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                    <span className="font-bold text-foreground text-base truncate selection:bg-primary/30" title={issue.name}>{issue.name}</span>
                  </div>
                  <div className="flex items-center gap-4 pl-11">
                    <Progress value={issue.progress || 0} className="h-1.5 flex-1 max-w-[240px]" />
                    <span className="text-[11px] font-black text-muted-foreground/80 uppercase">{issue.progress || 0}% Complete</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pl-11 xl:pl-0">

                  {/* Status Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-8 px-3 gap-2 text-[11px] font-bold bg-white/5 border-white/5 hover:border-primary/20 hover:bg-white/10">
                        <CircleDot className="h-3 w-3 text-sky-400" />
                        {issue.status?.name || 'Status'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-card border-white/10 text-foreground">
                      <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {statuses.map(s => (
                        <DropdownMenuItem key={s.id} onClick={() => handleUpdateIssueField(issue.id, 'status', s.id)} className="text-xs font-bold focus:bg-primary/10 focus:text-primary cursor-pointer">
                          {s.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Priority Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-8 px-3 gap-2 text-[11px] font-bold bg-white/5 border-white/5 hover:border-orange-500/20 hover:bg-white/10">
                        <Flag className="h-3 w-3 text-orange-500" />
                        {issue.priority?.name || 'Priority'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-card border-white/10">
                      <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Set Priority</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {priorities.map(p => (
                        <DropdownMenuItem key={p.id} onClick={() => handleUpdateIssueField(issue.id, 'priority', p.id)} className="text-xs font-bold focus:bg-orange-500/10 focus:text-orange-500 cursor-pointer">
                          {p.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Badge variant="secondary" className="h-8 px-3 gap-2 bg-white/5 text-muted-foreground border-transparent">
                    <Target className="h-3 w-3 opacity-50" /> {issue.tracker?.name || 'General'}
                  </Badge>

                  <Badge variant="outline" className="h-8 px-3 gap-2 bg-transparent border-white/5 text-muted-foreground/80">
                    <Tag className="h-3 w-3 opacity-40" /> {issue.label?.name || 'None'}
                  </Badge>

                  <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-1">
                    <Avatar className="h-7 w-7 ring-2 ring-background ring-offset-1 ring-offset-white/5">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                        {(issue.assignee?.dis_name || issue.assignee?.email || 'A')[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/40 border-l border-white/10 pl-4">
                    <div className="flex items-center gap-1.5" title="Timeline Start">
                      <PlayCircle className="h-3.5 w-3.5" />
                      <span className="group-hover:text-muted-foreground transition-colors">{issue.start_date ? new Date(issue.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '--'}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Execution Deadline">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="group-hover:text-muted-foreground transition-colors">{issue.due_date ? new Date(issue.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '--'}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10 ml-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IssuesCategoryPage;
