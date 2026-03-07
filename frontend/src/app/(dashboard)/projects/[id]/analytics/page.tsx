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
  Loader2
} from 'lucide-react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnalyticsData {
  total: { issue: number; sub_issue: number };
  members: number;
  resources: number;
  statusData: any[];
  priorityData: any[];
  assigneeData: any[];
  monthlyData: any[];
}

const ProjectAnalyticsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [
          totalRes,
          memberRes,
          resourceRes,
          statusRes,
          priorityRes,
          assigneeRes,
          monthRes
        ] = await Promise.all([
          fetchApi(`/api/analyst/project/total/${id}`),
          fetchApi(`/api/projects/members/${id}?search&perpage=&page=`),
          fetchApi(`/api/projects/resources/${id}?search&perpage=&page=`),
          fetchApi(`/api/analyst/project/issue/status/${id}`),
          fetchApi(`/api/analyst/project/issue/priority/${id}`),
          fetchApi(`/api/analyst/project/issue/assignee/${id}`),
          fetchApi(`/api/analyst/project/issue/month/${id}`)
        ]);

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
        chart: { 
          type: 'donut',
          background: 'transparent'
        },
        labels: data.statusData.map(s => s.name),
        colors: ['#696cff', '#71dd37', '#ff3e1d', '#8592a3', '#03c3ec'],
        legend: { 
          position: 'bottom',
          labels: { colors: 'rgba(255,255,255,0.7)' }
        },
        dataLabels: { enabled: false },
        stroke: { show: false },
        theme: { mode: 'dark' }
      }
    };
  }, [data]);

  const priorityChart = useMemo(() => {
    if (!data) return null;
    return {
      series: [{
        name: 'Issues',
        data: data.priorityData.map(p => Number(p.total_issues))
      }],
      options: {
        chart: { 
          type: 'bar', 
          toolbar: { show: false },
          background: 'transparent'
        },
        xaxis: { 
          categories: data.priorityData.map(p => p.name),
          labels: { style: { colors: 'rgba(255,255,255,0.5)' } },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: { style: { colors: 'rgba(255,255,255,0.5)' } }
        },
        grid: {
          borderColor: 'rgba(255,255,255,0.05)',
          strokeDashArray: 4,
        },
        colors: ['#ffab00'],
        plotOptions: { 
          bar: { 
            borderRadius: 4, 
            horizontal: true,
            columnWidth: '40%'
          } 
        },
        theme: { mode: 'dark' },
        dataLabels: { enabled: false }
      }
    };
  }, [data]);

  if (loading) return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
    </div>
  );
  if (!data) return <div className="p-10 text-center text-red-400 font-bold bg-[#121212] rounded-[2rem] border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">Failed to load analytics.</div>;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden gap-4">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="text-2xl font-bold text-white flex items-center gap-3 relative z-10 w-full mb-1">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 ring-1 ring-indigo-500/20 shadow-inner">
             <BarChart3 className="h-5 w-5" />
          </div>
          Project Analytics
        </h1>
        <div className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-widest relative z-10 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner shrink-0 cursor-default">
          <Calendar className="h-4 w-4 text-white/30" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Issues', value: data.total.issue, icon: Layers, color: 'text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/20' },
          { label: 'Sub Issues', value: data.total.sub_issue, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', ring: 'ring-indigo-500/20' },
          { label: 'Team Members', value: data.members, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' },
          { label: 'Resources', value: data.resources, icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10', ring: 'ring-purple-500/20' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#121212]/80 backdrop-blur-sm p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5 transition-all hover:border-white/10 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none -mt-16 -mr-16"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ring-1 ${stat.ring} shadow-inner transition-transform group-hover:scale-110 transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-5 relative z-10">
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6 relative z-10">Issue Status Distribution</h3>
          <div className="h-[300px] flex items-center justify-center relative z-10">
            {statusChart && (
              <Chart 
                options={statusChart.options as any} 
                series={statusChart.series} 
                type="donut" 
                width="100%" 
              />
            )}
          </div>
        </div>

        <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6 relative z-10">Issues by Priority</h3>
          <div className="h-[300px] relative z-10">
            {priorityChart && (
              <Chart 
                options={priorityChart.options as any} 
                series={priorityChart.series} 
                type="bar" 
                height="100%" 
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
             <Users className="h-4 w-4 text-indigo-400" /> Team Performance (Assignees)
          </h3>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Assignee</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Issue</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Category</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">Progress</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.assigneeData.slice(0, 10).map((mem, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-[15px] font-bold text-white">{mem.assignee.dis_name || mem.assignee.email}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md ring-1 ring-indigo-500/20 shadow-inner inline-block">
                        {mem.assignee.role.name}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-[15px] font-bold text-white/80">{mem.assignee.issuename}</td>
                  <td className="px-6 py-4 text-xs font-black text-white/40 uppercase tracking-widest">{mem.assignee.mainissue}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 bg-[#0a0a0a] rounded-full h-1.5 ring-1 ring-white/5 shadow-inner overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all shadow-[0_0_10px_rgba(105,108,255,0.8)]" 
                        style={{ width: `${mem.assignee.progress}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-inner ring-1 ${
                      mem.status.name === 'Done' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' :
                      mem.status.name === 'In Progress' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20' :
                      'bg-white/5 text-white/50 ring-white/10'
                    }`}>
                      {mem.status.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.assigneeData.length === 0 && (
            <div className="py-20 text-center text-white/30 font-medium">
              <Users className="h-16 w-16 mx-auto opacity-20 mb-4" />
              <p>No assignee data available for this project</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalyticsPage;
