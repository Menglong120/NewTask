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
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { NotificationRequest, ActivityNotification } from '@/types/notification';

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
            const projectList = projectsRes.data.datas || [];
            for (const project of projectList) {
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
      title: isApprove ? "Confirm Approval?" : "Confirm Rejection?",
      text: isApprove ? "This will grant the user their requested access." : "This will deny the security request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10b981" : "#ef4444",
      confirmButtonText: isApprove ? "Yes, approve" : "Yes, reject",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetchApi(`/api/request/password/${requestId}`, { method: 'PUT', body: JSON.stringify({ status: statusId }) });
        if (response.result) {
          await loadData();
          Swal.fire({ icon: "success", title: "Updated successfully", toast: true, position: "top-end", showConfirmButton: false, timer: 3000 });
        }
      } catch (error) { console.error(error); }
    }
  };

  const renderSuperadminNotifications = (filteredRequests: NotificationRequest[]) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing administrative feed...</p>
        </div>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center border-dashed border-2 rounded-2xl bg-muted/20">
          <div className="p-4 bg-background rounded-full border mb-4 shadow-sm opacity-50">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-1">Queue is clear</h3>
          <p className="text-sm text-muted-foreground max-w-xs">No pending requests require your attention at this time.</p>
        </div>
      );
    }

    const grouped = groupNotificationsByDate(filteredRequests, 'created_on');
    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        {Object.entries(grouped).map(([date, notifs]) => {
          let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
          return (
            <div key={date} className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 font-bold bg-background border shadow-sm">
                  <Clock className="w-3.5 h-3.5 mr-2 opacity-60" /> {displayDate}
                </Badge>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid gap-4">
                {(notifs as NotificationRequest[]).map(noti => {
                  const isPending = noti.status === 1;
                  const isApproved = noti.status === 2;

                  return (
                    <Card key={noti.id} className={cn(
                      "group border shadow-sm transition-all overflow-hidden",
                      isPending ? "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40" :
                        isApproved ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40" :
                          "border-destructive/20 bg-destructive/5 hover:border-destructive/40"
                    )}>
                      <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-10 w-10 border shrink-0 mt-0.5">
                            <AvatarFallback className="bg-background text-foreground font-bold text-xs uppercase">
                              {noti.user?.first_name[0]}{noti.user?.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-base leading-none">{noti.user?.first_name} {noti.user?.last_name}</span>
                              <Badge variant={isPending ? "outline" : isApproved ? "secondary" : "destructive"}
                                className={cn(
                                  "h-5 px-1.5 text-[9px] font-bold uppercase tracking-widest leading-none",
                                  isPending ? "text-amber-600 border-amber-600/30" :
                                    isApproved ? "bg-emerald-600 text-white border-transparent" :
                                      "bg-destructive text-white border-transparent"
                                )}>
                                {isPending ? 'Pending Action' : isApproved ? 'Granted' : 'Revoked'}
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
                                className="h-8 bg-emerald-600 hover:bg-emerald-500 font-bold px-4 text-xs gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm" variant="outline"
                                onClick={() => handleRequestAction(noti.id, 3)}
                                className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10 font-bold px-4 text-xs gap-1.5"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </Button>
                            </div>
                          )}
                          <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5 px-2 py-1 bg-background rounded-md border shadow-sm shrink-0 tabular-nums">
                            <Clock className="w-3 h-3 opacity-60" /> {formatTimeDifference(noti.created_on)}
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
    if (loading) return <div className="grow flex flex-col items-center justify-center py-24 gap-4"><Loader2 className="h-10 w-10 text-primary animate-spin" /><p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing notification stream...</p></div>;

    if (activities.length === 0) return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-dashed border-2 rounded-2xl bg-muted/20">
        <div className="p-4 bg-background rounded-full border mb-4 shadow-sm opacity-50">
          <Bell className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold mb-1">Stay tuned</h3>
        <p className="text-sm text-muted-foreground max-w-xs">Critical updates from your projects and team will appear here.</p>
      </div>
    );

    const grouped = groupNotificationsByDate(activities, 'acted_on');
    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        {Object.entries(grouped).map(([date, acts]) => {
          let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
          return (
            <div key={date} className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 font-bold bg-background border shadow-sm">
                  <Calendar className="w-3.5 h-3.5 mr-2 opacity-60" /> {displayDate}
                </Badge>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid gap-3">
                {(acts as ActivityNotification[]).map(acti => (
                  <Card key={acti.id} className="group border shadow-sm bg-card hover:bg-muted/5 transition-all overflow-hidden">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Avatar className="h-9 w-9 border shrink-0">
                          <AvatarFallback className="bg-muted text-foreground font-bold text-[10px]">
                            {acti.actor?.user?.first_name[0]}{acti.actor?.user?.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h6 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors truncate">{acti.actor?.user?.first_name} {acti.actor?.user?.last_name}</h6>
                          <div className="text-sm text-muted-foreground font-medium m-0 flex items-center flex-wrap gap-1.5 mt-0.5">
                            <span className="opacity-80">{acti.activity}</span>
                            <Badge variant="outline" className="h-5 px-1.5 bg-muted/50 border-border text-muted-foreground text-[9px] font-bold uppercase tracking-widest">{acti.project?.name}</Badge>
                            <span className="font-bold text-foreground/80 truncate shrink-0 px-1 bg-muted/30 rounded">{acti.title}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest sm:text-right shrink-0 ml-13 sm:ml-0 px-2 py-1 bg-muted/30 rounded tabular-nums">
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
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Bell className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-primary">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActiveTab('all')}>Communications</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Notification Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">System Notifications</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-8 px-3 font-semibold text-xs gap-2 border">
            {userRole === 1 ? <ShieldCheck className="h-3.5 w-3.5 text-primary" /> : <Inbox className="h-3.5 w-3.5 text-primary" />}
            {userRole === 1 ? "Admin Control" : "Project Updates"}
          </Badge>
        </div>
      </div>

      {/* Content Body */}
      <div className="min-h-[500px]">
        {userRole !== 1 && (
          <div className="space-y-6">
            {renderNormalUserActivity()}
          </div>
        )}

        {userRole === 1 && (
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="h-12 w-fit bg-muted/40 border p-1 mb-8 rounded-xl shadow-inner group">
              <TabsTrigger value="all" className="px-6 font-bold text-xs gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
                <Inbox className="w-4 h-4" /> All Logs
              </TabsTrigger>
              <TabsTrigger value="pending" className="px-6 font-bold text-xs gap-2 rounded-lg data-[state=active]:bg-amber-100 data-[state=active]:shadow-sm data-[state=active]:text-amber-800 dark:data-[state=active]:bg-amber-900/40 dark:data-[state=active]:text-amber-400">
                <AlertTriangle className="w-4 h-4" /> Pending Approval
              </TabsTrigger>
              <TabsTrigger value="approved" className="px-6 font-bold text-xs gap-2 rounded-lg data-[state=active]:bg-emerald-100 data-[state=active]:shadow-sm data-[state=active]:text-emerald-800 dark:data-[state=active]:bg-emerald-900/40 dark:data-[state=active]:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Granted Access
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0 focus-visible:outline-none">
              {renderSuperadminNotifications(requests)}
            </TabsContent>
            <TabsContent value="pending" className="mt-0 focus-visible:outline-none">
              {renderSuperadminNotifications(requests.filter(r => r.status === 1))}
            </TabsContent>
            <TabsContent value="approved" className="mt-0 focus-visible:outline-none">
              {renderSuperadminNotifications(requests.filter(r => r.status === 2))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
