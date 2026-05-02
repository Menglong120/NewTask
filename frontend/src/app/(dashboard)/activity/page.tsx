'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Activity as ActivityIcon, Trash2, Clock, UserCircle, MapPin, Loader2, History, Shield, Briefcase, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { ActivityItem } from '@/types/activity';

const ActivityPage = () => {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDeleteActivityId, setPendingDeleteActivityId] = useState<string | null>(null);

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
        setActivities(response.data.datas.sort((a: ActivityItem, b: ActivityItem) => new Date(b.acted_on).getTime() - new Date(a.acted_on).getTime()));
      } else { setActivities([]); }
    } catch (error) { console.error(error); setActivities([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadActivities(); }, [projectId]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetchApi(`/api/projects/activity/${id}`, { method: 'DELETE' });
      if (response.result) {
        await loadActivities();
        Swal.fire({ title: "Deleted", icon: "success", toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      }
    } catch (error) { console.error(error); }
    finally { setPendingDeleteActivityId(null); }
  };

  const renderActivities = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing timeline history...</p>
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center border-dashed border-2 rounded-2xl bg-muted/20">
          <div className="p-4 bg-background rounded-full border mb-4 shadow-sm opacity-50">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-1">No activity found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">Actions performed in this project will appear here automatically.</p>
        </div>
      );
    }

    const activitiesByDate = activities.reduce((acc: Record<string, ActivityItem[]>, acti) => {
      const date = new Date(acti.acted_on).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(acti);
      return acc;
    }, {});

    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-12 relative pb-12">
        {/* Continuous Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 z-0" />

        {Object.entries(activitiesByDate).map(([date, acts]) => {
          let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
          return (
            <div key={date} className="relative space-y-8 z-10">
              <div className="flex justify-center sticky top-0 py-2 z-20">
                <Badge variant="secondary" className="px-4 py-1 font-bold shadow-sm ring-1 ring-border bg-background">
                  <Clock className="w-3.5 h-3.5 mr-2 opacity-60" /> {displayDate}
                </Badge>
              </div>

              <div className="space-y-6">
                {(acts as ActivityItem[]).map((acti, idx) => {
                  const timeStr = new Date(acti.acted_on).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
                  const isEven = idx % 2 === 0;
                  return (
                    <div key={acti.id} className={cn(
                      "flex items-center justify-between gap-4",
                      "flex-row md:flex-row",
                      !isEven && "md:flex-row-reverse"
                    )}>

                      {/* Content Card */}
                      <div className="w-full md:w-[calc(50%-2rem)] ml-12 md:ml-0">
                        <Card className="hover:shadow-md transition-shadow group border shadow-sm">
                          <CardContent className="p-4 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-9 w-9 border shrink-0">
                                  <AvatarFallback className="bg-muted text-foreground font-bold text-[10px]">
                                    {acti.actor.user.first_name[0]}{acti.actor.user.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1.5 min-w-0">
                                  <div className="flex flex-col gap-1.5 leading-tight overflow-hidden">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-sm whitespace-nowrap">{acti.actor.user.first_name} {acti.actor.user.last_name}</span>
                                      <Badge variant="outline" className="text-[9px] font-bold h-4 px-1 leading-none uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                                        {acti.actor.user.role.name}
                                      </Badge>
                                    </div>
                                    <div 
                                      className="text-sm text-muted-foreground break-words [&>strong]:text-foreground [&>strong]:font-bold" 
                                      dangerouslySetInnerHTML={{ __html: acti.activity }}
                                    />
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[9px] font-bold bg-muted/40 border-border/50 text-muted-foreground pr-2">
                                      <Briefcase className="h-3 w-3 opacity-40" /> {acti.project.name}
                                    </Badge>
                                    <span className="text-xs font-semibold text-primary/80 bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 truncate max-w-[200px]">
                                      {acti.title}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem onClick={() => setPendingDeleteActivityId(acti.id)} variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                    Delete Entry
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 pl-12 uppercase tracking-widest">
                               {timeStr}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Dot Marker */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background bg-primary ring-4 ring-background z-10 shadow-sm" />
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
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <History className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Activity Log</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Project History</h1>
          </div>
        </div>
        <Badge variant="outline" className="h-8 px-3 font-semibold text-xs gap-2 border">
          <ActivityIcon className="h-3.5 w-3.5 text-primary" /> Audit Trail
        </Badge>
      </div>

      {/* Main Content */}
      <div className="bg-background border rounded-2xl shadow-sm min-h-[600px] p-6 md:p-12 relative overflow-hidden">
        {renderActivities()}
      </div>

      <ConfirmActionDialog
        open={pendingDeleteActivityId !== null}
        onOpenChange={(open) => !open && setPendingDeleteActivityId(null)}
        title="Delete activity entry?"
        description="This record will be permanently removed from the audit trail."
        confirmLabel="Delete entry"
        onConfirm={() => {
          if (!pendingDeleteActivityId) return
          return handleDelete(pendingDeleteActivityId)
        }}
      />

    </div>
  );
};

export default ActivityPage;
