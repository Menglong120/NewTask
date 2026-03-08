'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
   BarChart3, Layers, BookOpen, Users, Search,
   ChevronRight, Activity, CircleDot, AlertCircle, ArrowUpRight, TrendingUp, Calendar, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const Chart = dynamic(() => import('react-apexcharts'), {
   ssr: false,
   loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5"><Loader2 className="h-6 w-6 animate-spin text-primary opacity-20" /></div>
});

interface Member { user: { id: string; first_name: string; last_name: string; avarta: string; dis_name: string; email: string; } }
interface StatusIssue { name: string; total_issues: string | number; }
interface PriorityIssue { name: string; total_issues: string | number; }
interface AssigneeIssue {
   assignee: { dis_name: string; email: string; mainissue: string; mainissueid: string; issuename: string; startdate: string; duedate: string; progress: string | number; role: { name: string; } };
   status: { name: string; };
}

const AnalyticPage = () => {
   const router = useRouter();
   const [projectId, setProjectId] = useState<string | null>(null);
   const [totalIssues, setTotalIssues] = useState(0);
   const [totalSubIssues, setTotalSubIssues] = useState(0);
   const [totalMembers, setTotalMembers] = useState(0);
   const [totalResources, setTotalResources] = useState(0);

   const [members, setMembers] = useState<Member[]>([]);
   const [performanceIssues, setPerformanceIssues] = useState<AssigneeIssue[]>([]);
   const [searchMember, setSearchMember] = useState('');
   const [loading, setLoading] = useState(true);

   const [statusChart, setStatusChart] = useState<any>(null);
   const [priorityChart, setPriorityChart] = useState<any>(null);
   const [monthChart, setMonthChart] = useState<any>(null);

   useEffect(() => {
      const id = localStorage.getItem('projectID');
      if (!id) router.push('/home');
      else setProjectId(id);
   }, [router]);

   useEffect(() => {
      if (!projectId) return;

      const loadData = async () => {
         try {
            setLoading(true);
            const [issueRes, memRes, resRes, statusRes, prioRes, perRes, monthRes] = await Promise.all([
               fetchApi(`/api/analyst/project/total/${projectId}`),
               fetchApi(`/api/projects/members/${projectId}?search&perpage=&page=`),
               fetchApi(`/api/projects/resources/${projectId}?search&perpage=&page=`),
               fetchApi(`/api/analyst/project/issue/status/${projectId}`),
               fetchApi(`/api/analyst/project/issue/priority/${projectId}`),
               fetchApi(`/api/analyst/project/issue/assignee/${projectId}`),
               fetchApi(`/api/analyst/project/issue/month/${projectId}`)
            ]);

            if (issueRes.result) {
               setTotalIssues(issueRes.data.total?.issue || 0);
               setTotalSubIssues(issueRes.data.total?.sub_issue || 0);
            }

            if (memRes.result) {
               setTotalMembers(memRes.data.paginate?.total || memRes.data.datas?.length || 0);
               setMembers(memRes.data.datas || []);
            }

            if (resRes.result) setTotalResources(resRes.data.datas?.length || 0);

            // Status Donut Chart
            if (statusRes.result && statusRes.data?.issue_status) {
               const issues: StatusIssue[] = statusRes.data.issue_status;
               setStatusChart({
                  series: issues.map(s => Number(s.total_issues)),
                  options: {
                     labels: issues.map(s => s.name),
                     chart: { type: 'donut', background: 'transparent' },
                     colors: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'],
                     legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
                     dataLabels: { enabled: false },
                     stroke: { width: 0 },
                     theme: { mode: 'dark' },
                     plotOptions: { pie: { donut: { size: '75%' } } }
                  }
               });
            }

            // Priority Bar Chart
            if (prioRes.result && prioRes.data?.issue_priority) {
               const priorities: PriorityIssue[] = prioRes.data.issue_priority;
               setPriorityChart({
                  series: [{ name: 'Issues', data: priorities.map(p => Number(p.total_issues)) }],
                  options: {
                     chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
                     xaxis: {
                        categories: priorities.map(p => p.name),
                        labels: { style: { colors: '#64748b' } },
                        axisBorder: { show: false },
                        axisTicks: { show: false }
                     },
                     yaxis: { labels: { style: { colors: '#64748b' } } },
                     grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
                     colors: ['#f59e0b'],
                     plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: '50%' } },
                     theme: { mode: 'dark' },
                     dataLabels: { enabled: false }
                  }
               });
            }

            // Member Performance
            if (perRes.result && perRes.data?.issue) setPerformanceIssues(perRes.data.issue);

            // Monthly Trend Chart
            if (monthRes.result && monthRes.data) {
               let monthsSet = new Set<string>();
               monthRes.data.forEach((stu: any) => { if (stu.status?.issue) stu.status.issue.forEach((issue: any) => monthsSet.add(issue.month)); });
               let months = Array.from(monthsSet).sort();

               let seriesDataMap = new Map<string, number[]>();
               monthRes.data.forEach((stu: any) => {
                  let statusName = stu.status.name;
                  if (!seriesDataMap.has(statusName)) seriesDataMap.set(statusName, new Array(months.length).fill(0));
                  if (stu.status?.issue) stu.status.issue.forEach((issue: any) => {
                     let monthIndex = months.indexOf(issue.month);
                     seriesDataMap.get(statusName)![monthIndex] = parseInt(issue.total_issues) || 0;
                  });
               });

               setMonthChart({
                  series: Array.from(seriesDataMap, ([name, data]) => ({ name, data })),
                  options: {
                     chart: { type: 'bar', toolbar: { show: false }, stacked: true, background: 'transparent' },
                     plotOptions: { bar: { horizontal: false, columnWidth: '35%', borderRadius: 6 } },
                     colors: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'],
                     xaxis: { categories: months, labels: { style: { colors: '#64748b' } }, axisBorder: { show: false }, axisTicks: { show: false } },
                     yaxis: { labels: { style: { colors: '#64748b' } } },
                     grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
                     legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#94a3b8' } },
                     theme: { mode: 'dark' },
                     dataLabels: { enabled: false }
                  }
               });
            }
         } catch (error) { console.error(error); }
         finally { setLoading(false); }
      };
      loadData();
   }, [projectId]);

   const filteredPerformances = useMemo(() => {
      if (!searchMember) return performanceIssues;
      const lower = searchMember.toLowerCase();
      return performanceIssues.filter(mem => {
         const displayName = (mem.assignee.dis_name || mem.assignee.email).toLowerCase();
         const roleName = mem.assignee.role?.name?.toLowerCase() || '';
         const category = mem.assignee.mainissue?.toLowerCase() || '';
         const issueName = mem.assignee.issuename?.toLowerCase() || '';
         const statusName = mem.status?.name?.toLowerCase() || '';
         return displayName.includes(lower) || roleName.includes(lower) || category.includes(lower) || issueName.includes(lower) || statusName.includes(lower);
      });
   }, [searchMember, performanceIssues]);

   const goToIssueDetail = (mainissueid: string) => {
      localStorage.setItem("categoryID", mainissueid);
      router.push('/issuescategory');
   };

   if (loading) return (
      <div className="flex grow flex-col items-center justify-center py-32 space-y-4">
         <Loader2 className="h-10 w-10 animate-spin text-primary" />
         <p className="text-muted-foreground font-medium anonymous">Synthesizing workspace insights...</p>
      </div>
   );

   return (
      <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

         {/* Header */}
         <Card className="border-white/5 bg-card overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
                     <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Workspace</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground">Global Analytics</span>
                     </div>
                     <CardTitle className="text-2xl font-bold">Workspace Health Report</CardTitle>
                  </div>
               </div>
               <Badge variant="outline" className="h-9 px-4 bg-white/5 border-white/10 text-muted-foreground font-black uppercase tracking-widest text-[10px] gap-2">
                  <Calendar className="h-3.5 w-3.5" /> Updated: {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
               </Badge>
            </CardHeader>
         </Card>

         {/* KPI Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
               { label: 'Cumulative Issues', value: totalIssues, icon: Layers, color: 'text-sky-400', bg: 'bg-sky-500/10' },
               { label: 'Secondary Tasks', value: totalSubIssues, icon: AlertCircle, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
               { label: 'Project Members', value: totalMembers, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
               { label: 'Documentation', value: totalResources, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
            ].map((stat, i) => (
               <Card key={i} className="group border-white/5 bg-card hover:bg-white/[0.04] transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/[0.03] rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                  <CardContent className="p-6 relative z-10 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className={cn("p-3 rounded-xl ring-1 ring-white/5 shadow-inner transition-transform group-hover:scale-105", stat.bg, stat.color)}>
                           <stat.icon className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="mt-6">
                        <div className="text-3xl font-black text-foreground">{stat.value}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{stat.label}</div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-white/5 bg-card overflow-hidden h-[420px] flex flex-col relative">
               <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
               <CardHeader className="pb-0 shrink-0">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <CircleDot className="h-4 w-4 text-primary" /> Global Status Distribution
                  </CardTitle>
               </CardHeader>
               <CardContent className="flex-1 flex items-center justify-center pt-6">
                  {statusChart ? (
                     <Chart options={statusChart.options as any} series={statusChart.series} type="donut" width="100%" height={320} />
                  ) : (
                     <div className="flex flex-col items-center justify-center text-muted-foreground opacity-30">
                        <Activity className="h-12 w-12 mb-3" />
                        <p className="font-bold text-sm uppercase">Data Unavailable</p>
                     </div>
                  )}
               </CardContent>
            </Card>

            <Card className="border-white/5 bg-card overflow-hidden h-[420px] flex flex-col relative">
               <div className="absolute bottom-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
               <CardHeader className="pb-0 shrink-0">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <AlertCircle className="h-4 w-4 text-amber-500" /> Complexity Spread
                  </CardTitle>
               </CardHeader>
               <CardContent className="flex-1 pt-6 px-2">
                  {priorityChart ? (
                     <Chart options={priorityChart.options as any} series={priorityChart.series} type="bar" height={320} />
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                        <Activity className="h-12 w-12 mb-3" />
                        <p className="font-bold text-sm uppercase">Priority Data missing</p>
                     </div>
                  )}
               </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-white/5 bg-card overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.01] to-transparent pointer-events-none" />
               <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <Activity className="h-4 w-4 text-emerald-500" /> Multi-Month Trend Analysis
                  </CardTitle>
               </CardHeader>
               <CardContent className="h-[380px] pb-6">
                  {monthChart ? (
                     <Chart options={monthChart.options as any} series={monthChart.series} type="bar" height="100%" />
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-muted-foreground opacity-30">
                        <Activity className="h-12 w-12 mb-3" />
                        <p className="font-bold text-sm uppercase">Seasonal Trends Loading...</p>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>

         {/* Member Performance Section */}
         <Card className="border-white/5 bg-card overflow-hidden">
            <CardHeader className="bg-white/[0.01] border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-5">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-rose-500" /> Performance Tracking & Assignments
               </CardTitle>
               <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Filter by name, role, or category..."
                     className="pl-10 h-10 bg-background border-white/10 text-foreground text-sm font-medium"
                     value={searchMember}
                     onChange={(e) => setSearchMember(e.target.value)}
                  />
               </div>
            </CardHeader>
            <div className="w-full overflow-x-auto">
               <Table>
                  <TableHeader className="bg-[#0a0a0a]">
                     <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team Member</TableHead>
                        <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Workspace Role</TableHead>
                        <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Target</TableHead>
                        <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Velocity</TableHead>
                        <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredPerformances.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={6} className="py-20 text-center">
                              <Users className="h-10 w-10 mx-auto opacity-10 mb-3" />
                              <p className="text-muted-foreground font-medium text-sm">No member rankings found matching your query.</p>
                           </TableCell>
                        </TableRow>
                     ) : filteredPerformances.map((mem, i) => (
                        <TableRow key={i} onClick={() => goToIssueDetail(mem.assignee.mainissueid)} className="border-white/5 hover:bg-white/[0.01] group/row transition-all cursor-pointer">
                           <TableCell className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                 <Avatar className="h-10 w-10 ring-2 ring-background ring-offset-2 ring-offset-white/5 group-hover/row:ring-primary/40 transition-all">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                       {(mem.assignee.dis_name || mem.assignee.email)[0]}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div className="flex flex-col">
                                    <span className="font-bold text-sm text-foreground group-hover/row:text-primary transition-colors">{mem.assignee.dis_name || 'Anonymous User'}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">{mem.assignee.email}</span>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="py-4 px-6">
                              <Badge variant="outline" className="px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter bg-indigo-500/5 text-indigo-400 border-indigo-500/20">
                                 {mem.assignee.role?.name || 'Observer'}
                              </Badge>
                           </TableCell>
                           <TableCell className="py-4 px-6">
                              <div className="flex flex-col gap-1 max-w-[200px]">
                                 <span className="text-sm font-bold text-foreground truncate">{mem.assignee.issuename}</span>
                                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate">{mem.assignee.mainissue}</span>
                              </div>
                           </TableCell>
                           <TableCell className="py-4 px-6">
                              <div className="flex items-center gap-3 justify-center max-w-[120px] mx-auto">
                                 <Progress value={Number(mem.assignee.progress)} className="h-1.5 flex-1" />
                                 <span className="text-xs font-black text-foreground/70 w-8">{mem.assignee.progress}%</span>
                              </div>
                           </TableCell>
                           <TableCell className="py-4 px-6 text-right">
                              <Badge className={cn(
                                 "px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                                 mem.status?.name === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    mem.status?.name === 'In Progress' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                                       'bg-white/5 text-muted-foreground border border-white/10'
                              )}>
                                 {mem.status?.name || 'Unknown'}
                              </Badge>
                           </TableCell>
                           <TableCell className="text-right pr-6">
                              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/row:opacity-100 group-hover/row:translate-x-1 transition-all" />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </Card>
      </div>
   );
};

export default AnalyticPage;
