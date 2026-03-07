'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Layers, BookOpen, Users, Search, 
  ChevronRight, Activity, CircleDot, AlertCircle
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Member { user: { id: string; first_name: string; last_name: string; avarta: string; dis_name: string; email: string; } }
interface StatusIssue { name: string; total_issues: string | number; }
interface PriorityIssue { name: string; total_issues: string | number; }
interface AssigneeIssue {
  assignee: { dis_name: string; email: string; mainissue: string; mainissueid: string; issuename: string; startdate: string; duedate: string; progress: string | number; role: { name: string; } };
  status: { name: string; };
}

const formatDate = (dateString: string) => {
  if (!dateString) return "No Date";    
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;    
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

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
         const issueRes = await fetchApi(`/api/analyst/project/total/${projectId}`);
         if (issueRes.result) { setTotalIssues(issueRes.data.total?.issue || 0); setTotalSubIssues(issueRes.data.total?.sub_issue || 0); }

         const memRes = await fetchApi(`/api/projects/members/${projectId}?search&perpage=&page=`);
         if (memRes.result) { setTotalMembers(memRes.data.paginate?.total || memRes.data.datas?.length || 0); setMembers(memRes.data.datas || []); }

         const resRes = await fetchApi(`/api/projects/resources/${projectId}?search&perpage=&page=`);
         if (resRes.result) setTotalResources(resRes.data.datas?.length || 0);

         // Status Donut Chart
         const statusRes = await fetchApi(`/api/analyst/project/issue/status/${projectId}`);
         if (statusRes.result && statusRes.data?.issue_status) {
           const issues: StatusIssue[] = statusRes.data.issue_status;
           if (issues.some(sta => sta.name && Number(sta.total_issues) > 0)) {
              setStatusChart({
                series: issues.map(s => Number(s.total_issues)),
                options: {
                  labels: issues.map(s => s.name),
                  chart: { type: 'donut', fontFamily: 'inherit' },
                  colors: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                  plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { fontSize: '14px', color: '#6B7280' }, value: { fontSize: '24px', fontWeight: 700, color: '#111827' }, total: { show: true, showAlways: true, label: 'Total', fontSize: '14px', color: '#6B7280' } } } } },
                  dataLabels: { enabled: false },
                  stroke: { show: false },
                  legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '13px', markers: { radius: 12 }, itemMargin: { horizontal: 10, vertical: 5 } }
                }
              });
           }
         }

         // Priority Bar Chart
         const prioRes = await fetchApi(`/api/analyst/project/issue/priority/${projectId}`);
         if (prioRes.result && prioRes.data?.issue_priority) {
           const priorities: PriorityIssue[] = prioRes.data.issue_priority;
           setPriorityChart({
             series: [{ name: 'Issues', data: priorities.map(p => Number(p.total_issues)) }],
             options: {
               chart: { type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'inherit' },
               plotOptions: { bar: { horizontal: true, borderRadius: 6, dataLabels: { position: 'top' }, columnWidth: '40%' } },
               dataLabels: { enabled: true, offsetX: 20, style: { fontSize: '12px', colors: ['#4B5563'], fontWeight: 600 } },
               colors: ['#F59E0B'],
               xaxis: { categories: priorities.map(p => p.name), axisBorder: { show: false }, axisTicks: { show: false }, labels: { show: false } },
               yaxis: { labels: { style: { fontSize: '13px', fontWeight: 600, colors: '#4B5563' } } },
               grid: { show: false }
             }
           });
         }

         // Member Performance
         const perRes = await fetchApi(`/api/analyst/project/issue/assignee/${projectId}`);
         if (perRes.result && perRes.data?.issue) setPerformanceIssues(perRes.data.issue);

         // Month Bar Chart
         const monthRes = await fetchApi(`/api/analyst/project/issue/month/${projectId}`);
         if (monthRes.result && monthRes.data) {
            let monthsSet = new Set<string>();
            monthRes.data.forEach((stu: any) => { if(stu.status?.issue) stu.status.issue.forEach((issue: any) => monthsSet.add(issue.month)); });
            let months = Array.from(monthsSet).sort();
            
            let seriesDataMap = new Map<string, number[]>();
            monthRes.data.forEach((stu: any) => {
              let statusName = stu.status.name;
              if (!seriesDataMap.has(statusName)) seriesDataMap.set(statusName, new Array(months.length).fill(0));
              if(stu.status?.issue) stu.status.issue.forEach((issue: any) => {
                  let monthIndex = months.indexOf(issue.month);
                  seriesDataMap.get(statusName)![monthIndex] = parseInt(issue.total_issues) || 0;
              });
            });

            setMonthChart({
              series: Array.from(seriesDataMap, ([name, data]) => ({ name, data })),
              options: {
                chart: { type: 'bar', height: 350, toolbar: { show: false }, stacked: true, fontFamily: 'inherit' },
                plotOptions: { bar: { horizontal: false, columnWidth: '40%', borderRadius: 4 } },
                colors: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                dataLabels: { enabled: false },
                xaxis: { categories: months, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#6B7280', fontSize: '12px', fontWeight: 600 } } },
                yaxis: { labels: { style: { colors: '#6B7280', fontSize: '12px', fontWeight: 600 } } },
                grid: { borderColor: '#F3F4F6', strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
                legend: { position: 'top', horizontalAlign: 'right', fontSize: '13px', markers: { radius: 12 }, labels: { colors: '#4B5563' } }
              }
            });
         }
      } catch (error) { console.error(error); }
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

  const getStatusClasses = (statusName: string) => {
    const s = statusName.toLowerCase();
    if (s === 'done') return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
    if (s === 'in progress') return 'bg-blue-50 text-blue-700 ring-blue-600/20';
    if (s === 'to start') return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20';
    if (s === 'close' || s === 'closed') return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    return 'bg-orange-50 text-orange-700 ring-orange-600/20';
  };

  if(!projectId) return null;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Project Analytics</h1>
            <p className="text-sm text-gray-500 font-medium tracking-wide">In-depth insights and performance metrics</p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
               <Layers className="h-6 w-6" />
            </div>
            <div>
               <p className="text-gray-500 font-bold tracking-wider text-xs uppercase mb-1">Total Issues</p>
               <h2 className="text-3xl font-black text-gray-900">{totalIssues}</h2>
            </div>
         </div>
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-sky-200 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
               <AlertCircle className="h-6 w-6" />
            </div>
            <div>
               <p className="text-gray-500 font-bold tracking-wider text-xs uppercase mb-1">Sub-Issues</p>
               <h2 className="text-3xl font-black text-gray-900">{totalSubIssues}</h2>
            </div>
         </div>
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-amber-200 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
               <Users className="h-6 w-6" />
            </div>
            <div>
               <p className="text-gray-500 font-bold tracking-wider text-xs uppercase mb-1">Members</p>
               <h2 className="text-3xl font-black text-gray-900">{totalMembers}</h2>
            </div>
         </div>
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
               <BookOpen className="h-6 w-6" />
            </div>
            <div>
               <p className="text-gray-500 font-bold tracking-wider text-xs uppercase mb-1">Resources</p>
               <h2 className="text-3xl font-black text-gray-900">{totalResources}</h2>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Status Donut Chart */}
         <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm p-6 lg:p-8 flex flex-col h-[420px]">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><CircleDot className="h-5 w-5 text-indigo-500" /> Overall Status</h3>
            <div className="flex-1 flex items-center justify-center">
               {statusChart ? (
                 <Chart options={statusChart.options} series={statusChart.series} type="donut" width="100%" height={320} />
               ) : (
                 <div className="flex flex-col items-center justify-center text-gray-400">
                    <Activity className="h-12 w-12 opacity-20 mb-3" />
                    <p className="font-bold text-sm">No status data available</p>
                 </div>
               )}
            </div>
         </div>

         {/* Priority Bar Chart */}
         <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm p-6 lg:p-8 flex flex-col h-[420px]">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-500" /> Issues by Complexity</h3>
            <div className="flex-1 -ml-4">
               {priorityChart ? (
                 <Chart options={priorityChart.options} series={priorityChart.series} type="bar" height={300} />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Activity className="h-12 w-12 opacity-20 mb-3" />
                    <p className="font-bold text-sm">No priority data available</p>
                 </div>
               )}
            </div>
         </div>

         {/* Monthly Trends */}
         <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100/50 shadow-sm p-6 lg:p-8 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-500" /> Monthly Issue Volume & Completion</h3>
            <div className="-ml-3 mt-2">
               {monthChart ? (
                 <Chart options={monthChart.options} series={monthChart.series} type="bar" height={350} />
               ) : (
                 <div className="h-[350px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Activity className="h-12 w-12 opacity-20 mb-3" />
                    <p className="font-bold text-sm">No monthly trend data available</p>
                 </div>
               )}
            </div>
         </div>

         {/* Team Overview */}
         <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100/50 shadow-sm p-6 lg:p-8 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Users className="h-5 w-5 text-purple-500" /> Team Members</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar lg:flex-wrap">
               {members.length === 0 ? (
                  <p className="text-gray-400 font-medium py-8 text-center w-full bg-gray-50 rounded-2xl">No team members assigned</p>
               ) : (
                  members.map(mem => (
                     <div key={mem.user.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center min-w-[140px] hover:border-indigo-200 hover:shadow-md transition-all group">
                        <img src={`/upload/${mem.user.avarta}`} className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-sm mb-3 group-hover:scale-105 transition-transform bg-gray-200" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                        <span className="font-bold text-gray-900 text-sm truncate w-full text-center group-hover:text-indigo-600 transition-colors">{mem.user.first_name} {mem.user.last_name}</span>
                        <span className="text-xs font-medium text-gray-500 truncate w-full text-center mt-0.5">@{mem.user.dis_name || mem.user.first_name}</span>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Member Performance Table */}
         <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100/50 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 lg:px-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Activity className="h-5 w-5 text-rose-500" /> Performance Tracking</h3>
               <div className="relative w-full sm:w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search members, roles, categories..." 
                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-gray-700 bg-white shadow-sm"
                   value={searchMember}
                   onChange={(e) => setSearchMember(e.target.value)}
                 />
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-50 border-b border-gray-100">
                     <th className="py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                     <th className="py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                     <th className="py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Issue Reference</th>
                     <th className="py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell text-right">Progress</th>
                     <th className="py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                     <th className="py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-10"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {performanceIssues.length === 0 ? (
                      <tr><td colSpan={6} className="py-16 text-center text-gray-400 font-medium">No performance data available.</td></tr>
                   ) : filteredPerformances.length === 0 ? (
                      <tr><td colSpan={6} className="py-16 text-center text-gray-400 font-medium">No results found for "{searchMember}"</td></tr>
                   ) : (
                      filteredPerformances.map((mem, i) => (
                         <tr key={i} onClick={() => goToIssueDetail(mem.assignee.mainissueid)} className="hover:bg-indigo-50/50 transition-colors group cursor-pointer text-sm">
                            <td className="py-4 px-6 font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                               {mem.assignee.dis_name || mem.assignee.email}
                            </td>
                            <td className="py-4 px-6 text-gray-500 font-medium hidden md:table-cell">{mem.assignee.role?.name || '--'}</td>
                            <td className="py-4 px-6">
                               <p className="font-bold text-gray-800 line-clamp-1 truncate max-w-[200px] lg:max-w-xs">{mem.assignee.issuename}</p>
                               <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-wider">{mem.assignee.mainissue}</p>
                            </td>
                            <td className="py-4 px-6 hidden lg:table-cell text-right w-48">
                               <div className="flex items-center justify-end gap-3">
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${mem.assignee.progress || 0}%` }}></div>
                                  </div>
                                  <span className="text-xs font-black text-gray-600 w-8">{mem.assignee.progress || 0}%</span>
                               </div>
                            </td>
                            <td className="py-4 px-6 text-right w-36">
                               <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ring-1 ring-inset ${getStatusClasses(mem.status?.name || '')}`}>
                                  {mem.status?.name}
                               </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                               <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                            </td>
                         </tr>
                      ))
                   )}
                 </tbody>
               </table>
            </div>
         </div>

      </div>

    </div>
  );
};

export default AnalyticPage;
