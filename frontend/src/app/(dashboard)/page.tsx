'use client';

import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  LayoutPanelLeft,
  Cloud,
  Droplets,
  Gauge
} from 'lucide-react';
import dynamic from 'next/dynamic';

// ApexCharts needs to be imported dynamically for Next.js SSR compatibility
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [weather, setWeather] = useState({
    temp: 31,
    description: 'overcast clouds',
    humidity: 98,
    clouds: 98,
    pressure: 1011,
    city: 'Phnom Penh',
    country: 'KH'
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
    { label: 'Total Projects', value: '1,248', icon: Briefcase, color: 'bg-[#9e7eff]' },
    { label: 'Total Members', value: '852', icon: Users, color: 'bg-[#95CAE3]' },
    { label: 'Total Admin', value: '12', icon: UserCheck, color: 'bg-[#D9B747]' },
    { label: 'Total Category', value: '45', icon: LayoutPanelLeft, color: 'bg-[#92D445]' },
  ];

  const issueChartOptions: any = {
    chart: { type: 'donut' },
    labels: ['Todo', 'In Progress', 'Done', 'Testing'],
    colors: ['#696cff', '#03c3ec', '#71dd37', '#ffab00'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Issues',
              formatter: () => '452'
            }
          }
        }
      }
    }
  };

  const projectProgress = [
    { name: 'NSM Task Management', progress: 75, status: 'Active' },
    { name: 'E-Commerce Platform', progress: 45, status: 'Active' },
    { name: 'Mobile App Redesign', progress: 92, status: 'Testing' },
    { name: 'Internal Tooling', progress: 10, status: 'Planning' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Greeting Card */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-xl bg-[#696cff]/5 p-8">
              <div className="relative z-10 space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">This Is Your Dashboard Area</h2>
                <p className="max-w-md text-gray-600">
                  Have a great <span className="font-semibold text-[#696cff]">{currentTime}</span>! Stay focused and productive as you work through your tasks today.
                </p>
              </div>
              <div className="absolute -right-4 -top-4 h-48 w-48 opacity-10">
                <Briefcase className="h-full w-full" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} rounded-lg p-3 text-white`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-500 uppercase font-medium">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Card */}
          <div className="lg:col-span-4">
            <div className="h-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-800">{weather.city}</span>
                  <span className="text-xs font-bold text-gray-400">{weather.country}</span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Cloud className="h-12 w-12 text-[#696cff]" />
                  <div className="text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-800">{weather.temp}</span>
                      <span className="text-xl font-medium text-gray-500">°C</span>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">{weather.description}</p>
                  </div>
                </div>
                <div className="mt-6 w-full space-y-3 border-t border-gray-100 pt-6">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Cloud className="h-4 w-4" />
                      <span>Clouds</span>
                    </div>
                    <span className="font-medium">{weather.clouds}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Droplets className="h-4 w-4" />
                      <span>Humidity</span>
                    </div>
                    <span className="font-medium">{weather.humidity}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Gauge className="h-4 w-4" />
                      <span>Pressure</span>
                    </div>
                    <span className="font-medium">{weather.pressure} hPa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Projects Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Issue Chart */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">Total Issues</h3>
            <div className="flex justify-center">
              <Chart options={issueChartOptions} series={[120, 80, 200, 52]} type="donut" width="280" />
            </div>
          </div>

          {/* Tracking Status */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">Tracking Status</h3>
             <Chart 
              options={{
                chart: { sparkline: { enabled: true } },
                stroke: { curve: 'smooth' },
                fill: { opacity: 0.3 },
                colors: ['#696cff'],
              }} 
              series={[{ name: 'Issues', data: [31, 40, 28, 51, 42, 109, 100] }]} 
              type="area" 
              height="200" 
            />
          </div>

          {/* Project Progress */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">Projects Progress</h3>
            <div className="space-y-5 overflow-y-auto max-h-[250px] pr-2">
              {projectProgress.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{project.name}</span>
                    <span className="font-bold text-[#696cff]">{project.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-[#696cff] transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
