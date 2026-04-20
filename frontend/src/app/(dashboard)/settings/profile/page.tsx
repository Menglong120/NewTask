'use client';

import React, { useEffect, useState, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import type CropperType from 'cropperjs';
import { Camera, Save, User, Mail, Shield, AlignLeft, Loader2, X, Check, Image as ImageIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface UserProfile {
  first_name: string;
  last_name: string;
  display_name?: string;
  dis_name?: string;
  email: string;
  description: string;
  avarta: string;
  role: { name: string; id: number };
}

const ProfileSettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    description: '',
    disname: ''
  });

  const [cropper, setCropper] = useState<CropperType | null>(null);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const imageElement = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const res = await fetchApi('/api/profile');
        if (res.result && res.data.length > 0) {
          const user = res.data[0];
          setProfile(user);
          setFormData({
            firstname: user.first_name,
            lastname: user.last_name,
            email: user.email,
            description: user.description || '',
            disname: user.dis_name || user.display_name || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;
    const changed =
      formData.firstname !== profile.first_name ||
      formData.lastname !== profile.last_name ||
      formData.email !== profile.email ||
      formData.description !== (profile.description || '') ||
      formData.disname !== (profile.dis_name || profile.display_name || '');
    setHasChanges(changed);
  }, [formData, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const emailtest = /^[a-zA-Z0-9]{2,}@[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})*\.[a-zA-Z]{2,}$/i;
    const fnametest = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;
    const lnametest = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;

    if (!fnametest.test(formData.firstname)) {
      Swal.fire({ icon: 'error', title: 'Invalid format', text: 'First name contains unsupported characters.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      return;
    }
    if (!lnametest.test(formData.lastname)) {
      Swal.fire({ icon: 'error', title: 'Invalid format', text: 'Last name contains unsupported characters.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      return;
    }
    if (!emailtest.test(formData.email)) {
      Swal.fire({ icon: 'error', title: 'Invalid email', text: 'Please provide a valid email address.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      return;
    }

    try {
      setSaving(true);
      const res = await fetchApi('/api/profile/info', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if (res.result) {
        setProfile(prev => prev ? {
          ...prev,
          first_name: formData.firstname,
          last_name: formData.lastname,
          email: formData.email,
          description: formData.description,
          display_name: formData.disname
        } : null);
        Swal.fire({ icon: "success", title: "Profile updated.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setShowCropperModal(true);
          setTimeout(async () => {
            if (imageElement.current) {
              imageElement.current.src = event.target?.result as string;
              if (cropper) cropper.destroy();

              const Cropper = (await import('cropperjs')).default;
              const newCropper = new Cropper(imageElement.current, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 0.9,
                responsive: true,
                dragMode: 'move',
                minContainerWidth: 400,
                minContainerHeight: 400,
                guides: true,
                center: true,
                highlight: true,
                background: true,
              } as any);
              setCropper(newCropper);
            }
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const changeProfileImage = async () => {
    if (!cropper) return;
    setIsUploadingImage(true);

    (cropper as any).getCroppedCanvas().toBlob(async (blob: Blob | null) => {
      if (!blob) {
        setIsUploadingImage(false);
        Swal.fire({ icon: "error", title: "Processing error.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("image", blob, "profile.jpg");

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'}/api/profile/image`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataObj
        });

        const data = await response.json();
        if (data.result) {
          window.location.reload();
          Swal.fire({ icon: "success", title: "Avatar updated.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploadingImage(false);
      }
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing profile metadata...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <User className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
             <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>Settings</span>
              <X className="h-3 w-3 opacity-30" />
              <span className="text-foreground">Profile Overview</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Account Identity</h1>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="font-bold px-6 shadow-sm"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? 'Syncing...' : 'Save Preferences'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-4 border shadow-sm h-fit overflow-hidden">
          <CardHeader className="py-4 border-b bg-muted/20">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Identity Card</CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-44 w-44 ring-4 ring-background border shadow-xl transition-shadow group-hover/avatar:shadow-2xl">
                <AvatarImage src={profile?.avarta ? `/upload/${profile.avarta}` : ''} className="object-cover" />
                <AvatarFallback className="text-5xl bg-muted text-muted-foreground font-bold">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-background/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-sm border-2 border-primary/20">
                <Camera className="h-8 w-8 text-primary mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Change Photo</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
              <Badge variant="secondary" className="px-3 py-1 font-bold text-xs">
                <Shield className="h-3.5 w-3.5 mr-1.5 opacity-60" /> {profile?.role.name}
              </Badge>
            </div>

            <div className="p-6 bg-muted/30 rounded-2xl border text-sm text-muted-foreground italic leading-relaxed w-full">
              {profile?.description || 'No professional bio provided.'}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="lg:col-span-8 border shadow-sm">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Personal Specifications</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   First name
                </Label>
                <div className="relative group">
                   <Input
                    name="firstname"
                    className="h-11 font-semibold pl-10"
                    value={formData.firstname}
                    onChange={handleInputChange}
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   Last name
                </Label>
                <div className="relative group">
                  <Input
                    name="lastname"
                    className="h-11 font-semibold pl-10"
                    value={formData.lastname}
                    onChange={handleInputChange}
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  System ID (Username)
                </Label>
                <Input
                  name="disname"
                  disabled
                  className="h-11 bg-muted/50 text-muted-foreground font-bold cursor-not-allowed border-dashed"
                  value={formData.disname}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   Communication Channel
                </Label>
                <div className="relative group">
                  <Input
                    name="email"
                    className="h-11 font-semibold pl-10"
                    value={formData.email}
                    disabled={profile?.role.name === 'Normal User'}
                    onChange={handleInputChange}
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   Professional bio
                </Label>
                <div className="relative group">
                  <Textarea
                    name="description"
                    rows={6}
                    className="font-medium resize-none pl-10 pt-3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your role and expertise..."
                  />
                   <AlignLeft className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-4">
               <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
               <div className="space-y-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Global visibility</p>
                  <p className="text-xs text-muted-foreground font-medium italic">Changes to your name and bio will be updated across all project histories and activity logs instantly.</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Dialog */}
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
    </div>
  );
};

export default ProfileSettingsPage;
