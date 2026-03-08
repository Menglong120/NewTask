'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, Users, UserCheck, LayoutPanelLeft, Cloud, Droplets, Gauge } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [weather] = useState({
    temp: 31, description: 'overcast clouds',
    humidity: 98, clouds: 98, pressure: 1011,
    city: 'Phnom Penh', country: 'KH'
  });

  useEffect(() => {
    const updateTime = () => {
      const hours = new Date().getHours();
      let greeting = 'Morning';
      if (hours >= 12 && hours < 17) greeting = 'Afternoon';
      else if (hours >= 17) greeting = 'Evening';
      setCurrentTime(greeting);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Total Projects', value: '1,248', icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/15' },
    { label: 'Total Members', value: '852', icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/15' },
    { label: 'Total Admin', value: '12', icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { label: 'Total Category', value: '45', icon: LayoutPanelLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  ];

  const issueChartOptions: any = {
    chart: { type: 'donut', background: 'transparent' },
    labels: ['Todo', 'In Progress', 'Done', 'Testing'],
    colors: ['#696cff', '#03c3ec', '#71dd37', '#ffab00'],
    legend: { position: 'bottom', labels: { colors: '#9ca3af' }, markers: { width: 10, height: 10, radius: 3 } },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: { donut: { size: '72%', labels: { show: true, total: { show: true, label: 'Issues', color: '#9ca3af', formatter: () => '452' }, value: { color: '#fff', fontSize: '22px', fontWeight: 700 } } } }
    }
  };

  const projectProgress = [
    { name: 'NSM Task Management', progress: 75, status: 'Active' },
    { name: 'E-Commerce Platform', progress: 45, status: 'Active' },
    { name: 'Mobile App Redesign', progress: 92, status: 'Testing' },
    { name: 'Internal Tooling', progress: 10, status: 'Planning' },
  ];

  const statusColor: Record<string, string> = {
    Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Testing: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Planning: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* Welcome Banner */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute -right-8 -top-8 h-48 w-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-4 -bottom-4 h-32 w-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
        <CardContent className="p-6 lg:p-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Greeting + Stats */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 relative overflow-hidden">
                <Briefcase className="absolute right-4 top-4 h-24 w-24 text-primary/8" />
                <h2 className="text-xl font-bold text-foreground">This Is Your Dashboard Area</h2>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Have a great <span className="font-semibold text-primary">{currentTime}</span>!
                  Stay focused and productive as you work through your tasks today.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-white/5 bg-card/50 hover:bg-card transition-colors">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`${stat.bg} ${stat.color} rounded-xl p-2.5 shrink-0`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground leading-tight">{stat.value}</p>
                        <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wide">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div className="lg:col-span-4">
              <Card className="h-full border-white/5 bg-card/50">
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-foreground">{weather.city}</span>
                    <Badge variant="secondary" className="text-[10px] border-0 font-bold">{weather.country}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <Cloud className="h-12 w-12 text-primary" />
                    <div className="text-left">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">{weather.temp}</span>
                        <span className="text-lg text-muted-foreground">°C</span>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
                    </div>
                  </div>
                  <div className="w-full space-y-3 border-t border-border pt-4">
                    {[
                      { icon: Cloud, label: 'Clouds', value: `${weather.clouds}%` },
                      { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
                      { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" />
                          <span>{label}</span>
                        </div>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <Card className="border-white/5 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Issues</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <Chart options={issueChartOptions} series={[120, 80, 200, 52]} type="donut" width="280" />
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card className="border-white/5 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Tracking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                chart: { background: 'transparent', toolbar: { show: false }, sparkline: { enabled: false } },
                stroke: { curve: 'smooth', width: 2 },
                fill: { opacity: 0.15, type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
                colors: ['#696cff'],
                xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { show: false } },
                grid: { show: false },
                tooltip: { theme: 'dark' },
              }}
              series={[{ name: 'Issues', data: [31, 40, 28, 51, 42, 109, 100] }]}
              type="area"
              height="180"
            />
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card className="border-white/5 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Projects Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {projectProgress.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground truncate pr-2">{project.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`text-[10px] border ${statusColor[project.status] ?? ''} font-semibold`}>
                      {project.status}
                    </Badge>
                    <span className="font-bold text-primary text-xs">{project.progress}%</span>
                  </div>
                </div>
                <Progress value={project.progress} className="h-1.5 bg-white/5 [&>div]:bg-primary" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
