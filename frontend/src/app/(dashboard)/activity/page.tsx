'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Activity as ActivityIcon, Trash2, Clock, UserCircle, MapPin, Loader2 } from 'lucide-react';

interface Activity { id: string; activity: string; title: string; acted_on: string; actor: { user: { first_name: string; last_name: string; role: { name: string; }; }; }; project: { name: string; }; }

const ActivityPage = () => {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('projectID');
    if (!id) router.push('/home');
    else setProjectId(id);
  }, [router]);

  const loadActivities = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const response = await fetchApi(`/api/projects/activities/${projectId}?search&page=&perpage=`);
      if (response.result && response.data && Array.isArray(response.data.datas)) {
        setActivities(response.data.datas.sort((a: any, b: any) => new Date(b.acted_on).getTime() - new Date(a.acted_on).getTime()));
      } else { setActivities([]); }
    } catch (error) { console.error(error); setActivities([]); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadActivities(); }, [projectId]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ 
      title: "Delete Activity?", 
      text: "This action cannot be undone.", 
      icon: "warning", 
      showCancelButton: true, 
      confirmButtonColor: "#EF4444", 
      cancelButtonColor: "#333333", 
      confirmButtonText: "Yes, delete it",
      background: '#121212',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-white/10' } 
    });
    if (result.isConfirmed) {
      try {
        const response = await fetchApi(`/api/projects/activity/${id}`, { method: 'DELETE' });
        if (response.result) { 
          await loadActivities(); 
          Swal.fire({ title: "Deleted", text: "Activity removed successfully", icon: "success", toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#121212', color: '#fff' }); 
        }
      } catch (error) { console.error(error); }
    }
  };

  const renderActivities = () => {
    if (loading) {
      return (
         <div className="flex flex-col items-center justify-center py-20 px-4">
            <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
            <p className="mt-4 text-white/50 font-bold animate-pulse">Loading activity history...</p>
         </div>
      );
    }

    if (activities.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10 relative overflow-hidden shadow-inner">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-5 border border-white/5 relative z-10">
               <ActivityIcon className="h-10 w-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">No Recent Activity</h3>
            <p className="text-white/40 font-medium text-center max-w-sm relative z-10">There are no logged activities for this project yet. Actions taken will appear here.</p>
         </div>
      );
    }

    const activitiesByDate = activities.reduce((acc: any, acti) => {
      const date = new Date(acti.acted_on).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(acti);
      return acc;
    }, {});

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const todayStr = today.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/50 before:via-white/10 before:to-transparent">
        {Object.entries(activitiesByDate).map(([date, acts]) => {
          let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
          return (
            <div key={date} className="relative z-10">
               <div className="flex items-center md:justify-center mb-8 sticky top-24 z-20">
                  <div className="flex items-center px-5 py-2 bg-[#0a0a0a] border border-white/10 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                     <Clock className="w-4 h-4 text-white/40 mr-2.5" />
                     <span className="text-xs font-black uppercase tracking-widest text-white/60">{displayDate}</span>
                  </div>
               </div>

               <div className="space-y-6">
                 {(acts as Activity[]).map(acti => {
                    const timeStr = new Date(acti.acted_on).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
                    return (
                       <div key={acti.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          
                          {/* Timeline Dot */}
                          <div className="flex items-center justify-center w-16 h-16 rounded-full border-[#121212] bg-[#0a0a0a] text-indigo-400 shadow-[0_0_0_4px_#121212] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shrink-0 z-10 ring-1 ring-white/10 group-hover:text-indigo-300 group-hover:shadow-[0_0_15px_rgba(105,108,255,0.3)] transition-all">
                             <UserCircle className="h-7 w-7" />
                          </div>

                          {/* Content Card */}
                          <div className="w-[calc(100%-5rem)] md:w-[calc(50%-2.5rem)] bg-[#0a0a0a] p-5 rounded-[1.5rem] shadow-inner border border-white/5 group-hover:border-indigo-500/30 group-hover:shadow-[0_4px_20px_rgba(105,108,255,0.15)] transition-all flex flex-col gap-3 relative">
                             
                             <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5">
                                   <p className="text-sm text-white/60 leading-relaxed font-medium">
                                      <span className="font-bold text-white text-base mr-1">{acti.actor.user.first_name} {acti.actor.user.last_name}</span>
                                      <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/5 text-[10px] font-black text-white/50 uppercase tracking-widest mx-1">{acti.actor.user.role.name}</span>
                                      {acti.activity}
                                      <span className="font-bold text-indigo-400 mx-1.5">{acti.project.name}</span>
                                      <span className="text-white/80 font-bold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded shrink-0 leading-none">{acti.title}</span>
                                   </p>
                                </div>
                                <button onClick={() => handleDelete(acti.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all shrink-0">
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>

                             <div className="flex items-center gap-2 mt-0.5">
                                <Clock className="h-3.5 w-3.5 text-white/30" />
                                <span className="text-xs font-bold text-white/30">{timeStr}</span>
                             </div>

                             {/* Connector Triangle */}
                             <div className="absolute top-7 w-0 h-0 border-[8px] border-transparent md:group-odd:-left-4 md:group-odd:border-r-[#0a0a0a] md:group-even:-right-4 md:group-even:border-l-[#0a0a0a] border-r-[#0a0a0a] -left-4 md:hidden"></div>
                             <div className="absolute top-7 w-0 h-0 border-[9px] border-transparent md:group-odd:-left-[18px] md:group-odd:border-r-white/5 md:group-even:-right-[18px] md:group-even:border-l-white/5 border-r-white/5 -left-[18px] -z-10 md:hidden transition-colors group-hover:border-r-indigo-500/30 group-hover:border-l-indigo-500/30"></div>
                          </div>

                       </div>
                    );
                 })}
               </div>
            </div>
          );
        })}
      </div>
    );
  };

  if(!projectId) return null;

  return (
    <div className="p-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 space-y-6">
      
      {/* Header */}
      <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#696cff]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10 w-full">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)] shrink-0">
            <ActivityIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Project Activity</h1>
            <p className="text-sm text-white/50 font-medium tracking-wide">Track all actions and updates in chronological order</p>
          </div>
        </div>
      </div>

      {/* Timeline Wrapper */}
      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-6 lg:p-10 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-30"></div>
        {renderActivities()}
      </div>

    </div>
  );
};

export default ActivityPage;
