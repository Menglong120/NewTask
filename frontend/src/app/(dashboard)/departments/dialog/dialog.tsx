'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { Department, DepartmentDialogProps } from '@/types/department';

export function DepartmentDialog({
  dialogOpen,
  setDialogOpen,
  editingDepartment,
  form,
  setForm,
  submitting,
  handleSubmit,
  pendingDeleteDepartment,
  setPendingDeleteDepartment,
  handleDelete,
}: DepartmentDialogProps) {
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDepartment ? 'Edit Department' : 'Create Department'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Department Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Short description for this department"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingDepartment ? 'Save Changes' : 'Create Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={pendingDeleteDepartment !== null}
        onOpenChange={(open) => !open && setPendingDeleteDepartment(null)}
        title={pendingDeleteDepartment ? `Delete ${pendingDeleteDepartment.name}?` : 'Delete department?'}
        description="This only works if no users or projects are assigned to this department."
        confirmLabel="Delete department"
        onConfirm={() => {
          if (!pendingDeleteDepartment) return;
          return handleDelete(pendingDeleteDepartment);
        }}
      />
    </>
  );
}