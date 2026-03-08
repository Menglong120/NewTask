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
  Loader2
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
      background: '#121212',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetchApi(`/api/projects/status/${id}`, { method: 'DELETE' });
        if (res.result) {
          fetchStatuses();
          Swal.fire({ title: "Deleted", text: "Status removed successfully", icon: "success", timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        } else {
          let errorMessage = res.msg || "Operation failed";
          if (res.data && res.data.length > 0) {
            const projectNames = res.data.map((p: any) => p.name).join(', ');
            errorMessage += `<br><br><strong>In use by:</strong> ${projectNames}`;
          }
          Swal.fire({ title: "Restricted", html: errorMessage, icon: "error", background: '#121212', color: '#fff' });
        }
      } catch (error) { }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <Settings2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-primary">
                <span>Configuration</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">Lifecycle Stages</span>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Issue Status</CardTitle>
            </div>
          </div>
          <Button className="h-10 gap-2 font-bold bg-primary shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> New Status
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-3">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <Card key={i} className="h-20 border-white/5 bg-white/[0.02] animate-pulse" />
          ))
        ) : statuses.map((status) => (
          <Card key={status.id} className="group border-white/5 bg-card hover:bg-white/[0.04] hover:border-primary/20 transition-all flex justify-between items-center p-5">
            <div className="flex items-center gap-5">
              <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-primary to-purple-500 shadow-[0_0_10px_rgba(105,108,255,0.4)] transition-transform group-hover:scale-110" />
              <span className="font-bold text-foreground text-lg tracking-tight">{status.title}</span>
            </div>

            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Edit className="h-4.5 w-4.5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                onClick={() => canDelete(status) && deletestatus(status.id)}
                disabled={!canDelete(status)}
                className={cn(
                  "h-9 w-9",
                  canDelete(status) ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10" : "text-muted-foreground/20"
                )}
              >
                <Trash2 className="h-4.5 w-4.5" />
              </Button>
            </div>
          </Card>
        ))}

        {/* Protection Warning */}
        {!loading && statuses.length <= 4 && (
          <Alert className="bg-amber-500/5 border-amber-500/20 text-amber-500 rounded-2xl p-6">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <AlertTitle className="font-black uppercase tracking-widest text-[11px] mb-2 text-amber-400">Workflow Integrity Protected</AlertTitle>
            <AlertDescription className="text-sm font-medium opacity-80 leading-relaxed">
              Default lifecycle stages are required for system stability. Removal is restricted to ensure every issue has a valid destination state.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!loading && statuses.length === 0 && (
          <Card className="py-20 text-center bg-transparent border-dashed border-white/10 flex flex-col items-center">
            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 opacity-20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">No Definitions Found</h3>
            <p className="text-muted-foreground max-w-sm font-medium">Define your project stages to start tracking progress across the workspace.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
