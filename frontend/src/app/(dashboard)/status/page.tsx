'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Settings2,
  Activity,
  ChevronRight,
  Loader2,
  Zap
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface Status {
  id: number;
  title: string;
}

const StatusPage = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<number | null>(null);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const [statusRes, profileRes] = await Promise.all([
        fetchApi('/api/projects/status?search=&page=&perpage='),
        fetchApi('/api/profile')
      ]);

      if (statusRes.result) setStatuses(statusRes.data.datas || statusRes.data);
      if (profileRes.result && profileRes.data.length > 0) {
        setRoleId(profileRes.data[0].role.id);
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const canDelete = (status: Status) => {
    return statuses.length > 4 && roleId !== 2;
  };

  const deletestatus = async (id: number) => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "Removing this status may affect existing project workflows.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it",
      background: '#0F172A',
      color: '#f8fafc'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetchApi(`/api/projects/status/${id}`, { method: 'DELETE' });
        if (res.result) {
          fetchStatuses();
          Swal.fire({ title: "Deleted", text: "Status removed successfully", icon: "success", timer: 2000, showConfirmButton: false, background: '#0F172A', color: '#f8fafc' });
        } else {
          let errorMessage = res.msg || "Operation failed";
          if (res.data && res.data.length > 0) {
            const projectNames = res.data.map((p: any) => p.name).join(', ');
            errorMessage += `<br><br><strong>In use by:</strong> ${projectNames}`;
          }
          Swal.fire({ title: "Restricted", html: errorMessage, icon: "error", background: '#0F172A', color: '#f8fafc' });
        }
      } catch (error) { }
    }
  };

  const getStatusColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-rose-500 to-red-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Modern Glassmorphism Header */}
      <div className="bg-[#121212]/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        
        {/* Decorative Background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#696cff]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-[#696cff]/10 text-[#696cff] rounded-2xl ring-1 ring-[#696cff]/20 shadow-lg shadow-[#696cff]/10">
            <Settings2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#696cff] uppercase tracking-[0.2em] mb-1">
              <span>Configuration</span>
              <ChevronRight className="h-3 w-3 opacity-50" />
              <span className="text-white/60">Issue Lifecycle</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">Lifecycle <span className="text-[#696cff]">Stages</span></h1>
            <p className="text-white/40 text-sm font-medium">Manage project workflow states and automated transitions.</p>
          </div>
        </div>

        <Button className="h-12 px-6 gap-2 font-black uppercase tracking-widest text-xs bg-[#696cff] hover:bg-[#696cff]/90 text-white shadow-lg shadow-[#696cff]/20 rounded-xl relative z-10 transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Plus className="h-4 w-4 stroke-[3]" /> Add New Status
        </Button>
      </div>

      {/* Stats overview */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-indigo-600/10 to-transparent backdrop-blur-sm border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><Zap className="h-24 w-24 text-indigo-400" /></div>
            <p className="text-indigo-300/60 font-black tracking-widest text-[10px] uppercase mb-1">TOTAL STAGES</p>
            <h2 className="text-4xl font-black text-white">{statuses.length}</h2>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/10 to-transparent backdrop-blur-sm border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><Activity className="h-24 w-24 text-emerald-400" /></div>
            <p className="text-emerald-300/60 font-black tracking-widest text-[10px] uppercase mb-1">ACTIVE STATES</p>
            <h2 className="text-4xl font-black text-white">{statuses.length}</h2>
          </div>

          <div className="bg-gradient-to-br from-amber-600/10 to-transparent backdrop-blur-sm border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><ShieldAlert className="h-24 w-24 text-amber-400" /></div>
            <p className="text-amber-300/60 font-black tracking-widest text-[10px] uppercase mb-1">PROTECTED</p>
            <h2 className="text-4xl font-black text-white">Yes</h2>
          </div>

          <div className="bg-gradient-to-br from-sky-600/10 to-transparent backdrop-blur-sm border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500"><CheckCircle2 className="h-24 w-24 text-sky-400" /></div>
             <p className="text-sky-300/60 font-black tracking-widest text-[10px] uppercase mb-1">HEALTHY</p>
             <h2 className="text-4xl font-black text-white">100%</h2>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
          ))
        ) : statuses.length > 0 ? (
          statuses.map((status, index) => (
            <div 
              key={status.id}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#121212]/40 backdrop-blur-sm hover:border-[#696cff]/30 transition-all duration-300 hover:bg-[#696cff]/5 flex justify-between items-center p-6"
            >
              {/* Animated Accent Line */}
              <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-40 group-hover:opacity-100 transition-opacity bg-gradient-to-b", getStatusColor(index))} />
              
              <div className="flex items-center gap-6 relative z-10">
                <div className={cn("h-4 w-4 rounded-full shadow-[0_0_15px_rgba(105,108,255,0.2)] transition-transform duration-500 group-hover:scale-150 bg-gradient-to-br", getStatusColor(index))} />
                <div>
                  <p className="font-extrabold text-white text-lg tracking-tight group-hover:text-[#696cff] transition-colors">{status.title}</p>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-0.5">Stage ID: #{status.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-white/20 hover:text-[#696cff] hover:bg-[#696cff]/10 rounded-xl transition-all"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => canDelete(status) && deletestatus(status.id)}
                  disabled={!canDelete(status)}
                  className={cn(
                    "h-10 w-10 rounded-xl transition-all",
                    canDelete(status) 
                      ? "text-white/20 hover:text-red-400 hover:bg-red-400/10" 
                      : "text-white/5 cursor-not-allowed"
                  )}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-[#121212]/40 backdrop-blur-sm border border-dashed border-white/10 rounded-[2rem]">
            <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center ring-1 ring-white/10 opacity-20">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No Stages Defined</h3>
            <p className="text-white/40 max-w-sm mx-auto font-medium">
              Initialize your workspace workflow by defining the first issue lifecycle stage.
            </p>
            <Button className="mt-8 bg-[#696cff] hover:bg-[#696cff]/90 text-white h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs">
              <Plus className="h-4 w-4 mr-2 stroke-[3]" /> Create First Stage
            </Button>
          </div>
        )}

        {/* Protection Warning */}
        {!loading && statuses.length <= 4 && (
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-[1.5rem] p-6 flex items-start gap-5">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-black text-amber-200 text-sm uppercase tracking-widest mb-1">Workflow Integrity Active</h4>
              <p className="text-xs text-amber-200/50 leading-relaxed font-medium">
                Standard lifecycle stages are essential for workspace stability. Removal is restricted to ensure every issue maintains a valid state.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
