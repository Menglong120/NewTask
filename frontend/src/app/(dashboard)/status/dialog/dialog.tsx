'use client';

import React from 'react';
import { Plus, Edit, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StatusDialogProps {
  activeModal: 'create' | 'edit' | null;
  setActiveModal: (modal: 'create' | 'edit' | null) => void;
  formInput: string;
  setFormInput: (input: string) => void;
  isSaving: boolean;
  handleCreateStatus: () => Promise<void>;
  handleUpdateStatus: () => Promise<void>;
}

export function StatusDialog({
  activeModal,
  setActiveModal,
  formInput,
  setFormInput,
  isSaving,
  handleCreateStatus,
  handleUpdateStatus,
}: StatusDialogProps) {
  return (
    <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary mr-2">
              {activeModal === 'create' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            </div>
            {activeModal === 'create' ? "New Lifecycle Stage" : "Update Lifecycle Stage"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stage Title</Label>
            <Input
              placeholder="e.g. In Progress, Quality Control, Ready for Deploy"
              className="h-10 font-semibold"
              value={formInput}
              onChange={(e) => setFormInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (activeModal === 'edit' ? handleUpdateStatus() : handleCreateStatus())}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={activeModal === 'edit' ? handleUpdateStatus : handleCreateStatus}
            disabled={isSaving || !formInput.trim()}
            className="px-8 font-bold"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            {activeModal === 'edit' ? 'Update Stage' : 'Define Stage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
