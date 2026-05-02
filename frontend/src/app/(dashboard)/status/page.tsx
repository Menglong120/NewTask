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
  Zap,
  LayoutList,
  GitBranch,
  ShieldCheck,
  MoreVertical,
  X
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { StatusOption as Status } from '@/types/project';
import { StatusDialog } from './dialog/dialog';

const StatusPage = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<number | null>(null);

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [formInput, setFormInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDeleteStatus, setPendingDeleteStatus] = useState<Status | null>(null);

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

  const handleCreateStatus = async () => {
    if (!formInput.trim()) {
      Swal.fire({ icon: 'error', title: 'Input required', text: 'Status name cannot be empty.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetchApi('/api/projects/status', {
        method: 'POST',
        body: JSON.stringify({ title: formInput })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Status defined.', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        setFormInput('');
        setActiveModal(null);
        fetchStatuses();
      } else {
        Swal.fire({ title: 'Error', text: res.msg || 'Operation failed', icon: 'error' });
      }
    } catch (error) {
      console.error('Error creating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!formInput.trim() || !selectedStatus) return;

    try {
      setIsSaving(true);
      const res = await fetchApi(`/api/projects/status/${selectedStatus.id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: formInput })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Status updated.', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        setFormInput('');
        setSelectedStatus(null);
        setActiveModal(null);
        fetchStatuses();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (status: Status) => {
    setSelectedStatus(status);
    setFormInput(status.title);
    setActiveModal('edit');
  };

  const deletestatus = async (id: number) => {
    try {
      const res = await fetchApi(`/api/projects/status/${id}`, { method: 'DELETE' });
      if (res.result) {
        fetchStatuses();
        Swal.fire({ title: "Removed", icon: "success", timer: 2000, showConfirmButton: false });
      } else {
        let errorMessage = res.msg || "Operation failed";
        if (res.data && res.data.length > 0) {
          const projectNames = res.data.map((p: any) => p.name).join(', ');
          errorMessage += `<br><br><strong>In use by:</strong> ${projectNames}`;
        }
        Swal.fire({ title: "Restricted", html: errorMessage, icon: "error" });
      }
    } catch (error) { }
    finally { setPendingDeleteStatus(null); }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <LayoutList className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-primary">
              <span>Configuration</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Issue Workflow</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Lifecycle Stages</h1>
          </div>
        </div>
        <Button onClick={() => { setFormInput(''); setActiveModal('create'); }} className="font-bold px-6 shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Define New Stage
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Stages', value: statuses.length, icon: GitBranch, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Pipeline', value: statuses.length > 0 ? 'Optimal' : 'Pending', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Integrity', value: '100%', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Protected', value: 'Active', icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((m) => (
          <Card key={m.label} className="border shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{m.label}</p>
                <p className="text-2xl font-bold mt-0.5">{m.value}</p>
              </div>
              <div className={cn("p-2.5 rounded-lg", m.bg, m.color)}>
                <m.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main List */}
      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/40 animate-pulse rounded-xl border border-dashed" />
          ))
        ) : statuses.length > 0 ? (
          <div className="space-y-3">
            <div className="px-6 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              <span>Stage Configuration</span>
              <span>Actions</span>
            </div>
            {statuses.map((status, index) => (
              <Card key={status.id} className="shadow-sm group hover:border-primary/30 transition-all">
                <CardContent className="p-4 flex justify-between items-center bg-card">
                  <div className="flex items-center gap-6">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground/60 border border-border/50">
                      {index + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-base leading-none group-hover:text-primary transition-colors">{status.title}</p>
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">System ID: #{status.id}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => openEditModal(status)}>
                        <Edit className="h-4 w-4" />
                        Edit Stage
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => canDelete(status) && setPendingDeleteStatus(status)}
                        variant="destructive"
                        disabled={!canDelete(status)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Stage
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed py-20 flex flex-col items-center justify-center text-center bg-muted/20">
            <div className="p-4 bg-background rounded-full border mb-4 shadow-sm opacity-50">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-1">No lifecycle stages defined</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">Establish your project workflow by defining the first issue state.</p>
            <Button onClick={() => { setFormInput(''); setActiveModal('create'); }} size="lg" className="px-8 font-bold">
              <Plus className="h-4 w-4 mr-2" /> Create First Stage
            </Button>
          </Card>
        )}

        {/* Workflow alert */}
        {!loading && statuses.length <= 4 && (
          <div className="p-4 bg-muted/30 border border-dashed rounded-xl flex items-start gap-4">
            <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workflow Integrity Active</p>
              <p className="text-xs text-muted-foreground font-medium italic">Fundamental lifecycle stages are essential for workspace stability. Removal is restricted to ensure every issue maintains a valid state.</p>
            </div>
          </div>
        )}
      </div>

      <StatusDialog
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        formInput={formInput}
        setFormInput={setFormInput}
        isSaving={isSaving}
        handleCreateStatus={handleCreateStatus}
        handleUpdateStatus={handleUpdateStatus}
      />

      <ConfirmActionDialog
        open={pendingDeleteStatus !== null}
        onOpenChange={(open) => !open && setPendingDeleteStatus(null)}
        title="Remove stage?"
        description="Permanent action. Ensure no active issues are utilizing this state."
        confirmLabel="Remove stage"
        onConfirm={() => {
          if (!pendingDeleteStatus) return
          return deletestatus(pendingDeleteStatus.id)
        }}
      />

    </div>
  );
};

export default StatusPage;
