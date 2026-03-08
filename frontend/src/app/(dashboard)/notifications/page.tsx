'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import {
  Bell,
  Check,
  X,
  Clock,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  User,
  Inbox,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface NotificationRequest {
  id: string;
  description: string;
  status: number;
  created_on: string;
  user: { first_name: string; last_name: string; avarta: string; };
}

interface ActivityNotification {
  id: string;
  activity: string;
  title: string;
  acted_on: string;
  actor: { user: { first_name: string; last_name: string; avarta: string; } };
  project: { name: string };
}

const formatTimeDifference = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'Just now';
};

const groupNotificationsByDate = (notifications: any[], dateField: string) => {
  return notifications.reduce((grouped: any, noti: any) => {
    const date = new Date(noti[dateField]).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(noti);
    return grouped;
  }, {});
};

const NotificationsPage = () => {
  const [requests, setRequests] = useState<NotificationRequest[]>([]);
  const [activities, setActivities] = useState<ActivityNotification[]>([]);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const profileRes = await fetchApi('/api/profile');
      if (profileRes.result && profileRes.data.length > 0) {
        const role = profileRes.data[0].role.id;
        setUserRole(role);
        if (role === 1) {
          const reqRes = await fetchApi('/api/requests/passwords');
          if (reqRes.result) setRequests(reqRes.data.sort((a: any, b: any) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime()));
        } else {
          const projectsRes = await fetchApi('/api/projects');
          if (projectsRes.result) {
            let allActs: ActivityNotification[] = [];
            for (const project of (projectsRes.data.datas || [])) {
              const res = await fetchApi(`/api/projects/activities/${project.id}?search&page=&perpage=`);
              if (res.result && res.data && res.data.datas) {
                const oneWeekAgo = new Date(); oneWeekAgo.setDate(new Date().getDate() - 6);
                allActs = allActs.concat(res.data.datas.filter((a: any) => new Date(a.acted_on) >= oneWeekAgo));
              }
            }
            setActivities(allActs.sort((a, b) => new Date(b.acted_on).getTime() - new Date(a.acted_on).getTime()));
          }
        }
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleRequestAction = async (requestId: string, statusId: number) => {
    const isApprove = statusId === 2;
    const result = await Swal.fire({
      title: isApprove ? "Confirm Approval" : "Confirm Rejection",
      text: isApprove ? "Grant requested access to the user?" : "Deny the security request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10B981" : "#EF4444",
      confirmButtonText: isApprove ? "Yes, approve" : "Yes, reject",
      background: '#121212',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetchApi(`/api/request/password/${requestId}`, { method: 'PUT', body: JSON.stringify({ status: statusId }) });
        if (response.result) {
          await loadData();
          Swal.fire({ icon: "success", title: "Updated", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: '#121212', color: '#fff' });
        }
      } catch (error) { console.error(error); }
    }
  };

  const renderSuperadminNotifications = (filteredRequests: NotificationRequest[]) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Streaming data...</p>
        </div>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <Card className="flex flex-col items-center justify-center py-20 border-dashed border-white/10 bg-transparent text-center">
          <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 opacity-20">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-1">Queue Empty</h3>
          <p className="text-muted-foreground max-w-sm font-medium">There are no administrative requests pending in this category.</p>
        </Card>
      );
    }

    const grouped = groupNotificationsByDate(filteredRequests, 'created_on');
    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {Object.entries(grouped).map(([date, notifs]) => {
          let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
          return (
            <div key={date} className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-4 h-8 bg-background border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
                  <Clock className="w-3.5 h-3.5 mr-2" /> {displayDate}
                </Badge>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              <div className="grid gap-4">
                {(notifs as NotificationRequest[]).map(noti => {
                  const isPending = noti.status === 1;
                  const isApproved = noti.status === 2;

                  return (
                    <Card key={noti.id} className={cn(
                      "group border-white/5 transition-all overflow-hidden",
                      isPending ? "bg-amber-500/[0.02] hover:bg-amber-500/[0.04] border-amber-500/10 hover:border-amber-500/20" :
                        isApproved ? "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] border-emerald-500/10 hover:border-emerald-500/20" :
                          "bg-destructive/[0.02] hover:bg-destructive/[0.04] border-destructive/10 hover:border-destructive/20"
                    )}>
                      <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-11 w-11 ring-2 ring-background shrink-0 mt-0.5">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                              {noti.user?.first_name[0]}{noti.user?.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-foreground text-lg">{noti.user?.first_name} {noti.user?.last_name}</span>
                              <Badge variant={isPending ? "outline" : isApproved ? "secondary" : "destructive"}
                                className={cn(
                                  "h-5 px-1.5 text-[9px] font-black uppercase tracking-tighter",
                                  isPending ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                    isApproved ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                      "bg-red-500/10 text-red-500 border-red-500/20"
                                )}>
                                {isPending ? 'Pending' : isApproved ? 'Granted' : 'Revoked'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">{noti.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pl-14 md:pl-0">
                          {isPending && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(noti.id, 2)}
                                className="h-8 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs gap-1.5 shadow-lg shadow-emerald-500/20"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm" variant="ghost"
                                onClick={() => handleRequestAction(noti.id, 3)}
                                className="h-8 text-destructive hover:bg-destructive/10 font-bold text-xs gap-1.5"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </Button>
                            </div>
                          )}
                          <div className="text-[11px] font-bold text-muted-foreground opacity-40 flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            <Clock className="w-3 h-3" /> {formatTimeDifference(noti.created_on)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNormalUserActivity = () => {
    if (loading) return <div className="flex grow flex-col items-center justify-center py-20 gap-4 opacity-50"><Loader2 className="h-8 w-8 text-primary animate-spin" /><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing feed...</p></div>;

    if (activities.length === 0) return (
      <Card className="py-20 text-center border-dashed border-white/10 bg-transparent flex flex-col items-center">
        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 opacity-20">
          <Bell className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold mb-1">Stay Tuned</h3>
        <p className="text-muted-foreground max-w-sm font-medium">Any critical updates from your projects and team members will be highlighted here.</p>
      </Card>
    );

    const grouped = groupNotificationsByDate(activities, 'acted_on');
    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {Object.entries(grouped).map(([date, acts]) => {
          let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
          return (
            <div key={date} className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-4 h-8 bg-background border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
                  <Calendar className="w-3.5 h-3.5 mr-2" /> {displayDate}
                </Badge>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              <div className="grid gap-3">
                {(acts as ActivityNotification[]).map(acti => (
                  <Card key={acti.id} className="group border-white/5 bg-[#0a0a0a]/50 hover:bg-white/[0.04] transition-all relative overflow-hidden">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pr-6">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 ring-2 ring-background shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {acti.actor?.user?.first_name[0]}{acti.actor?.user?.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h6 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate">{acti.actor?.user?.first_name} {acti.actor?.user?.last_name}</h6>
                          <p className="text-sm text-muted-foreground font-medium m-0 leading-tight flex items-center flex-wrap gap-1.5 mt-0.5">
                            <span>{acti.activity}</span>
                            <Badge variant="outline" className="h-5 px-1.5 bg-primary/5 border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">{acti.project?.name}</Badge>
                            <span className="font-bold text-foreground/70 decoration-primary/30 underline underline-offset-2 shrink-0">{acti.title}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest sm:text-right shrink-0 ml-14 sm:ml-0 bg-white/5 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {formatTimeDifference(acti.acted_on)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <Bell className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-primary">
                <span>Notifications</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">Activity Stream</span>
              </div>
              <CardTitle className="text-2xl font-bold">Signal Feed</CardTitle>
              <CardDescription className="text-xs font-semibold text-muted-foreground/60">Real-time collaboration updates and system alerts.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Body */}
      <div className="min-h-[500px] relative">
        {userRole !== 1 && (
          <div className="space-y-6">
            {renderNormalUserActivity()}
          </div>
        )}

        {userRole === 1 && (
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="h-11 bg-white/[0.03] border border-white/10 p-1 mb-8">
              <TabsTrigger value="all" className="px-6 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Inbox className="w-4 h-4" /> All Log
              </TabsTrigger>
              <TabsTrigger value="pending" className="px-6 font-bold text-xs gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Clock className="w-4 h-4" /> Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="px-6 font-bold text-xs gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <CheckCircle2 className="w-4 h-4" /> Granted
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {renderSuperadminNotifications(requests)}
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              {renderSuperadminNotifications(requests.filter(r => r.status === 1))}
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              {renderSuperadminNotifications(requests.filter(r => r.status === 2))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
