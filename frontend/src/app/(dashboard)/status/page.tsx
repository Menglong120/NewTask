'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Settings2
} from 'lucide-react';
import Swal from 'sweetalert2';

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
    // Ported logic: statusCount > 4 AND userRoleId !== 2
    return statuses.length > 4 && roleId !== 2;
  };

  const deletestatus = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#333333",
      confirmButtonText: "Yes, delete it!",
      background: '#121212',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetchApi(`/api/projects/status/${id}`, { method: 'DELETE' });
        if (res.result) {
          fetchStatuses();
          Swal.fire({ title: "Deleted!", text: res.msg || "Status has been deleted successfully.", icon: "success", timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        } else {
          let errorMessage = res.msg || "Failed to delete status";
          if (res.data && res.data.length > 0) {
            const projectNames = res.data.map((p: any) => p.name).join(', ');
            errorMessage += `<br><br><strong>Projects using this status:</strong><br>${projectNames}`;
          }
          Swal.fire({ title: "Cannot Delete!", html: errorMessage, icon: "error", background: '#121212', color: '#fff' });
        }
      } catch (error) {}
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Decorative Background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#696cff]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)]">
            <Settings2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Issue Status</h1>
            <p className="text-sm text-white/50 font-medium tracking-wide">Configure and manage issue lifecycle stages</p>
          </div>
        </div>
        
        <button className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-[0_0_15px_rgba(105,108,255,0.4)] text-sm hover:-translate-y-0.5 border border-indigo-400/20 relative z-10">
          <Plus className="h-5 w-5" />
          Add Status
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 backdrop-blur-md animate-pulse rounded-2xl border border-white/5"></div>
          ))
        ) : statuses.map((status) => (
          <div key={status.id} className="bg-[#121212]/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/5 flex justify-between items-center group hover:border-indigo-500/30 hover:shadow-[0_4px_16px_rgba(105,108,255,0.15)] transition-all">
            <div className="flex items-center gap-5">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(105,108,255,0.6)]"></div>
              <span className="font-bold text-white text-lg">{status.title}</span>
            </div>
            
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button 
                title="Edit status name"
                className="p-2.5 text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button 
                onClick={() => canDelete(status) && deletestatus(status.id)}
                disabled={!canDelete(status)}
                title={canDelete(status) ? "Delete status" : "Cannot delete protected core status"}
                className={`p-2.5 rounded-xl transition-all ${
                  canDelete(status) 
                    ? 'text-white/30 hover:text-red-400 hover:bg-red-500/10' 
                    : 'text-white/10 cursor-not-allowed'
                }`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {!loading && statuses.length <= 4 && (
          <div className="mt-6 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 text-amber-500 shadow-inner align-start">
            <ShieldAlert className="h-6 w-6 flex-shrink-0 text-amber-400" />
            <div className="space-y-1">
              <p className="font-bold text-base text-amber-400">System Protection Engaged</p>
              <p className="opacity-80 text-sm font-medium">To maintain workflow integrity, default statuses cannot be deleted. A healthy project requires at least 4 active stages.</p>
            </div>
          </div>
        )}

        {!loading && statuses.length === 0 && (
          <div className="text-center py-16 bg-[#121212]/50 backdrop-blur-md rounded-[2rem] border border-white/10 border-dashed shadow-inner relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <CheckCircle2 className="h-16 w-16 mx-auto text-white/20 mb-4 relative z-10" />
            <h3 className="text-lg font-bold text-white relative z-10">No Custom Statuses</h3>
            <p className="text-white/40 font-medium mt-1 relative z-10">Add a status to manage your workflows.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
