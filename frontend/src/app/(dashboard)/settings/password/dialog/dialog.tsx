'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface PasswordDialogProps {
  showForgotModal: boolean;
  setShowForgotModal: (show: boolean) => void;
}

export function PasswordDialog({
  showForgotModal,
  setShowForgotModal,
}: PasswordDialogProps) {
  return (
    <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground border-2 border-dashed">
              <HelpCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">Security Assistance</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-2 text-center text-sm text-muted-foreground font-medium italic leading-relaxed">
          Please contact your designated system administrator or security officer to initiate a manual credential reset or recovery procedure.
        </div>

        <DialogFooter className="pt-6">
           <DialogClose asChild>
              <Button className="w-full font-bold h-11">Acknowledged</Button>
           </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
