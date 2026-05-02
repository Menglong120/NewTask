'use client';

import React from 'react';
import { Plus, Edit2, UploadCloud, Loader2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ResourceDialogProps {
  activeModal: 'create' | 'edit' | 'upload' | 'updateFile' | null;
  setActiveModal: (modal: 'create' | 'edit' | 'upload' | 'updateFile' | null) => void;
  modalInputText: string;
  setModalInputText: (text: string) => void;
  editFileNameShow: string;
  setFileInput: (file: File | null) => void;
  fileInput: File | null;
  isSaving: boolean;
  isUploading: boolean;
  handleCreateResource: () => Promise<any>;
  handleEditResourceSave: () => Promise<any>;
  handleUploadFile: () => Promise<any>;
  handleEditFile: () => Promise<any>;
}

export function ResourceDialog({
  activeModal,
  setActiveModal,
  modalInputText,
  setModalInputText,
  editFileNameShow,
  setFileInput,
  fileInput,
  isSaving,
  isUploading,
  handleCreateResource,
  handleEditResourceSave,
  handleUploadFile,
  handleEditFile,
}: ResourceDialogProps) {
  return (
    <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary mr-2">
              {activeModal === 'create' && <Plus className="h-5 w-5" />}
              {activeModal === 'edit' && <Edit2 className="h-5 w-5" />}
              {(activeModal === 'upload' || activeModal === 'updateFile') && <UploadCloud className="h-5 w-5" />}
            </div>
            {activeModal === 'create' && "New Resource"}
            {activeModal === 'edit' && "Rename Resource"}
            {activeModal === 'upload' && "Upload Asset"}
            {activeModal === 'updateFile' && "Replace Asset Content"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {(activeModal === 'create' || activeModal === 'edit') && (
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resource Title</Label>
              <Input
                className="h-10 font-semibold"
                placeholder="e.g. Technical Specifications V1"
                value={modalInputText}
                onChange={e => setModalInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (activeModal === 'create' ? handleCreateResource() : handleEditResourceSave())}
                autoFocus
              />
            </div>
          )}

          {(activeModal === 'upload' || activeModal === 'updateFile') && (
            <div className="space-y-4">
              {activeModal === 'updateFile' && (
                <div className="p-3 bg-muted rounded-lg border text-xs font-semibold text-muted-foreground italic flex items-center gap-2">
                  <History className="h-3.5 w-3.5" /> Replaces: {editFileNameShow}
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select File</Label>
                <Input
                  type="file"
                  onChange={e => setFileInput(e.target.files?.[0] || null)}
                  className="h-10 cursor-pointer text-xs pt-1.5"
                />
                <p className="text-[10px] text-muted-foreground/60 italic px-1 pt-1">Standard file formats supported.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              if (activeModal === 'create') handleCreateResource();
              else if (activeModal === 'edit') handleEditResourceSave();
              else if (activeModal === 'upload') handleUploadFile();
              else handleEditFile();
            }}
            disabled={isSaving || isUploading || ((activeModal === 'upload' || activeModal === 'updateFile') && !fileInput)}
            className="px-8 font-bold"
          >
            {(isSaving || isUploading) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {activeModal === 'upload' || activeModal === 'updateFile' ? 'Upload file' : 'Save resource'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
