'use client';

import React from 'react';
import { Users, Plus, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AvailableUser } from '@/types/project';

interface SettingsDialogProps {
  activeModal: 'status' | 'label' | 'priority' | 'tracker' | 'member' | null;
  setActiveModal: (modal: 'status' | 'label' | 'priority' | 'tracker' | 'member' | null) => void;
  modalInput: string;
  setModalInput: (val: string) => void;
  availableUsers: AvailableUser[];
  selectedNewMembers: string[];
  setSelectedNewMembers: (members: string[]) => void;
  isSaving: boolean;
  handleCreateItem: () => Promise<any>;
  handleAddMember: () => Promise<any>;
}

export function SettingsDialog({
  activeModal,
  setActiveModal,
  modalInput,
  setModalInput,
  availableUsers,
  selectedNewMembers,
  setSelectedNewMembers,
  isSaving,
  handleCreateItem,
  handleAddMember,
}: SettingsDialogProps) {
  return (
    <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              {activeModal === 'member' ? <Users className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <span>{activeModal === 'member' ? 'Add Project Personnel' : `New ${activeModal}`}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {activeModal === 'member' ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">Select one or more users to add to this project framework.</p>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Available Personnel</Label>
                <ScrollArea className="h-[300px] border rounded-lg p-2 bg-muted/20">
                  <div className="space-y-1">
                    {availableUsers.map(user => {
                      const idStr = user.id.toString();
                      const isSelected = selectedNewMembers.includes(idStr);
                      return (
                        <div
                          key={user.id}
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer border border-transparent",
                            isSelected ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50"
                          )}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedNewMembers(selectedNewMembers.filter(id => id !== idStr));
                            } else {
                              setSelectedNewMembers([...selectedNewMembers, idStr]);
                            }
                          }}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all",
                            isSelected ? "bg-primary border-primary" : "bg-background"
                          )}>
                            {isSelected && <Check className="h-3 w-3 text-white stroke-[3px]" />}
                          </div>
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={`/upload/${user.avarta}`} className="object-cover" />
                            <AvatarFallback className="text-[10px] font-bold">
                              {user.display_name?.[0] || user.first_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-semibold truncate transition-colors">
                              {user.display_name || user.first_name + ' ' + user.last_name}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">{user.role?.name || 'User'}</span>
                          </div>
                        </div>
                      );
                    })}
                    {availableUsers.length === 0 && (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        No available personnel found.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs font-semibold capitalize">{activeModal} Name</Label>
              <Input
                className="h-10"
                placeholder={`Enter ${activeModal} name...`}
                value={modalInput}
                onChange={e => setModalInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateItem()}
                autoFocus
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button
            onClick={activeModal === 'member' ? handleAddMember : handleCreateItem}
            disabled={isSaving}
            className="px-6"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Selection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
