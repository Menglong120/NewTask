'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { 
  Activity as ActivityIcon, 
  User, 
  Trash2, 
  ChevronRight,
  Clock,
  Briefcase,
  History,
  AlertCircle
} from 'lucide-react';

interface ActivityItem {
  id: string;
  activity: string;
  title: string;
  acted_on: string;
  actor: {
    user: {
      first_name: string;
      last_name: string;
      role: { name: string };
    }
  };
  project: { name: string };
}

interface GroupedActivities {
  [date: string]: ActivityItem[];
}

const ActivityPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectRes, activityRes] = await Promise.all([
          fetchApi(`/api/projects`),
          fetchApi(`/api/projects/activities/${id}?search&page=&perpage=`)
        ]);

        if (projectRes.result) {
          const project = projectRes.data.datas.find((p: any) => p.id === Number(id));
          if (project) setProjectName(project.name);
        }

        if (activityRes.result) {
          setActivities(activityRes.data.datas);
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const groupedActivities = useMemo(() => {
    const groups: GroupedActivities = {};
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

    const sorted = [...activities].sort((a, b) => 
      new Date(b.acted_on).getTime() - new Date(a.acted_on).getTime()
    );

    sorted.forEach(item => {
      const dateObj = new Date(item.acted_on);
      const dateString = dateObj.toLocaleDateString();
      let label = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      if (dateString === today) label = 'Today';
      else if (dateString === yesterday) label = 'Yesterday';

      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });

    return groups;
  }, [activities]);

  const handleDelete = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity log?')) return;
    try {
      const res = await fetchApi(`/api/projects/activity/${activityId}`, { method: 'DELETE' });
      if (res.result) {
        setActivities(activities.filter(a => a.id !== activityId));
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden gap-4">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-1 relative z-10 w-full">
          <div className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-widest pl-1">
            <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Workspace</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/60">{projectName}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-indigo-400 font-bold">Activity</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 ring-1 ring-indigo-500/20 shadow-inner">
               <ActivityIcon className="h-4 w-4" />
            </div>
            Activity Timeline
          </h1>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-bold text-white/40 cursor-default relative z-10 shadow-inner ring-1 ring-white/5 shrink-0">
          <History className="h-4 w-4 text-white/30" />
          AUDIT TRAIL
        </div>
      </div>

      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-6 md:p-10 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-30"></div>
        
        <div className="relative space-y-10 md:space-y-12 before:absolute before:left-8 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/50 before:via-white/10 before:to-transparent before:hidden md:before:block z-10">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-white/5 animate-pulse rounded-[1.5rem] border border-white/5 ml-0 md:ml-20"></div>
            ))
          ) : Object.keys(groupedActivities).length > 0 ? (
            Object.entries(groupedActivities).map(([date, items]) => (
              <div key={date} className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="hidden md:flex h-16 w-16 bg-[#0a0a0a] border border-[#121212] rounded-full flex items-center justify-center z-10 text-[10px] font-black text-indigo-400 shadow-[0_0_0_4px_#121212] uppercase text-center px-1 leading-tight ring-1 ring-white/10 shrink-0">
                    {date}
                  </div>
                  <div className="flex-1 border-t border-white/10 md:hidden"></div>
                  <h3 className="text-xs font-black tracking-widest text-indigo-400 uppercase md:hidden px-2">{date}</h3>
                </div>

                <div className="space-y-4 md:ml-20 relative">
                  {items.map((item) => (
                    <div key={item.id} className="bg-[#0a0a0a] p-5 rounded-[1.5rem] shadow-inner border border-white/5 hover:border-indigo-500/30 hover:shadow-[0_4px_20px_rgba(105,108,255,0.15)] transition-all group relative">
                       {/* Connector Triangle for Desktop */}
                       <div className="absolute top-8 w-0 h-0 border-[8px] border-transparent border-r-[#0a0a0a] -left-4 hidden md:block"></div>
                       <div className="absolute top-8 w-0 h-0 border-[9px] border-transparent border-r-white/5 -left-[18px] -z-10 hidden md:block transition-colors group-hover:border-r-indigo-500/30"></div>
                       
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 shrink-0 ring-1 ring-indigo-500/20 shadow-inner mt-1">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-[15px] leading-relaxed">
                              <span className="font-bold text-white text-base mr-1">{item.actor.user.first_name} {item.actor.user.last_name}</span>
                              <span className="mx-2 px-2 py-0.5 rounded-md bg-white/10 border border-white/5 text-[10px] font-black text-white/50 uppercase tracking-widest inline-flex align-middle">{item.actor.user.role.name}</span>
                              <span className="text-white/60 font-medium">{item.activity}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-black text-white/40 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md uppercase tracking-widest shadow-inner">
                                <Briefcase className="h-3.5 w-3.5 text-white/30" />
                                {item.project.name}
                              </div>
                              <span className="text-[13px] font-bold text-white/80 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">"{item.title}"</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 sm:pt-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-black text-white/30">
                            <Clock className="h-3.5 w-3.5 text-white/20" />
                            {new Date(item.acted_on).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 outline-none focus:ring-2 focus:ring-red-500/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-[#0a0a0a] rounded-[2rem] border border-dashed border-white/10 shadow-inner relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10 relative z-10">
                 <ActivityIcon className="h-10 w-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">No activity yet</h3>
              <p className="text-[15px] font-medium text-white/40 max-w-sm mx-auto relative z-10">Activities will appear here as soon as you and your team start working in this workspace.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
