'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, FolderOpen, CheckSquare, Users, Settings,
  LayoutGrid, BarChart3, ChevronDown
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Project { id: number; name: string; }

const Sidebar = () => {
  const pathname = usePathname();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetchApi('/api/profile');
        if (profileRes.result && profileRes.data.length > 0) setRoleId(profileRes.data[0].role.id);
        const projectRes = await fetchApi('/api/projects');
        if (projectRes.result) setProjects(projectRes.data.datas);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const toggleProject = (id: number) => {
    setExpandedProjects(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const coreItems = [
    { name: 'Dashboard', icon: Home, href: '/home' },
    { name: 'Projects', icon: FolderOpen, href: '/projects' },
    { name: 'Status', icon: CheckSquare, href: '/status' },
  ];

  const isActive = (href: string) =>
    pathname === href || (href === '/home' && pathname === '/');

  return (
    <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-screen shrink-0 relative z-20 dark">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
        <Link href="/home" className="flex items-center gap-3 w-full group">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white tracking-tight text-lg leading-tight">NSM Tech</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Task Platform</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">

        {/* Core */}
        <div>
          <p className="px-3 text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Core</p>
          <nav className="space-y-0.5">
            {coreItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      asChild
                      className={cn(
                        'w-full justify-start gap-3 px-3 py-2.5 h-auto font-semibold text-sm rounded-xl transition-all',
                        active
                          ? 'bg-primary/10 text-white ring-1 ring-primary/30 hover:bg-primary/15'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn('h-4.5 w-4.5', active ? 'text-primary' : 'text-white/40')} />
                        {item.name}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        <Separator className="bg-white/5" />

        {/* Management */}
        <div>
          <p className="px-3 text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Management</p>
          <nav className="space-y-0.5">

            {(roleId === 1 || roleId === 2) && (
              <Button
                variant="ghost"
                asChild
                className={cn(
                  'w-full justify-start gap-3 px-3 py-2.5 h-auto font-semibold text-sm rounded-xl transition-all',
                  pathname === '/users'
                    ? 'bg-primary/10 text-white ring-1 ring-primary/30 hover:bg-primary/15'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <Link href="/users">
                  <Users className={cn('h-4.5 w-4.5', pathname === '/users' ? 'text-primary' : 'text-white/40')} />
                  All Users
                </Link>
              </Button>
            )}

            {projects.map((project) => {
              const isExpanded = expandedProjects.includes(project.id);
              const isChildActive = pathname.startsWith(`/projects/${project.id}`);

              return (
                <div key={project.id}>
                  <button
                    onClick={() => toggleProject(project.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-semibold',
                      isChildActive ? 'bg-white/5 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3 truncate pr-2">
                      <FolderOpen className={cn('h-4 w-4 shrink-0', isChildActive ? 'text-indigo-400' : 'text-white/40')} />
                      <span className="truncate">{project.name}</span>
                    </div>
                    {isChildActive && (
                      <Badge variant="secondary" className="text-[10px] bg-indigo-500/20 text-indigo-400 border-0 px-1.5 mr-1">
                        Active
                      </Badge>
                    )}
                    <ChevronDown className={cn(
                      'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
                      isExpanded ? 'rotate-180 text-white/70' : 'text-white/25'
                    )} />
                  </button>

                  <div className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-48 opacity-100 mt-0.5' : 'max-h-0 opacity-0'
                  )}>
                    <div className="pr-2 py-1 space-y-0.5 border-l border-white/5 ml-5">
                      {[
                        { name: 'Settings', href: `/projects/${project.id}/settings`, icon: Settings },
                        { name: 'Knowledge Base', href: `/projects/${project.id}/resources`, icon: LayoutGrid },
                        { name: 'Category Ideas', href: `/projects/${project.id}/category`, icon: BarChart3 }
                      ].map(sub => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-[13px] font-medium',
                              isSubActive
                                ? 'text-indigo-400 bg-indigo-500/10'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                            )}
                          >
                            <sub.icon className={cn('h-3.5 w-3.5', isSubActive ? 'text-indigo-400' : 'text-white/25')} />
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
