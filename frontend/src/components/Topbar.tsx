'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Topbar = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchApi('/api/profile');
        if (res.result && res.data.length > 0) setProfile(res.data[0]);
      } catch (error) { console.error(error); }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetchApi('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) { console.error(error); }
  };

  const initials = profile
    ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  return (
    <div
      className="relative w-full h-full border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-50 dark"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      {/* Search */}
      <div className="flex-1 max-w-xl relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Search projects, issues, users..."
          className="pl-9 pr-16 bg-white/5 border-white/10 hover:border-white/20 focus-visible:border-primary/50 focus-visible:ring-primary/20 text-white placeholder:text-white/30 rounded-xl h-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hidden sm:flex">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-white/40">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-6">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-white/40 hover:text-indigo-400 bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/20 rounded-xl"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-[#0a0a0a] shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        </Button>

        <div className="h-6 w-px bg-white/8 hidden sm:block" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2.5 pl-1.5 pr-3 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
            >
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage
                  src={profile?.avarta ? `/upload/${profile.avarta}` : undefined}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }}
                />
                <AvatarFallback className="bg-indigo-600/30 text-indigo-300 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-white leading-tight">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {profile?.role?.name ?? 'Administrator'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 bg-[#121212] border-white/10 rounded-2xl p-1 shadow-[0_10px_40px_rgba(0,0,0,0.8)] dark"
          >
            <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2.5">
              <span className="text-sm font-bold text-white">
                {profile ? `${profile.first_name} ${profile.last_name}` : 'User Account'}
              </span>
              <span className="text-xs text-indigo-400 font-medium truncate">
                {profile?.email ?? ''}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem asChild className="rounded-xl gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer">
              <Link href="/settings/profile">
                <UserCircle className="h-4 w-4 text-white/30" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 focus:bg-white/5 cursor-pointer">
              <Link href="/settings/password">
                <Settings className="h-4 w-4 text-white/30" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-red-400/60" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Topbar;
