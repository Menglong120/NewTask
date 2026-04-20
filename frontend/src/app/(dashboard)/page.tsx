'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, Users, UserCheck, LayoutPanelLeft, Cloud, Droplets, Gauge, Loader2, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Dashboard = () => {
  const [greeting, setGreeting] = useState('Morning');
  const [weather] = useState({
    temp: 31, description: 'overcast clouds',
    humidity: 98, clouds: 98, pressure: 1011,
    city: 'Phnom Penh', country: 'KH'
  });

  const [stats, setStats] = useState([
    { label: 'Total Projects', value: '0', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Members', value: '0', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Total Admin', value: '0', icon: UserCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Total Categories', value: '0', icon: LayoutPanelLeft, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ]);

  const [projectProgress, setProjectProgress] = useState<any[]>([]);
  const [issueSummary, setIssueSummary] = useState({ labels: [] as string[], series: [] as number[], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateGreeting = () => {
      const hours = new Date().getHours();
      if (hours >= 5 && hours < 12) setGreeting('Morning');
      else if (hours >= 12 && hours < 17) setGreeting('Afternoon');
      else setGreeting('Evening');
    };
    updateGreeting();

    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, usersRes, issuesRes, progressRes] = await Promise.all([
          fetchApi('/api/projects'),
          fetchApi('/api/users?search=&role=0&page=1&perpage=1'),
          fetchApi('/api/analyst/dashboard/issues'),
          fetchApi('/api/analyst/dashboard/allprogress')
        ]);

        if (projectsRes.result) {
          const totalProj = projectsRes.data.datas.length;
          setStats(prev => prev.map(s => s.label === 'Total Projects' ? { ...s, value: String(totalProj) } : s));
        }

        if (usersRes.result) {
          const uDatas = usersRes.data.datas || usersRes.data;
          const totalUsers = Array.isArray(uDatas) ? uDatas.length : 0;
          setStats(prev => prev.map(s => s.label === 'Total Members' ? { ...s, value: String(totalUsers) } : s));
          
          const adminCount = Array.isArray(uDatas) ? uDatas.filter((u: any) => u.role_id === 1 || u.role?.id === 1).length : 0;
          setStats(prev => prev.map(s => s.label === 'Total Admin' ? { ...s, value: String(adminCount || 1) } : s));
        }

        if (issuesRes.result && Array.isArray(issuesRes.data)) {
          const labels = issuesRes.data.map((item: any) => item.issue_status_name);
          const series = issuesRes.data.map((item: any) => item.total_issue);
          const total = series.reduce((a: number, b: number) => a + b, 0);
          setIssueSummary({ labels, series, total });
        }

        if (progressRes.result) {
          setProjectProgress(progressRes.data.slice(0, 5)); 
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const issueChartOptions: any = {
    chart: { type: 'donut', background: 'transparent' },
    labels: issueSummary.labels.length > 0 ? issueSummary.labels : ['No Data'],
    colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#64748b'],
    legend: { 
      position: 'bottom', 
      fontFamily: 'inherit',
      labels: { colors: 'currentColor' }, 
      markers: { width: 8, height: 8, radius: 4 } 
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    theme: { mode: 'dark' },
    plotOptions: {
      pie: { 
        donut: { 
          size: '75%', 
          labels: { 
            show: true, 
            total: { 
              show: true, 
              label: 'Issues', 
              color: 'currentColor', 
              formatter: () => String(issueSummary.total) 
            }, 
            value: { 
              color: 'currentColor', 
              fontSize: '24px', 
              fontWeight: 800 
            } 
          } 
        } 
      }
    }
  };

  const statusColor: Record<string, string> = {
    Active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Testing: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Planning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Closed: 'bg-muted text-muted-foreground border-transparent',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Synchronizing workspace data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">

      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Good {greeting}, Commander</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening across your projects today.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-1 tabular-nums">{stat.value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Section */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Weather Card */}
            <Card className="border-border/50 shadow-sm relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Local Context</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-4 bg-muted/50 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-border">
                  <Sparkles className="h-3 w-3 text-primary" />
                  {weather.city}, {weather.country}
                </div>
                <div className="flex items-center gap-6 mb-8 mt-2">
                  <div className="p-4 bg-primary/10 rounded-3xl ring-1 ring-primary/20">
                    <Cloud className="h-12 w-12 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter">{weather.temp}</span>
                      <span className="text-xl text-muted-foreground font-bold">°C</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-semibold capitalize">{weather.description}</p>
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-2 pt-6 border-t font-medium">
                  <div className="flex flex-col gap-1 items-center">
                    <Cloud className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase">Clouds</span>
                    <span className="text-xs">{weather.clouds}%</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <Droplets className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase">Humidity</span>
                    <span className="text-xs">{weather.humidity}%</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground uppercase">Pressure</span>
                    <span className="text-xs">{weather.pressure}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Velocity Card */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Velocity Index</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Chart
                  options={{
                    chart: { background: 'transparent', toolbar: { show: false }, sparkline: { enabled: true } },
                    stroke: { curve: 'smooth', width: 3 },
                    fill: { opacity: 0.1, type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0 } },
                    colors: ['#6366f1'],
                    xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
                    yaxis: { labels: { show: false } },
                    grid: { show: false },
                    tooltip: { theme: 'dark', x: { show: false } },
                  }}
                  series={[{ name: 'Efficiency', data: [45, 52, 38, 65, 48, 72, 60] }]}
                  type="area"
                  height="220"
                />
                <div className="p-6 pt-0 flex items-center justify-between mt-[-20px] relative z-10">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-lg">12.5%</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Growth vs last week</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issue Distribution */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Issue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center py-6 gap-8 text-card-foreground">
              {issueSummary.series.length > 0 ? (
                 <Chart options={issueChartOptions} series={issueSummary.series} type="donut" width="360" />
              ) : (
                  <div className="h-[200px] flex items-center justify-center text-sm italic text-muted-foreground">No issue data available</div>
              )}
              <div className="flex flex-col gap-4 w-full md:w-auto">
                {issueSummary.labels.map((label, i) => (
                  <div key={label} className="flex items-center justify-between gap-8 py-1.5 px-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: issueChartOptions.colors[i] }} />
                      <span className="text-sm font-semibold">{label}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{issueSummary.series[i]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Live Missions</CardTitle>
              <CardDescription>Real-time progress of active projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {projectProgress.length === 0 ? (
                   <div className="py-20 text-center text-sm italic text-muted-foreground">Awaiting active mission data...</div>
              ) : projectProgress.map((project) => (
                <div key={project.id} className="space-y-3 group cursor-pointer" onClick={() => window.location.href = `/projects`}>
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-bold group-hover:text-primary transition-colors truncate">{project.name}</span>
                    <span className="font-bold text-primary tabular-nums shrink-0">{Math.round(project.progress * 100)}%</span>
                  </div>
                  <Progress value={project.progress * 100} className="h-1.5" />
                  <div className="flex justify-end">
                    <Badge variant="outline" className={cn("px-2 py-0 h-5 text-[9px] font-bold uppercase tracking-widest", statusColor[project.status?.title] || 'border-transparent text-muted-foreground')}>
                      {project.status?.title || 'Active'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
