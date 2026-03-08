'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Activity as ActivityIcon, Trash2, Clock, UserCircle, MapPin, Loader2, History, Shield, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  activity: string;
  title: string;
  acted_on: string;
  actor: {
    user: {
      first_name: string;
      last_name: string;
      role: { name: string; };
    };
  };
  project: { name: string; };
}

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
      confirmButtonText: "Yes, delete it",
      background: '#121212',
      color: '#fff',
    });
    if (result.isConfirmed) {
      try {
        const response = await fetchApi(`/api/projects/activity/${id}`, { method: 'DELETE' });
        if (response.result) {
          await loadActivities();
          Swal.fire({ title: "Deleted", icon: "success", toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#121212', color: '#fff' });
        }
      } catch (error) { console.error(error); }
    }
  };

  const renderActivities = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium anonymous">Fetching project history...</p>
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <Card className="flex flex-col items-center justify-center py-20 px-4 border-dashed border-white/10 bg-transparent text-center">
          <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-5 ring-1 ring-white/10 opacity-20">
            <ActivityIcon className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Recent Activity</h3>
          <p className="text-muted-foreground max-w-sm font-medium">Any actions or updates in this workspace will be recorded and displayed here.</p>
        </Card>
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
      <div className="space-y-12 relative before:absolute before:left-[19px] md:before:left-1/2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
        {Object.entries(activitiesByDate).map(([date, acts]) => {
          let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
          return (
            <div key={date} className="relative space-y-8">
              <div className="flex items-center md:justify-center sticky top-0 z-20 py-2">
                <Badge variant="outline" className="px-4 h-8 bg-background border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/5">
                  <Clock className="w-3.5 h-3.5 mr-2 opacity-70" /> {displayDate}
                </Badge>
              </div>

              <div className="space-y-6">
                {(acts as Activity[]).map((acti, idx) => {
                  const timeStr = new Date(acti.acted_on).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
                  const isEven = idx % 2 === 0;
                  return (
                    <div key={acti.id} className={cn(
                      "relative flex items-center justify-between group",
                      "md:flex-row",
                      !isEven && "md:flex-row-reverse"
                    )}>

                      {/* Timeline Marker */}
                      <div className="absolute left-[10px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-background border-2 border-primary/40 z-10 shadow-[0_0_10px_rgba(105,108,255,0.3)] group-hover:border-primary transition-colors">
                        <div className="w-full h-full rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-100" />
                      </div>

                      {/* Content Card Area */}
                      <Card className={cn(
                        "w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative overflow-hidden",
                        "ml-12 md:ml-0"
                      )}>
                        <CardContent className="p-5 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10 ring-2 ring-background shrink-0 mt-0.5">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                  {acti.actor.user.first_name[0]}{acti.actor.user.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <p className="text-sm leading-relaxed text-foreground/80">
                                  <span className="font-bold text-foreground text-base mr-1">{acti.actor.user.first_name} {acti.actor.user.last_name}</span>
                                  <Badge variant="outline" className="mx-1.5 h-5 px-1.5 text-[9px] font-black uppercase tracking-tighter bg-white/5 border-white/10 text-muted-foreground align-middle">
                                    {acti.actor.user.role.name}
                                  </Badge>
                                  <span className="font-medium">{acti.activity}</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="secondary" className="h-6 gap-1 px-2 text-[10px] font-bold bg-primary/5 text-primary border-transparent">
                                    <Briefcase className="h-3 w-3 opacity-50" /> {acti.project.name}
                                  </Badge>
                                  <span className="text-[13px] font-bold text-foreground/70 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 truncate max-w-[200px]">
                                    "{acti.title}"
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => handleDelete(acti.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-muted-foreground opacity-50">
                            <Clock className="h-3.5 w-3.5" /> {timeStr}
                          </div>
                        </CardContent>
                      </Card>
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

  if (!projectId) return null;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <History className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">Activity Log</span>
              </div>
              <CardTitle className="text-2xl font-bold">Workspace Journal</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className="h-9 px-4 bg-white/5 border-white/10 text-muted-foreground font-black uppercase tracking-widest text-[10px] gap-2">
            <ActivityIcon className="h-3.5 w-3.5" /> Project Specific
          </Badge>
        </CardHeader>
      </Card>

      {/* Timeline Section */}
      <Card className="border-white/5 bg-card min-h-[500px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.01] to-transparent pointer-events-none" />
        <CardContent className="p-8 relative z-10">
          {renderActivities()}
        </CardContent>
      </Card>

    </div>
  );
};

export default ActivityPage;
