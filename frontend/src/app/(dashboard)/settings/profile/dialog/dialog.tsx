'use client';

import React from 'react';
import { Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface ProfileDialogProps {
  showCropperModal: boolean;
  setShowCropperModal: (show: boolean) => void;
  imageElement: React.RefObject<HTMLImageElement | null>;
  changeProfileImage: () => Promise<any>;
  isUploadingImage: boolean;
}

export function ProfileDialog({
  showCropperModal,
  setShowCropperModal,
  imageElement,
  changeProfileImage,
  isUploadingImage,
}: ProfileDialogProps) {
  return (
    <Dialog open={showCropperModal} onOpenChange={setShowCropperModal}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary mr-2" /> Adjust Profile Framing
          </DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 rounded-xl border p-4 flex justify-center items-center min-h-[400px] overflow-hidden">
          <img id="cropperImage" ref={imageElement} className="max-h-[400px] max-w-full rounded-lg" alt="Crop Area" />
        </div>

        <DialogFooter className="gap-2 pt-4">
          <DialogClose asChild>
             <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={changeProfileImage} disabled={isUploadingImage} className="px-8 font-bold">
            {isUploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            {isUploadingImage ? 'Applying...' : 'Set New Photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
