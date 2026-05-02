'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import {
  Activity as ActivityIcon,
  User,
  Trash2,
  MoreVertical,
  ChevronRight,
  Clock,
  Briefcase,
  History,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { ActivityItem, GroupedActivities } from '@/types/activity';

const ActivityPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingDeleteActivityId, setPendingDeleteActivityId] = useState<string | null>(null);

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
    try {
      const res = await fetchApi(`/api/projects/activity/${activityId}`, { method: 'DELETE' });
      if (res.result) {
        setActivities(activities.filter(a => a.id !== activityId));
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    } finally {
      setPendingDeleteActivityId(null);
    }
  };

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
                <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Workspace</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{projectName || 'Project'}</span>
              </div>
              <CardTitle className="text-2xl font-bold">Activity Audit Timeline</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className="h-9 px-4 bg-white/5 border-white/10 text-muted-foreground font-black uppercase tracking-widest text-[10px] gap-2">
            <ActivityIcon className="h-3.5 w-3.5" /> Live Log
          </Badge>
        </CardHeader>
      </Card>

      <Card className="border-white/5 bg-card min-h-[500px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.01] to-transparent pointer-events-none" />
        <CardContent className="p-8 relative z-10">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
              ))}
            </div>
          ) : Object.keys(groupedActivities).length > 0 ? (
            <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
              {Object.entries(groupedActivities).map(([date, items]) => (
                <div key={date} className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center z-10 shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">{date}</span>
                    <Separator className="flex-1 bg-white/5" />
                  </div>

                  <div className="space-y-4 pl-12">
                    {items.map((item) => (
                      <div key={item.id} className="group relative bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 p-5 rounded-2xl transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10 ring-2 ring-background ring-offset-2 ring-offset-white/5 shrink-0 mt-0.5">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                                {item.actor.user.first_name[0]}{item.actor.user.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="text-[15px] leading-snug">
                                <span className="font-bold text-foreground">{item.actor.user.first_name} {item.actor.user.last_name}</span>
                                <Badge variant="outline" className="mx-2 h-5 px-1.5 text-[9px] font-black uppercase tracking-tighter bg-white/5 border-white/10 text-muted-foreground align-middle">
                                  {item.actor.user.role.name}
                                </Badge>
                                <span className="text-muted-foreground font-medium">{item.activity}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="h-6 gap-1 px-2 text-[10px] font-bold bg-primary/5 text-primary border-transparent">
                                  <Briefcase className="h-3 w-3 opacity-50" /> {item.project.name}
                                </Badge>
                                <span className="text-[13px] font-bold text-foreground/70 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 shrink-0">
                                  "{item.title}"
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                              <Clock className="h-3.5 w-3.5 opacity-50" />
                              {new Date(item.acted_on).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => setPendingDeleteActivityId(item.id)} variant="destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Delete Entry
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <ActivityIcon className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold mb-1">No Trace Found</h3>
              <p className="text-muted-foreground max-w-sm font-medium">Once team members start adding tasks or updating files, their footprints will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmActionDialog
        open={pendingDeleteActivityId !== null}
        onOpenChange={(open) => !open && setPendingDeleteActivityId(null)}
        title="Delete activity entry?"
        description="This record will be permanently removed from the project activity log."
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
