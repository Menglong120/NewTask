'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import {
  BarChart3,
  Users,
  Layers,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Database,
  Loader2,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { AnalyticsData } from '@/types/analytics';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5"><Loader2 className="h-6 w-6 animate-spin text-primary opacity-20" /></div>
});

const ProjectAnalyticsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [
          projectRes,
          totalRes,
          memberRes,
          resourceRes,
          statusRes,
          priorityRes,
          assigneeRes,
          monthRes
        ] = await Promise.all([
          fetchApi(`/api/projects`),
          fetchApi(`/api/analyst/project/total/${id}`),
          fetchApi(`/api/projects/members/${id}?search&perpage=&page=`),
          fetchApi(`/api/projects/resources/${id}?search&perpage=&page=`),
          fetchApi(`/api/analyst/project/issue/status/${id}`),
          fetchApi(`/api/analyst/project/issue/priority/${id}`),
          fetchApi(`/api/analyst/project/issue/assignee/${id}`),
          fetchApi(`/api/analyst/project/issue/month/${id}`)
        ]);

        if (projectRes.result) {
          const project = projectRes.data.datas.find((p: any) => p.id === Number(id));
          if (project) setProjectName(project.name);
        }

        setData({
          total: totalRes.data.total,
          members: memberRes.data.paginate.total,
          resources: resourceRes.data.datas.length,
          statusData: statusRes.data.issue_status,
          priorityData: priorityRes.data.issue_priority,
          assigneeData: assigneeRes.data.issue || [],
          monthlyData: monthRes.data
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAnalytics();
  }, [id]);

  const statusChart = useMemo(() => {
    if (!data) return null;
    return {
      series: data.statusData.map(s => Number(s.total_issues)),
      options: {
        chart: { type: 'donut', background: 'transparent' },
        labels: data.statusData.map(s => s.name),
        colors: ['#6366f1', '#10b981', '#f43f5e', '#64748b', '#0ea5e9'],
        legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
        dataLabels: { enabled: false },
        stroke: { width: 0 },
        theme: { mode: 'dark' },
        plotOptions: { pie: { donut: { size: '75%' } } }
      }
    };
  }, [data]);

  const priorityChart = useMemo(() => {
    if (!data) return null;
    return {
      series: [{ name: 'Issues', data: data.priorityData.map(p => Number(p.total_issues)) }],
      options: {
        chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
        xaxis: {
          categories: data.priorityData.map(p => p.name),
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
    };
  }, [data]);

  if (loading) return (
    <div className="flex grow flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium anonymous">Computing project metrics...</p>
    </div>
  );

  if (!data) return <div className="p-10 text-center text-red-400 font-bold bg-[#121212] rounded-[2rem] border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">Failed to load analytics.</div>;

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
                <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => window.location.href = '/projects'}>Workspace</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{projectName || 'Project'}</span>
              </div>
              <CardTitle className="text-2xl font-bold">Insight Center</CardTitle>
            </div>
          </div>
          <div className="bg-white/5 px-4 h-9 flex items-center gap-2 rounded-xl border border-white/10 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <Calendar className="h-3.5 w-3.5 opacity-50" /> Sync: {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Issues', value: data.total.issue, icon: Layers, color: 'text-sky-400', bg: 'bg-sky-500/10' },
          { label: 'Sub Issues', value: data.total.sub_issue, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Active Team', value: data.members, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Project Assets', value: data.resources, icon: Database, color: 'text-rose-400', bg: 'bg-rose-500/10' }
        ].map((stat, i) => (
          <Card key={i} className="group border-white/5 bg-card hover:bg-white/[0.04] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/[0.03] rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            <CardContent className="p-6 relative z-10 flex flex-col justify-between">
              <div className="flex justify-between items-start w-full">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/5 bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Issue Status Flow</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pb-10 flex items-center justify-center">
            {statusChart && (
              <Chart options={statusChart.options as any} series={statusChart.series} type="donut" width="100%" />
            )}
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card overflow-hidden relative">
          <div className="absolute bottom-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pb-6">
            {priorityChart && (
              <Chart options={priorityChart.options as any} series={priorityChart.series} type="bar" height="100%" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card className="border-white/5 bg-card overflow-hidden">
        <CardHeader className="bg-white/[0.01] border-b border-white/5 py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Active Assignees & Performance
          </CardTitle>
        </CardHeader>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#0a0a0a]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[200px]">Assignee</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Issue</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Completion</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right w-[150px]">Current Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.assigneeData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <Users className="h-10 w-10 mx-auto opacity-10 mb-3" />
                    <p className="text-muted-foreground font-medium text-sm">No task assignments detected for this project.</p>
                  </TableCell>
                </TableRow>
              ) : data.assigneeData.map((mem, i) => (
                <TableRow key={i} className="border-white/5 hover:bg-white/[0.01] group/row transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-background">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                          {(mem.assignee.dis_name || mem.assignee.email)[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">{mem.assignee.dis_name || 'Legacy User'}</span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{mem.assignee.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="outline" className="px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter bg-indigo-500/5 text-indigo-400 border-indigo-500/20">
                      {mem.assignee.role.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <span className="text-sm font-bold text-foreground truncate">{mem.assignee.issuename}</span>
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate">{mem.assignee.mainissue}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Progress value={mem.assignee.progress} className="h-1.5 flex-1" />
                      <span className="text-xs font-black text-foreground/70 w-8">{mem.assignee.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <Badge className={cn(
                      "px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                      mem.status.name === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        mem.status.name === 'In Progress' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          'bg-white/5 text-muted-foreground border border-white/10'
                    )}>
                      {mem.status.name}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {data.assigneeData.length > 5 && (
          <CardFooter className="bg-white/[0.01] border-t border-white/5 py-3 flex justify-center">
            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">View Entire Workspace Team</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ProjectAnalyticsPage;
