'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { Bell, Check, X, Clock, ShieldAlert, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface NotificationRequest { id: string; description: string; status: number; created_on: string; user: { first_name: string; last_name: string; avarta: string; }; }
interface ActivityNotification { id: string; activity: string; title: string; acted_on: string; actor: { user: { first_name: string; last_name: string; avarta: string; } }; project: { name: string }; }

const formatTimeDifference = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (d > 0) return `${d} day${d > 1 ? 's' : ''} ago`;
  if (h > 0) return `${h} hour${h > 1 ? 's' : ''} ago`;
  if (m > 0) return `${m} minute${m > 1 ? 's' : ''} ago`;
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
      title: isApprove ? "Approve Request?" : "Reject Request?",
      text: isApprove ? "This will grant the requested access." : "This will deny the requested access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10B981" : "#EF4444",
      cancelButtonColor: "#333333",
      confirmButtonText: isApprove ? "Yes, approve it" : "Yes, reject it",
      background: '#121212',
      color: '#fff',
      customClass: { popup: 'rounded-3xl border border-white/10' }
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetchApi(`/api/request/password/${requestId}`, { method: 'PUT', body: JSON.stringify({ status: statusId }) });
        if (response.result) {
          await loadData();
          Swal.fire({ icon: "success", title: "Status Updated", toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: '#121212', color: '#fff' });
        }
      } catch (error) { console.error(error); }
    }
  };

  const renderSuperadminNotifications = (filteredRequests: NotificationRequest[]) => {
    if (loading) {
      return (
         <div className="flex flex-col items-center justify-center py-20 px-4">
            <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
            <p className="mt-4 text-white/50 font-bold animate-pulse">Loading requests...</p>
         </div>
      );
    }

    if (filteredRequests.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10 shadow-inner relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-5 relative z-10 border border-white/5"><ShieldAlert className="h-10 w-10 text-white/20" /></div>
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">No Requests Found</h3>
            <p className="text-white/40 font-medium text-center max-w-sm relative z-10">There are no administrative requests matching this criteria.</p>
         </div>
      );
    }

    const grouped = groupNotificationsByDate(filteredRequests, 'created_on');
    const elements: React.ReactNode[] = [];

    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    Object.entries(grouped).forEach(([date, notifs]) => {
      let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
      elements.push(
        <div key={date} className="mt-8 mb-4 first:mt-2">
            <span className="text-xs font-black uppercase tracking-wider text-white/40 bg-[#0a0a0a] px-4 py-1.5 rounded-full ring-1 ring-white/5 shadow-inner inline-flex items-center gap-2.5"><Clock className="w-3.5 h-3.5" />{displayDate}</span>
        </div>
      );

      (notifs as NotificationRequest[]).forEach(noti => {
        const isPending = noti.status === 1;
        const isApproved = noti.status === 2;
        const isRejected = noti.status === 3;
        
        const statusClasses = isPending ? 'bg-amber-500/10 border-amber-500/20' : isApproved ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20';
        const badgeClasses = isPending ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' : isApproved ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30';
        const statusText = isPending ? 'Pending' : isApproved ? 'Approved' : 'Rejected';
        const StatusIcon = isPending ? Clock : isApproved ? CheckCircle2 : XCircle;

        elements.push(
          <div key={noti.id} className={`flex flex-col sm:flex-row justify-between gap-4 p-5 mb-4 rounded-2xl border transition-all ${statusClasses} shadow-inner`}>
              <div className="flex gap-4">
                  <div className="shrink-0">
                      <img className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0a0a0a] shadow-[0_2px_10px_rgba(0,0,0,0.5)] bg-white/10" src={`/upload/${noti.user?.avarta}`} alt="" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                  </div>
                  <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1.5">
                         <h6 className="font-bold text-white text-lg">{noti.user?.first_name} {noti.user?.last_name}</h6>
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${badgeClasses}`}>
                            <StatusIcon className="w-3.5 h-3.5" /> {statusText}
                         </span>
                      </div>
                      <p className="text-sm text-white/60 font-medium leading-relaxed">{noti.description}</p>
                      <span className="text-xs font-bold text-white/30 mt-2 block w-full sm:hidden">{formatTimeDifference(noti.created_on)}</span>
                  </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-5 mt-3 sm:mt-0">
                  {isPending && (
                     <div className="flex items-center gap-2.5 mb-0 sm:mb-3">
                        <button onClick={() => handleRequestAction(noti.id, 2)} className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/20 focus:ring-2 focus:ring-emerald-500 outline-none">
                           <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleRequestAction(noti.id, 3)} className="h-9 px-4 bg-[#0a0a0a] hover:bg-white/5 text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-inner focus:ring-2 focus:ring-red-500 outline-none">
                           <X className="w-4 h-4" /> Reject
                        </button>
                     </div>
                  )}
                  <span className="text-xs font-bold text-white/30 hidden sm:block bg-[#0a0a0a] px-2.5 py-1 rounded-md border border-white/5">{formatTimeDifference(noti.created_on)}</span>
              </div>
          </div>
        );
      });
    });

    return <div className="animate-in fade-in duration-300">{elements}</div>;
  };

  const renderNormalUserActivity = () => {
    if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-10 w-10 text-indigo-400 animate-spin" /></div>;
    if (activities.length === 0) return <div className="text-center p-12 text-white/40 font-medium bg-white/[0.02] border border-white/5 rounded-3xl shadow-inner">No recent notifications across your projects.</div>;

    const grouped = groupNotificationsByDate(activities, 'acted_on');
    const elements: React.ReactNode[] = [];
    const todayStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    Object.entries(grouped).forEach(([date, acts]) => {
      let displayDate = date === todayStr ? "Today" : date === yesterdayStr ? "Yesterday" : date;
      elements.push(<div key={date} className="mt-8 mb-4 first:mt-2"><span className="text-xs font-black uppercase tracking-wider text-white/40 bg-[#0a0a0a] px-4 py-1.5 rounded-full ring-1 ring-white/5 shadow-inner">{displayDate}</span></div>);
      (acts as ActivityNotification[]).forEach(acti => {
        elements.push(
          <div key={acti.id} className="flex flex-col sm:flex-row justify-between gap-4 p-5 mb-3 rounded-2xl bg-[#0a0a0a] border border-white/5 shadow-inner hover:border-indigo-500/30 transition-all group">
            <div className="flex gap-4 items-center">
               <img className="w-10 h-10 rounded-full object-cover bg-white/10 ring-1 ring-white/10" src={`/upload/${acti.actor?.user?.avarta}`} alt="" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
               <div>
                 <h6 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-400 transition-colors">{acti.actor?.user?.first_name} {acti.actor?.user?.last_name}</h6>
                 <p className="text-sm text-white/50 font-medium m-0 leading-snug">{acti.activity} <span className="font-bold text-indigo-400">{acti.project?.name}</span> <span className="font-bold text-white/70 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-xs ml-1">{acti.title}</span></p>
               </div>
            </div>
            <div className="text-xs font-bold text-white/30 sm:text-right shrink-0 self-start sm:self-center ml-14 sm:ml-0">{formatTimeDifference(acti.acted_on)}</div>
          </div>
        );
      });
    });
    return <div className="animate-in fade-in duration-300">{elements}</div>;
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 space-y-6">
        
        {/* Header */}
        <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col items-start gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#696cff]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10 w-full">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)] shrink-0">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
              <p className="text-sm text-white/50 font-medium tracking-wide">Stay updated on approvals and team actions</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-6 lg:p-10 flex flex-col min-h-[500px] relative overflow-hidden">
          
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

          {userRole !== 1 && (
            <div className="flex-1 relative z-10">{renderNormalUserActivity()}</div>
          )}

          {userRole === 1 && (
            <div className="flex flex-col h-full relative z-10">
              {/* Tab Navigation */}
              <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl w-fit shadow-inner border border-white/5">
                 {[
                   { id: 'all', label: 'All Requests', icon: Bell },
                   { id: 'pending', label: 'Pending', icon: Clock },
                   { id: 'approved', label: 'Approved', icon: CheckCircle2 },
                   { id: 'rejected', label: 'Rejected', icon: XCircle }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500/50 ${activeTab === tab.id ? 'bg-[#1a1a1a] shadow-lg text-indigo-400 ring-1 ring-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                   >
                     <tab.icon className="w-4 h-4" />
                     {tab.label}
                   </button>
                 ))}
              </div>
              
              {/* Tab Content */}
              <div className="flex-1">
                 {activeTab === 'all' && renderSuperadminNotifications(requests)}
                 {activeTab === 'pending' && renderSuperadminNotifications(requests.filter(r => r.status === 1))}
                 {activeTab === 'approved' && renderSuperadminNotifications(requests.filter(r => r.status === 2))}
                 {activeTab === 'rejected' && renderSuperadminNotifications(requests.filter(r => r.status === 3))}
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default NotificationsPage;
