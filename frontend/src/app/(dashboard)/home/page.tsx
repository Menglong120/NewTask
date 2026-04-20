'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { 
  FolderOpen, LayoutDashboard, PlayCircle, CheckCircle2, 
  Activity, Clock as ClockIcon, TrendingUp, Layers, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Project {
  id: number;
  name: string;
  status: {
    title: string;
    updated_on: string;
  };
}

interface ActivityItem {
  activity: string;
  acted_on: string;
  title: string;
  project?: {
    name: string;
  };
}

interface ProjectProgress {
  id: number;
  name: string;
  progress: number | string;
}

const HomePage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [progresses, setProgresses] = useState<ProjectProgress[]>([]);
  const [time, setTime] = useState(new Date());
  
  const [clock, setClock] = useState({ h1: '0', h2: '0', m1: '0', m2: '0', s1: '0', s2: '0' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const hh = now.getHours().toString().padStart(2, '0');
      const mm = now.getMinutes().toString().padStart(2, '0');
      const ss = now.getSeconds().toString().padStart(2, '0');
      setClock({ h1: hh[0], h2: hh[1], m1: mm[0], m2: mm[1], s1: ss[0], s2: ss[1] });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetchApi('/api/profile');
        if (profileRes.result && profileRes.data.length > 0) {
          setUserName(`${profileRes.data[0].first_name} ${profileRes.data[0].last_name}`);
        }

        const projectRes = await fetchApi('/api/projects');
        if (projectRes.result) {
          const projectData = projectRes.data.datas;
          setProjects(projectData);
          setTotalProjects(projectRes.data.paginate?.total || projectData.length);
          
          let allActivities: ActivityItem[] = [];
          for (const project of projectData.slice(0, 5)) {
            const actRes = await fetchApi(`/api/projects/activities/${project.id}?search&page=&perpage=`);
            if (actRes.result) allActivities = [...allActivities, ...actRes.data.datas];
          }
          setActivities(allActivities.sort((a, b) => new Date(b.acted_on).getTime() - new Date(a.acted_on).getTime()));
        }

        const progressRes = await fetchApi('/api/analyst/dashboard/allprogress');
        if (progressRes.result) setProgresses(progressRes.data);

      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => ({
      total: totalProjects,
      toStart: projects.filter(p => p.status.title.toLowerCase() === 'to start').length,
      inProgress: projects.filter(p => p.status.title.toLowerCase() === 'in progress').length,
      completed: projects.filter(p => p.status.title.toLowerCase() === 'close' || p.status.title.toLowerCase() === 'closed').length
  }), [projects, totalProjects]);

  const greeting = useMemo(() => {
    const hours = time.getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 18) return 'Good Afternoon';
    if (hours >= 18 && hours < 22) return 'Good Evening';
    return 'Good Night';
  }, [time]);

  const chartData = useMemo(() => {
    const weeklyAll: Record<string, number> = {};
    const weeklyClosed: Record<string, number> = {};

    projects.forEach(pro => {
      const date = new Date(pro.status.updated_on);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyAll[weekKey] = (weeklyAll[weekKey] || 0) + 1;
      if (pro.status.title.toLowerCase() === 'close' || pro.status.title.toLowerCase() === 'closed') {
        weeklyClosed[weekKey] = (weeklyClosed[weekKey] || 0) + 1;
      }
    });

    const labels = Object.keys(weeklyAll).sort();
    return {
      series: [
        { name: 'All Projects', data: labels.map(l => weeklyAll[l]) },
        { name: 'Completed Projects', data: labels.map(l => weeklyClosed[l] || 0) }
      ],
      options: {
        chart: { type: 'area' as const, height: 320, toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit' },
        stroke: { width: [2, 2], curve: 'smooth' as const },
        xaxis: { 
          categories: labels, type: 'datetime' as const,
          axisBorder: { show: false }, axisTicks: { show: false },
          labels: { style: { colors: 'hsl(var(--muted-foreground))', fontSize: '11px' } }
        },
        yaxis: { labels: { style: { colors: 'hsl(var(--muted-foreground))', fontSize: '11px' } } },
        colors: ['hsl(var(--primary))', 'hsl(var(--success, 142 71% 45%))'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [50, 100] } },
        grid: { borderColor: 'hsl(var(--border))', strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
        dataLabels: { enabled: false },
        legend: { position: 'top' as const, horizontalAlign: 'right' as const, labels: { colors: 'hsl(var(--foreground))' } },
        tooltip: { theme: 'dark', style: { fontSize: '12px', fontFamily: 'inherit' } }
      }
    };
  }, [projects]);

  const linkProjectPage = (projectId: number) => {
    localStorage.setItem('projectID', projectId.toString());
    sessionStorage.setItem('project_active', '1');
    sessionStorage.setItem('project_active_id', projectId.toString());
    router.push(`/projects/${projectId}/settings`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Clock */}
      <Card className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, <span className="text-primary">{userName || 'User'}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here's an overview of your projects and activity.</p>
        </div>

        <div className="flex flex-col items-end gap-3">
           <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ClockIcon className="h-3.5 w-3.5" />
              {time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
           </p>
           <div className="flex items-center gap-1.5">
              {[clock.h1, clock.h2, ':', clock.m1, clock.m2, ':', clock.s1, clock.s2].map((char, index) => (
                <div key={index} className={cn(
                  "flex items-center justify-center",
                  char === ':' ? "w-2 text-muted-foreground/30 font-bold" : "bg-muted h-10 w-8 rounded text-lg font-mono font-bold"
                )}>
                  {char}
                </div>
              ))}
           </div>
        </div>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'ALL PROJECTS', value: stats.total, icon: LayoutDashboard, color: 'text-primary' },
           { label: 'TO START', value: stats.toStart, icon: FolderOpen, color: 'text-sky-500' },
           { label: 'IN PROGRESS', value: stats.inProgress, icon: PlayCircle, color: 'text-amber-500' },
           { label: 'COMPLETED', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500' }
         ].map((stat, i) => (
           <Card key={i} className="p-6 relative overflow-hidden group">
             <div className="flex justify-between items-start relative z-10">
               <div>
                 <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{stat.label}</p>
                 <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
               </div>
               <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                 <stat.icon className="h-5 w-5" />
               </div>
             </div>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
         {/* Main Chart Area */}
         <Card className="lg:col-span-8 p-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-primary/10 text-primary rounded-lg"><TrendingUp className="h-4 w-4" /></div>
               <div>
                  <CardTitle className="text-base">Project Trends</CardTitle>
                  <CardDescription>Weekly progression vs completion rates</CardDescription>
               </div>
            </div>
            <div className="h-[320px] w-full">
              {typeof window !== 'undefined' && chartData.series[0].data.length > 0 ? (
                 <Chart options={chartData.options} series={chartData.series} type="area" height="100%" />
              ) : (
                 <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-muted/40 rounded-lg border border-dashed">
                   Insufficient data for chart
                 </div>
              )}
            </div>
         </Card>

         {/* Right Sidebar */}
         <div className="lg:col-span-4 space-y-6 flex flex-col h-fit">
            <Card className="flex flex-col overflow-hidden border-border/50 shadow-sm">
               <CardHeader className="p-4 pb-3 border-b flex flex-row items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">Active Work</CardTitle>
               </CardHeader>
               <CardContent className="p-2">
                  <ScrollArea className="max-h-[220px] -mr-2 pr-2">
                     <div className="space-y-0.5">
                       {projects.filter(p => p.status.title.toLowerCase() === 'in progress').length === 0 ? (
                          <p className="text-[11px] text-muted-foreground py-6 text-center italic font-medium">No active missions</p>
                       ) : (
                          projects.filter(p => p.status.title.toLowerCase() === 'in progress').map(project => (
                             <div key={project.id} onClick={() => linkProjectPage(project.id)} className="group flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-muted/60 cursor-pointer transition-all">
                                <div className="flex items-center gap-3 truncate">
                                   <div className="p-1.5 bg-muted/40 rounded-md group-hover:bg-background transition-colors">
                                      <FolderOpen className="h-3.5 w-3.5 text-muted-foreground group-hover:text-amber-500" />
                                   </div>
                                   <span className="text-[13px] font-bold tracking-tight truncate">{project.name}</span>
                                </div>
                                <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                             </div>
                          ))
                       )}
                     </div>
                  </ScrollArea>
               </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden border-border/50 shadow-sm">
               <CardHeader className="p-4 pb-3 border-b flex flex-row items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">All Folders</CardTitle>
               </CardHeader>
               <CardContent className="p-2">
                  <ScrollArea className="max-h-[280px] -mr-2 pr-2">
                     <div className="space-y-0.5">
                       {projects.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground py-6 text-center italic font-medium">No project repository found</p>
                       ) : (
                          projects.map(project => (
                             <div key={project.id} onClick={() => linkProjectPage(project.id)} className="group flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-muted/60 cursor-pointer transition-all">
                                <div className="flex items-center gap-3 truncate">
                                   <div className="p-1.5 bg-muted/40 rounded-md group-hover:bg-background transition-colors">
                                      <FolderOpen className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                                   </div>
                                   <span className="text-[13px] font-bold tracking-tight truncate">{project.name}</span>
                                </div>
                                <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                             </div>
                          ))
                       )}
                     </div>
                  </ScrollArea>
               </CardContent>
            </Card>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
          {/* Activity Feed */}
          <Card className="flex flex-col h-[400px] overflow-hidden border-border/50 shadow-sm">
             <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-sky-500/10 text-sky-500 rounded-lg"><Activity className="h-4 w-4" /></div>
                   <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
                </div>
             </CardHeader>
             
             <CardContent className="flex-1 min-h-0 pt-6 px-6">
                <ScrollArea className="h-full -mr-4 pr-4 border-l ml-2 pl-6">
                   <div className="space-y-6 pb-6">
                      {activities.length === 0 ? (
                         <p className="text-sm text-muted-foreground py-10 italic">No recent activity</p>
                      ) : (
                         activities.slice(0, 15).map((acti, idx) => (
                            <div key={idx} className="relative group">
                               <div className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full bg-background border-2 border-sky-500 z-10" />
                               <div className="space-y-1.5 overflow-hidden">
                                  <div 
                                    className="text-xs font-medium leading-relaxed [&>strong]:text-primary [&>strong]:font-bold"
                                    dangerouslySetInnerHTML={{ __html: acti.activity }}
                                  />
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                     <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">{acti.project?.name}</span>
                                     <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 bg-muted/40">{acti.title}</Badge>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-medium">{new Date(acti.acted_on).toLocaleString()}</p>
                               </div>
                            </div>
                         ))
                      )}
                   </div>
                </ScrollArea>
             </CardContent>
          </Card>

         {/* Project Progress */}
         <Card className="p-6 flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 className="h-4 w-4" /></div>
               <CardTitle className="text-base">Project Progress</CardTitle>
            </div>

            <ScrollArea className="flex-1 -mr-2 pr-2">
               <div className="space-y-5">
                  {progresses.length === 0 ? (
                     <p className="text-sm text-muted-foreground py-10 italic">No progress data available</p>
                  ) : (
                     progresses.map(pr => {
                        const progressInt = parseInt(pr.progress as any);
                        return (
                           <div key={pr.id} className="space-y-2">
                              <div className="flex justify-between items-end">
                                 <span className="text-xs font-semibold truncate pr-4">{pr.name}</span>
                                 <span className="text-[10px] font-bold text-muted-foreground">{progressInt}%</span>
                              </div>
                              <Progress value={progressInt} className="h-1.5" />
                           </div>
                        );
                     })
                  )}
               </div>
            </ScrollArea>
         </Card>

      </div>
    </div>
  );
};

export default HomePage;
