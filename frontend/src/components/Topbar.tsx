'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

const Topbar = () => {
  const [profile, setProfile] = useState<any>(null);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchApi('/api/profile');
        if (res.result && res.data.length > 0) {
          setProfile(res.data[0]);
        }
      } catch (error) { console.error(error); }
    };
    fetchProfile();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.user-menu-container')) setOpenUserMenu(false);
        if (!target.closest('.settings-menu-container')) setOpenSettings(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetchApi('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) { console.error(error); }
  };

  return (
    <div className="!relative w-full h-full border-b border-white/10 flex items-center justify-between px-6 lg:px-10 z-50" style={{ backgroundColor: '#0a0a0a' }}>
      
      {/* Decorative Gradient Line below Topbar */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

      {/* Search Area */}
      <div className="flex-1 max-w-xl relative group z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-white/40 group-focus-within:text-indigo-400 transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="Search projects, issues, users..." 
            className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-16 py-3 text-sm font-bold text-white transition-all outline-none placeholder:text-white/30 shadow-inner"
          />
          <div className="absolute right-3 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
             <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/50 shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">Ctrl K</kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-5 ml-6 relative z-10">
        
        {/* Notifications */}
        <button className="relative p-3 text-white/40 hover:text-indigo-400 bg-white/5 hover:bg-indigo-500/10 rounded-xl transition-all border border-white/5 hover:border-indigo-500/30 group outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <Bell className="h-5 w-5 relative z-10 group-hover:animate-swing" />
           <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-[#121212] shadow-[0_0_10px_rgba(239,68,68,0.8)] z-20"></span>
        </button>

        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block"></div>

        {/* User Profile */}
        <div className="relative user-menu-container">
          <button 
            onClick={() => setOpenUserMenu(!openUserMenu)} 
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all outline-none focus:ring-2 focus:ring-indigo-500 group"
          >
             <div className="h-10 w-10 rounded-full ring-2 ring-[#121212] group-hover:ring-indigo-500/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-[#0a0a0a] flex items-center justify-center overflow-hidden shrink-0 transition-all">
                {profile?.avarta ? ( 
                   <img src={`/upload/${profile.avarta}`} alt="Profile" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} /> 
                ) : ( 
                   <UserCircle className="h-6 w-6 text-indigo-400 opacity-80" /> 
                )}
             </div>
             <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
                   {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-0.5">
                   {profile?.role?.name || 'Administrator'}
                </span>
             </div>
          </button>

          {/* User Dropdown */}
          {openUserMenu && (
            <div className="absolute right-0 top-full mt-3 w-64 bg-[#121212] border border-white/10 rounded-[1.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.8)] py-2 animate-in fade-in zoom-in-95 z-50 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mt-16 -mr-16"></div>
               
               <div className="px-5 py-4 border-b border-white/5 relative z-10 bg-white/[0.02]">
                  <p className="text-[15px] font-bold text-white mb-0.5">{profile ? `${profile.first_name} ${profile.last_name}` : 'User Account'}</p>
                  <p className="text-xs text-indigo-400 font-bold truncate">{profile?.email || 'admin@nsm.tech'}</p>
               </div>
               
               <div className="p-2 space-y-1 relative z-10">
                 <Link href="/settings/profile" onClick={() => setOpenUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors group">
                    <UserCircle className="h-4 w-4 text-white/30 group-hover:text-indigo-400 transition-colors" /> My Profile
                 </Link>
                 <Link href="/settings/password" onClick={() => setOpenUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors group">
                    <Settings className="h-4 w-4 text-white/30 group-hover:text-indigo-400 transition-colors" /> Account Settings
                 </Link>
               </div>
               
               <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>
               
               <div className="p-2 relative z-10">
                 <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left group">
                    <LogOut className="h-4 w-4 text-red-400/50 group-hover:text-red-400 transition-colors" /> Sign Out
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Topbar;
