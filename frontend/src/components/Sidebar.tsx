'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, CheckSquare, ChevronDown, FolderOpen, 
  Home, LayoutDashboard, LayoutGrid, Users, Settings, Activity, BarChart3, ChevronRight 
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

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
    setExpandedProjects(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  const menuItems = [
    { name: 'Dashboard', icon: Home, href: '/home' },
    { name: 'Projects', icon: FolderOpen, href: '/projects' },
    { name: 'Status', icon: CheckSquare, href: '/status' },
  ];

  return (
    <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-screen shrink-0 relative z-20">
      
      {/* Brand Header */}
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

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-8">
        
        {/* Core Navigation */}
        <div>
           <h4 className="px-3 text-xs font-black text-white/30 uppercase tracking-wider mb-3">Core</h4>
           <nav className="space-y-1">
             {menuItems.map((item) => {
                const isActive = pathname === item.href || (pathname !== '/home' && pathname === '/' && item.name === 'Dashboard');
                return (
                  <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-bold text-sm ${isActive ? 'bg-[#696cff]/10 text-white ring-1 ring-[#696cff]/30 shadow-[inset_0px_1px_4px_rgba(105,108,255,0.1)]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#696cff]' : 'text-white/40 group-hover:text-white/70 transition-colors'}`} />
                    {item.name}
                  </Link>
                );
             })}
           </nav>
        </div>

        {/* Workspace Management */}
        <div>
           <h4 className="px-3 text-xs font-black text-white/30 uppercase tracking-wider mb-3">Management</h4>
           <nav className="space-y-1">
             {(roleId === 1 || roleId === 2) && (
               <Link href="/users" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-bold text-sm ${pathname === '/users' ? 'bg-[#696cff]/10 text-white ring-1 ring-[#696cff]/30 shadow-[inset_0px_1px_4px_rgba(105,108,255,0.1)]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                 <Users className={`h-5 w-5 ${pathname === '/users' ? 'text-[#696cff]' : 'text-white/40 group-hover:text-white/70 transition-colors'}`} />
                 All Users
               </Link>
             )}
             
             {/* Dynamic Projects List */}
             {projects.map((project) => {
               const isExpanded = expandedProjects.includes(project.id);
               const isChildActive = pathname.startsWith(`/projects/${project.id}`);
               
               return (
                 <div key={project.id} className="pt-2">
                   <button onClick={() => toggleProject(project.id)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group font-bold text-sm ${isChildActive ? 'bg-white/5 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                     <div className="flex items-center gap-3 truncate pr-2">
                        <FolderOpen className={`h-5 w-5 shrink-0 ${isChildActive ? 'text-indigo-400 fill-indigo-400/20' : 'text-white/40 group-hover:text-white/70 transition-colors'}`} />
                        <span className="truncate">{project.name}</span>
                     </div>
                     <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-white/80' : 'text-white/30'}`} />
                   </button>
                   
                   {/* Project Submenu */}
                   <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                     <div className="pl-11 pr-3 py-1 space-y-1 border-l border-white/10 ml-5">
                        {[
                          { name: 'Settings', href: `/projects/${project.id}/settings`, icon: Settings },
                          { name: 'Knowledge Base', href: `/projects/${project.id}/resources`, icon: LayoutGrid },
                          { name: 'Category Ideas', href: `/projects/${project.id}/category`, icon: BarChart3 }
                        ].map(sub => {
                           const isSubActive = pathname === sub.href;
                           return (
                             <Link key={sub.name} href={sub.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-[13px] font-bold ${isSubActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                               <sub.icon className={`h-3.5 w-3.5 ${isSubActive ? 'text-indigo-400' : 'text-white/30'}`} />
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
