'use client';

import React, { useEffect, useState, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import type CropperType from 'cropperjs';
import { Camera, Save, User, Mail, Shield, AlignLeft, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
    let emailtest = /^[a-zA-Z0-9]{2,}@[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})*\.[a-zA-Z]{2,}$/i;
    let fnametest = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;
    let lnametest = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;

    if (!fnametest.test(formData.firstname)) {
      Swal.fire({ icon: 'error', title: 'Invalid Firstname', text: 'Please ensure valid characters.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }
    if (!lnametest.test(formData.lastname)) {
      Swal.fire({ icon: 'error', title: 'Invalid Lastname', text: 'Please ensure valid characters.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }
    if (!emailtest.test(formData.email)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please provide a valid email.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
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
        Swal.fire({ icon: "success", title: "Information updated.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
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
        Swal.fire({ icon: "error", title: "Failed to process image.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
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
          Swal.fire({ icon: "success", title: "Avatar updated.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
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
      <p className="text-muted-foreground font-medium">Loading profile...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <User className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Account Overview</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">Manage your identity and bio across the platform</CardDescription>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 shadow-lg shadow-primary/20"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Identity Card */}
        <Card className="lg:col-span-1 border-white/5 bg-card overflow-hidden group">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative cursor-pointer group/avatar" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-40 w-40 ring-4 ring-background border-4 border-white/5 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                <AvatarImage src={profile?.avarta ? `/upload/${profile.avarta}` : ''} className="object-cover" />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                <Camera className="h-8 w-8 text-white mb-1" />
                <span className="text-white text-[10px] font-black uppercase tracking-tighter">Update</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
              <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[10px]">
                <Shield className="h-3 w-3 mr-1.5" /> {profile?.role.name}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{profile?.description || 'No bio provided yet. Add one to let others know more about you.'}"
            </p>
          </CardContent>
        </Card>

        {/* Detailed Info Card */}
        <Card className="lg:col-span-2 border-white/5 bg-card relative overflow-hidden">
          <div className="absolute bottom-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-xl font-bold">Personal Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> First Name
                </Label>
                <Input
                  name="firstname"
                  className="h-12 bg-background border-white/10 text-foreground font-semibold"
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Last Name
                </Label>
                <Input
                  name="lastname"
                  className="h-12 bg-background border-white/10 text-foreground font-semibold"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  Username
                </Label>
                <Input
                  name="disname"
                  disabled
                  className="h-12 bg-white/[0.02] border-white/5 text-muted-foreground font-bold cursor-not-allowed"
                  value={formData.disname}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </Label>
                <Input
                  name="email"
                  className="h-12 bg-background border-white/10 text-foreground font-semibold"
                  value={formData.email}
                  disabled={profile?.role.name === 'Normal User'}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <AlignLeft className="h-3.5 w-3.5" /> Bio / Brief Description
                </Label>
                <Textarea
                  name="description"
                  rows={6}
                  className="bg-background border-white/10 text-foreground font-medium resize-none"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cropper Dialog */}
      <Dialog open={showCropperModal} onOpenChange={setShowCropperModal}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-2xl overflow-hidden p-0">
          <DialogHeader className="p-6 border-b border-white/5 bg-white/[0.02]">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" /> Adjusted Profile Frame
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 bg-[#0a0a0a] flex justify-center items-center min-h-[440px]">
            <img id="cropperImage" ref={imageElement} className="max-h-[400px] max-w-full rounded-lg" alt="Crop Area" />
          </div>

          <DialogFooter className="p-6 border-t border-white/5 bg-white/[0.02] gap-2">
            <Button variant="ghost" onClick={() => setShowCropperModal(false)} className="text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
            <Button onClick={changeProfileImage} disabled={isUploadingImage} className="bg-primary hover:bg-primary/90 text-white font-bold px-6">
              {isUploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              {isUploadingImage ? 'Applying...' : 'Apply Photo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettingsPage;
