'use client';

import React, { useEffect, useState, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Camera, Save, User, Mail, Shield, AlignLeft, Loader2, X, Check } from 'lucide-react';

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

  const [cropper, setCropper] = useState<Cropper | null>(null);
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
        Swal.fire({ icon: "success", title: "Information updated successfully.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
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
          // Allow render cycle to complete before attaching cropper
          setTimeout(() => {
            if (imageElement.current) {
              imageElement.current.src = event.target?.result as string;
              if (cropper) cropper.destroy();

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
        if(data.result){
            window.location.reload();
            Swal.fire({ icon: "success", title: "Profile picture updated.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        }
      } catch (error) {
         console.error(error);
      } finally {
         setIsUploadingImage(false);
      }
    });
  };

  if (loading) return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -mx-32"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)] shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Profile Settings</h1>
            <p className="text-sm text-white/50 font-medium tracking-wide">Manage your personal information and preferences</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={!hasChanges || saving}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition-all font-bold shadow-[0_0_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:shadow-none hover:-translate-y-0.5 relative z-10 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Avatar & Identity */}
        <div className="col-span-1 space-y-6">
          <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-8 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex flex-col items-center relative z-10">
              <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="h-32 w-32 rounded-full ring-4 ring-[#0a0a0a] shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden bg-white/5">
                  <img 
                    src={profile?.avarta ? `/upload/${profile.avarta}` : '/img/default-avatar.png'} 
                    alt="Profile" 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <Camera className="h-8 w-8 text-white mb-1 drop-shadow-lg" />
                  <span className="text-white text-xs font-semibold drop-shadow-md">Change</span>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
              
              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">{profile?.first_name} {profile?.last_name}</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-black ring-1 ring-indigo-500/20 uppercase tracking-widest shadow-inner">
                  <Shield className="h-3.5 w-3.5" />
                  {profile?.role.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Details */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-8 space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <User className="h-3.5 w-3.5" /> First Name
                </label>
                <input 
                  type="text" name="firstname" 
                  className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner" 
                  value={formData.firstname} onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2.5">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <User className="h-3.5 w-3.5" /> Last Name
                </label>
                <input 
                  type="text" name="lastname" 
                  className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner" 
                  value={formData.lastname} onChange={handleInputChange} 
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <User className="h-3.5 w-3.5" /> Username
                </label>
                <input 
                  type="text" name="disname" disabled
                  className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-white/40 font-bold outline-none cursor-not-allowed shadow-inner" 
                  value={formData.disname}
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </label>
                <input 
                  type="text" name="email" 
                  className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner disabled:opacity-50 disabled:cursor-not-allowed" 
                  value={formData.email} onChange={handleInputChange}
                  disabled={profile?.role.name === 'Normal User'}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 space-y-2.5 pt-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <AlignLeft className="h-3.5 w-3.5" /> Bio / Description
                </label>
                <textarea 
                  name="description" rows={5}
                  className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-white outline-none resize-none shadow-inner placeholder:text-white/20" 
                  value={formData.description} onChange={handleInputChange}
                  placeholder="Share a little bit about yourself..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tailwind Cropper Modal */}
      {showCropperModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col relative">
            
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white">Crop Profile Photo</h3>
              <button 
                onClick={() => setShowCropperModal(false)}
                className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 bg-[#0a0a0a] flex justify-center items-center h-[400px]">
               <img id="cropperImage" ref={imageElement} className="max-h-full max-w-full" alt="Crop Preview" />
            </div>
            
            <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setShowCropperModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all outline-none"
              >
                Cancel
              </button>
              <button 
                onClick={changeProfileImage}
                disabled={isUploadingImage}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_0_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 flex items-center gap-2 transition-all disabled:opacity-50 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isUploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                {isUploadingImage ? 'Applying...' : 'Apply Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingsPage;
