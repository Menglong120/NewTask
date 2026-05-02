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
        if (res.result && res.data) {
          const user = Array.isArray(res.data) ? res.data[0] : res.data;
          if (user) setProfile(user);
        }
      } catch (error) { console.error('Topbar fetch error:', error); }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetchApi('/api/logout', { method: 'DELETE' });
      window.location.href = '/login';
    } catch (error) { console.error(error); }
  };

  const initials = profile
    ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  return (
    <div
      className="relative w-full h-16 border-b border-border flex items-center justify-between px-6 lg:px-10 z-50 bg-background"
    >
      {/* Search */}
      <div className="flex-1 max-w-xl relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Search projects, issues, users..."
          className="pl-9 pr-16"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hidden sm:flex">
          <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-medium uppercase tracking-widest">
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
          className="relative"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-background" />
        </Button>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2.5 px-2 h-10"
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={profile?.avarta ? `/upload/${profile.avarta}` : undefined}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-semibold leading-tight">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {profile?.role?.name ?? 'Administrator'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60"
          >
            <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2.5">
              <span className="text-sm font-bold">
                {profile ? `${profile.first_name} ${profile.last_name}` : 'User Account'}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {profile?.email ?? ''}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/settings/profile" className="flex items-center w-full">
                <UserCircle className="mr-2 h-4 w-4 opacity-70" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/settings/password" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4 opacity-70" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 opacity-70" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Topbar;
