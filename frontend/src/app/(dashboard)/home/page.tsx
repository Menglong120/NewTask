'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { 
  FolderOpen, LayoutDashboard, PlayCircle, CheckCircle2, 
  Activity, Clock as ClockIcon, TrendingUp, Layers, ChevronRight
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Project { id: number; name: string; status: { title: string; updated_on: string; }; }
interface ActivityItem { id: number; title: string; activity: string; acted_on: string; project: { name: string; }; }
interface ProjectProgress { id: number; name: string; progress: number; }

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
    if (hours >= 5 && hours < 12) return 'Good Morning 🌞';
    if (hours >= 12 && hours < 18) return 'Good Afternoon ☀️';
    if (hours >= 18 && hours < 22) return 'Good Evening 🌙';
    return 'Have a great night 👩‍💻';
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
        stroke: { width: [3, 3], curve: 'smooth' as const },
        xaxis: { 
          categories: labels, type: 'datetime' as const,
          axisBorder: { show: false }, axisTicks: { show: false },
          labels: { style: { colors: '#666', fontSize: '12px', fontWeight: 600 } }
        },
        yaxis: { labels: { style: { colors: '#666', fontSize: '12px', fontWeight: 600 } } },
        colors: ['#696cff', '#10B981'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [50, 100] } },
        grid: { borderColor: '#ffffff10', strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
        dataLabels: { enabled: false },
        legend: { position: 'top' as const, horizontalAlign: 'right' as const, fontWeight: 700, labels: { colors: '#ffffff' } },
        tooltip: { theme: 'dark', style: { fontSize: '13px', fontFamily: 'inherit' } }
      }
    };
  }, [projects]);

  const linkProjectPage = (projectId: number) => {
    localStorage.setItem('projectID', projectId.toString());
    sessionStorage.setItem('project_active', '1');
    sessionStorage.setItem('project_active_id', projectId.toString());
    router.push(`/projects/${projectId}/settings`); // Replaced /analytic with direct route if applicable, but using existing behaviour:
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Clock */}
      <div className="bg-[#121212]/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative overflow-hidden">
        
        {/* Decorative Background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#696cff]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">
            {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">{userName || 'User'}</span>
            <span className="text-red-500 text-xs ml-4">DIAGNOSTIC: VERSION 4</span>
          </h1>
          <p className="text-white/50 font-medium">Here's what is happening with your projects today.</p>
        </div>

        <div className="flex flex-col items-end gap-1">
           <p className="text-indigo-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              {time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
           </p>
           {/* Custom Clock UI */}
           <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1">
                 <div className="bg-[#0a0a0a] text-white font-mono font-bold text-2xl h-12 w-9 flex items-center justify-center rounded-lg border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">{clock.h1}</div>
                 <div className="bg-[#0a0a0a] text-white font-mono font-bold text-2xl h-12 w-9 flex items-center justify-center rounded-lg border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">{clock.h2}</div>
              </div>
              <div className="text-2xl font-bold text-white/30 mb-1">:</div>
              <div className="flex gap-1">
                 <div className="bg-[#121212] text-white font-mono font-bold text-2xl h-12 w-9 flex items-center justify-center rounded-lg border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">{clock.m1}</div>
                 <div className="bg-[#121212] text-white font-mono font-bold text-2xl h-12 w-9 flex items-center justify-center rounded-lg border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">{clock.m2}</div>
              </div>
              <div className="text-2xl font-bold text-white/30 mb-1">:</div>
              <div className="flex gap-1 opacity-70">
                 <div className="bg-[#1a1a1a] text-white font-mono font-bold text-2xl h-12 w-9 flex items-center justify-center rounded-lg border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">{clock.s1}</div>
                 <div className="bg-[#1a1a1a] text-white font-mono font-bold text-2xl h-12 w-9 flex items-center justify-center rounded-lg border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">{clock.s2}</div>
              </div>
           </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 rounded-3xl p-6 text-white border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform"><LayoutDashboard className="h-32 w-32 text-indigo-400" /></div>
            <p className="text-indigo-300 font-bold tracking-wider text-sm mb-1">ALL PROJECTS</p>
            <h2 className="text-5xl font-black">{stats.total}</h2>
         </div>
         <div className="bg-gradient-to-br from-sky-600/20 to-sky-900/20 rounded-3xl p-6 text-white border border-sky-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform"><FolderOpen className="h-32 w-32 text-sky-400" /></div>
            <p className="text-sky-300 font-bold tracking-wider text-sm mb-1">TO START</p>
            <h2 className="text-5xl font-black">{stats.toStart}</h2>
         </div>
         <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/20 rounded-3xl p-6 text-white border border-amber-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform"><PlayCircle className="h-32 w-32 text-amber-400" /></div>
            <p className="text-amber-300 font-bold tracking-wider text-sm mb-1">IN PROGRESS</p>
            <h2 className="text-5xl font-black">{stats.inProgress}</h2>
         </div>
         <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 rounded-3xl p-6 text-white border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform"><CheckCircle2 className="h-32 w-32 text-emerald-400" /></div>
            <p className="text-emerald-300 font-bold tracking-wider text-sm mb-1">COMPLETED</p>
            <h2 className="text-5xl font-black">{stats.completed}</h2>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
         {/* Main Chart Area */}
         <div className="lg:col-span-8 bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl"><TrendingUp className="h-5 w-5" /></div>
               <div>
                  <h3 className="text-lg font-bold text-white">Project Trends</h3>
                  <p className="text-sm text-white/40 font-medium tracking-wide">Weekly progression and completion rates</p>
               </div>
            </div>
            <div className="-ml-3 mt-4">
              {typeof window !== 'undefined' && chartData.series[0].data.length > 0 ? (
                 <Chart options={chartData.options} series={chartData.series} type="area" height={320} />
              ) : (
                 <div className="h-[320px] flex items-center justify-center text-white/30 font-medium bg-white/5 rounded-2xl border border-dashed border-white/10">Insufficient data to display chart</div>
              )}
            </div>
         </div>

         {/* Right Sidebar: Active Folders */}
         <div className="lg:col-span-4 space-y-6 flex flex-col">
            
            {/* In Progress Quick List */}
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2"><PlayCircle className="h-4 w-4 text-amber-500" /> Active Work</h3>
               </div>
               <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[180px]">
                  {projects.filter(p => p.status.title.toLowerCase() === 'in progress').length === 0 ? (
                     <div className="text-center text-white/40 font-medium py-8 bg-white/5 rounded-xl">No active projects</div>
                  ) : (
                     projects.filter(p => p.status.title.toLowerCase() === 'in progress').map(project => (
                        <div key={project.id} onClick={() => linkProjectPage(project.id)} className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#696cff]/10 border border-transparent hover:border-[#696cff]/20 cursor-pointer transition-all">
                           <div className="flex items-center gap-3 truncate pr-4">
                              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-[#696cff]/20 group-hover:text-indigo-400 transition-colors"><FolderOpen className="h-4 w-4" /></div>
                              <span className="font-bold text-white/70 text-sm truncate group-hover:text-white transition-colors">{project.name}</span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-indigo-400 transition-colors shrink-0" />
                        </div>
                     ))
                  )}
               </div>
            </div>

            {/* General Folders Quick List */}
            <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-400" /> All Folders</h3>
               </div>
               <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[180px]">
                  {projects.length === 0 ? (
                     <div className="text-center text-white/40 font-medium py-8 bg-white/5 rounded-xl">No projects found</div>
                  ) : (
                     projects.map(project => (
                        <div key={project.id} onClick={() => linkProjectPage(project.id)} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer transition-all">
                           <div className="flex items-center gap-3 truncate pr-4">
                              <div className="h-8 w-8 rounded-lg bg-[#ffffff]/5 text-white/40 flex items-center justify-center shrink-0 group-hover:bg-[#ffffff]/10  transition-all"><FolderOpen className="h-4 w-4" /></div>
                              <span className="font-bold text-white/60 text-sm truncate group-hover:text-white transition-colors">{project.name}</span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-white/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                     ))
                  )}
               </div>
            </div>

         </div>
      </div>

      {/* Bottom Grid: Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Global Activity Feed */}
         <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 lg:p-8 flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-6 shrink-0">
               <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl"><Activity className="h-5 w-5" /></div>
               <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 pr-4 relative">
               <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-white/5"></div>
               {activities.length === 0 ? (
                  <div className="text-center text-white/30 font-medium py-16">No recent activities</div>
               ) : (
                  <div className="space-y-6 relative z-10">
                     {activities.slice(0, 15).map((acti, idx) => (
                        <div key={idx} className="flex gap-4 group">
                           <div className="h-8 w-8 rounded-full bg-[#121212] border-2 border-sky-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5 group-hover:scale-110 transition-transform">
                              <div className="h-3 w-3 rounded-full bg-sky-500"></div>
                           </div>
                           <div className="pt-1.5 pb-2">
                              <p className="text-sm font-medium text-white/60 leading-relaxed">
                                 {acti.activity} <span className="font-bold text-white">{acti.project?.name}</span> <span className="font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded ml-1 border border-indigo-500/20">{acti.title}</span>
                              </p>
                              <p className="text-xs font-bold text-white/30 mt-1.5">{new Date(acti.acted_on).toLocaleString()}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Project Progress Tracker */}
         <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 lg:p-8 flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-6 shrink-0">
               <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle2 className="h-5 w-5" /></div>
               <h3 className="text-lg font-bold text-white">Project Progress</h3>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-6">
               {progresses.length === 0 ? (
                  <div className="text-center text-white/40 font-medium py-16">No progress data available</div>
               ) : (
                  progresses.map(pr => {
                     const progressInt = parseInt(pr.progress as any);
                     const progressColor = progressInt < 30 ? 'bg-red-500' : progressInt < 70 ? 'bg-amber-500' : progressInt < 100 ? 'bg-[#696cff]' : 'bg-emerald-500';
                     const progressBg = progressInt < 30 ? 'bg-red-500/10' : progressInt < 70 ? 'bg-amber-500/10' : progressInt < 100 ? 'bg-[#696cff]/10' : 'bg-emerald-500/10';
                     const progressText = progressInt < 30 ? 'text-red-400' : progressInt < 70 ? 'text-amber-400' : progressInt < 100 ? 'text-indigo-400' : 'text-emerald-400';

                     return (
                        <div key={pr.id} className="group">
                           <div className="flex justify-between items-end mb-2">
                              <span className="font-bold text-white/80 text-sm truncate pr-4 group-hover:text-indigo-400 transition-colors">{pr.name}</span>
                              <span className={`text-xs font-black tracking-wider px-2 py-0.5 rounded-md ${progressBg} ${progressText} ring-1 ring-white/5`}>{progressInt}%</span>
                           </div>
                           <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                              <div className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-1000 ${progressColor} shadow-[0_0_10px_currentColor]`} style={{ width: `${progressInt}%` }}>
                                 {/* Abstract shine effect */}
                                 <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent flex" style={{ animation: 'shimmer 2s infinite' }}></div>
                              </div>
                           </div>
                        </div>
                     );
                  })
               )}
            </div>
         </div>

      </div>
      
      {/* Global Styles for Scrollbar & Animations passed inline for scoped components */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #555; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
};

export default HomePage;
