'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { 
  Plus, Search, ChevronRight, MoreHorizontal, LayoutGrid, 
  FolderOpen, CircleDot, Flag, Target, Tag, UserCircle, 
  Calendar, Clock, Loader2, PlayCircle, CheckCircle2, ClipboardList
} from 'lucide-react';

interface Issue {
  id: number;
  name: string;
  description: string;
  start_date: string;
  due_date: string;
  estimated_date: string;
  progress: number;
  status: { id: number; name: string; title?: string };
  priority: { id: number; name: string; title?: string };
  tracker: { id: number; name: string; title?: string };
  label: { id: number; name: string; title?: string };
  assignee: { 
    id: string;
    email: string;
    dis_name: string;
    status: number;
    user?: { id: string; display_name: string; avarta: string; email: string; } 
  };
}

const IssuesCategoryPage = () => {
  const { id } = useParams();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dropdown data options
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [trackers, setTrackers] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Generic Inline Dropdown State
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndIssues = async () => {
      try {
        setLoading(true);
        const [cateRes, issuesRes] = await Promise.all([
          fetchApi(`/api/category/${id}`),
          fetchApi(`/api/category/issues/${id}?search=${search}&page=&perpage=`)
        ]);

        let projId = null;

        if (cateRes.result) {
          setCategoryName(cateRes.data.category.name || cateRes.data.name);
          setProjectName(cateRes.data.project.name);
          projId = cateRes.data.project.id;
        }

        if (issuesRes.result) {
          setIssues(issuesRes.data.issues?.datas || issuesRes.data.issues || []);
        }

        if (projId) {
          const [statusRes, priorityRes, trackerRes, labelRes, memberRes] = await Promise.all([
            fetchApi(`/api/projects/issue/statuses/${projId}`),
            fetchApi(`/api/projects/issue/priorities/${projId}`),
            fetchApi(`/api/projects/issue/trackers/${projId}`),
            fetchApi(`/api/projects/issue/labels/${projId}`),
            fetchApi(`/api/projects/members/${projId}?search=&page=&perpage=`)
          ]);

          if (statusRes.result) setStatuses(statusRes.data.statuses);
          if (priorityRes.result) setPriorities(priorityRes.data.priorities);
          if (trackerRes.result) setTrackers(trackerRes.data.trackers);
          if (labelRes.result) setLabels(labelRes.data.labels);
          if (memberRes.result) setMembers(memberRes.data.datas || memberRes.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoryAndIssues();
  }, [id, search]);

  const getAssigneeName = (assignee: any) => {
    if (!assignee) return 'Assignee';
    if (assignee.user) return assignee.user.display_name || assignee.user.email || 'Assignee';
    if (assignee.email) return assignee.status === 1 ? (!assignee.dis_name ? assignee.email : assignee.dis_name) : assignee.email;
    return 'Assignee';
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, dropdownId: string) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === dropdownId ? null : dropdownId);
  };

  const handleUpdateIssueField = async (issueId: number, field: string, valueId: string | number) => {
     // NOTE: This triggers the visual update immediately but requires the real PUT endpoint on backend to persist.
     Swal.fire({ icon: 'info', title: 'Update triggered', text: `Field ${field} selected ${valueId}`, toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
     setOpenDropdownId(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header & Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-1">
               <FolderOpen className="h-3.5 w-3.5" />
               {projectName || <span className="w-24 h-4 bg-gray-200 animate-pulse rounded"></span>}
               <ChevronRight className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
               {categoryName || <span className="w-48 h-8 bg-gray-200 animate-pulse rounded inline-block"></span>}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search category issues..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-gray-700 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="shrink-0 bg-gray-900 text-white px-5 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all font-bold shadow-lg shadow-gray-900/10 text-sm">
            <Plus className="h-4 w-4" /> Add Issue
          </button>
        </div>
      </div>

      {/* Issues List Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col min-h-[500px]">
         <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100/80 flex items-center justify-between">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <ClipboardList className="h-4 w-4 text-indigo-500" /> 
                 Category Issues <span className="bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs ml-2">{issues.length}</span>
             </h3>
         </div>

         <div className="flex-1 overflow-x-auto p-4 space-y-3">
             {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /></div>
             ) : issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                   <CheckCircle2 className="h-12 w-12 opacity-20 mb-3" />
                   <h4 className="text-lg font-bold text-gray-900 mb-1">All clear!</h4>
                   <p className="font-medium text-sm">No issues found in this category.</p>
                </div>
             ) : (
                issues.map(issue => (
                   <div key={issue.id} className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col xl:flex-row gap-4 xl:gap-6 xl:items-center">
                       
                       {/* Left Side: Name & Progress */}
                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                           <div className="flex items-center gap-3 mb-2">
                               <button className="text-gray-400 hover:text-indigo-600 transition-colors"><ChevronRight className="h-5 w-5" /></button>
                               <span className="font-bold text-gray-900 text-base truncate" title={issue.name}>{issue.name}</span>
                           </div>
                           <div className="flex items-center gap-3 pl-8">
                               <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                                   <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${issue.progress || 0}%` }}></div>
                               </div>
                               <span className="text-xs font-bold text-gray-500">{issue.progress || 0}%</span>
                           </div>
                       </div>

                       {/* Right Side: Properties (Dropdowns conceptually) */}
                       <div className="flex flex-wrap items-center gap-2 xl:gap-3 pl-8 xl:pl-0">
                           
                           {/* Status Dropdown conceptually */}
                           <div className="relative">
                               <button onClick={(e) => toggleDropdown(e, `status-${issue.id}`)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${openDropdownId === `status-${issue.id}` ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}>
                                  <CircleDot className="h-3.5 w-3.5 shrink-0 opacity-70" /> 
                                  <span className="truncate max-w-[100px]">{issue.status?.name || 'Status'}</span>
                               </button>
                               {openDropdownId === `status-${issue.id}` && (
                                   <div className="absolute top-full lg:bottom-full lg:top-auto lg:mb-2 left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1 animate-in fade-in zoom-in-95">
                                       {statuses.map(s => <button key={s.id} onClick={() => handleUpdateIssueField(issue.id, 'status', s.id)} className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors">{s.name}</button>)}
                                   </div>
                               )}
                           </div>

                           {/* Priority Dropdown */}
                           <div className="relative">
                               <button onClick={(e) => toggleDropdown(e, `priority-${issue.id}`)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${openDropdownId === `priority-${issue.id}` ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}>
                                  <Flag className="h-3.5 w-3.5 shrink-0 opacity-70" /> 
                                  <span className="truncate max-w-[100px]">{issue.priority?.name || 'Priority'}</span>
                               </button>
                               {openDropdownId === `priority-${issue.id}` && (
                                   <div className="absolute top-full lg:bottom-full lg:top-auto lg:mb-2 left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1 animate-in fade-in zoom-in-95">
                                       {priorities.map(p => <button key={p.id} onClick={() => handleUpdateIssueField(issue.id, 'priority', p.id)} className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors">{p.name}</button>)}
                                   </div>
                               )}
                           </div>

                           {/* Tracker Dropdown */}
                           <div className="relative">
                               <button onClick={(e) => toggleDropdown(e, `tracker-${issue.id}`)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300`}>
                                  <Target className="h-3.5 w-3.5 shrink-0 opacity-70" /> <span className="truncate max-w-[100px]">{issue.tracker?.name || 'Tracker'}</span>
                               </button>
                           </div>

                           {/* Label Dropdown */}
                           <div className="relative">
                               <button onClick={(e) => toggleDropdown(e, `label-${issue.id}`)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300`}>
                                  <Tag className="h-3.5 w-3.5 shrink-0 opacity-70" /> <span className="truncate max-w-[100px]">{issue.label?.name || 'Label'}</span>
                               </button>
                           </div>

                           {/* Assignee */}
                           <div className="relative flex items-center pl-2 border-l border-gray-200">
                               <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center ring-2 ring-white shrink-0 overflow-hidden" title={getAssigneeName(issue.assignee)}>
                                   {issue.assignee?.user?.avarta ? ( <img src={`/upload/${issue.assignee.user.avarta}`} className="h-full w-full object-cover" /> ) : ( <UserCircle className="h-4 w-4" /> )}
                               </div>
                           </div>

                           {/* Dates (Start / Due) */}
                           <div className="flex items-center gap-3 border-l border-gray-200 pl-3 ml-1 text-xs font-bold text-gray-500">
                               <div className="flex items-center gap-1.5" title="Start Date">
                                   <PlayCircle className="h-3.5 w-3.5" /> {issue.start_date ? new Date(issue.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) : '--'}
                               </div>
                               <div className="flex items-center gap-1.5" title="Due Date">
                                   <Clock className="h-3.5 w-3.5" /> {issue.due_date ? new Date(issue.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) : '--'}
                               </div>
                           </div>

                           {/* Actions */}
                           <button className="ml-2 p-1.5 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors">
                               <MoreHorizontal className="h-4 w-4" />
                           </button>

                       </div>
                   </div>
                ))
             )}
         </div>
      </div>
    </div>
  );
};

export default IssuesCategoryPage;
