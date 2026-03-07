'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { 
  Users, Loader2, Tag, Flag, Target, LayoutGrid, 
  Search, Plus, MoreVertical, Trash2, Edit2, Shield,
  Mail, Calendar, X, Settings
} from 'lucide-react';

interface Member {
  id: number;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    dis_name: string;
    email: string;
    avarta: string;
    role: { name: string; id: number };
  };
  created_on: string;
}

interface ItemState {
    id: number;
    name: string;
    description?: string;
}

const ProjectSettingsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('members');
  
  // Data States
  const [members, setMembers] = useState<Member[]>([]);
  const [statuses, setStatuses] = useState<ItemState[]>([]);
  const [labels, setLabels] = useState<ItemState[]>([]);
  const [priorities, setPriorities] = useState<ItemState[]>([]);
  const [trackers, setTrackers] = useState<ItemState[]>([]);
  const [categories, setCategories] = useState<ItemState[]>([]);
  const [projectName, setProjectName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  // Modal State
  const [activeModal, setActiveModal] = useState<'status'|'label'|'priority'|'tracker'|'category'|'member'|null>(null);
  const [modalInput, setModalInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Available users for member add
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedNewMember, setSelectedNewMember] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, memberRes, statusRes, labelRes, priorityRes, trackerRes, categoryRes] = await Promise.all([
        fetchApi(`/api/projects`),
        fetchApi(`/api/projects/members/${id}?search=${searchInput}&page=&perpage=`),
        fetchApi(`/api/projects/issue/statuses/${id}`),
        fetchApi(`/api/projects/issue/labels/${id}`),
        fetchApi(`/api/projects/issue/priorities/${id}`),
        fetchApi(`/api/projects/issue/trackers/${id}`),
        fetchApi(`/api/projects/issue/categories/${id}`)
      ]);

      if (projectRes.result) {
        const project = projectRes.data.datas.find((p: any) => p.id === Number(id));
        if (project) setProjectName(project.name);
      }

      if (memberRes.result) setMembers(memberRes.data.datas || memberRes.data);
      if (statusRes.result) setStatuses(statusRes.data.statuses || statusRes.data);
      if (labelRes.result) setLabels(labelRes.data.labels || labelRes.data);
      if (priorityRes.result) setPriorities(priorityRes.data.priorities || priorityRes.data);
      if (trackerRes.result) setTrackers(trackerRes.data.trackers || trackerRes.data);
      if (categoryRes.result) setCategories(categoryRes.data.categories || categoryRes.data);
      
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id, searchInput]);

  const handleCreateItem = async () => {
      if(!modalInput.trim()){
          Swal.fire({ icon: 'error', title: 'Value cannot be empty', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
          return;
      }
      
      let endpoint = '';
      if(activeModal === 'status') endpoint = 'status';
      if(activeModal === 'label') endpoint = 'label';
      if(activeModal === 'priority') endpoint = 'prioritiy'; // The API uses prioritiy
      if(activeModal === 'tracker') endpoint = 'tracker';
      if(activeModal === 'category') endpoint = 'category';

      try {
          setIsSaving(true);
          const res = await fetchApi(`/api/projects/issue/${endpoint}`, {
              method: 'POST',
              body: JSON.stringify({ name: modalInput, project_id: id })
          });
          if(res.result) {
              Swal.fire({ icon: 'success', title: 'Created successfully', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
              setModalInput('');
              setActiveModal(null);
              fetchData();
          }
      } catch (err) {} finally { setIsSaving(false); }
  };

  const handleAddMember = () => {
     setActiveModal(null);
     Swal.fire({ icon: 'info', title: 'Add member feature', text: 'UI mirrored. Hook up to actual POST endpoint.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'status', label: 'Status', icon: Loader2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'labels', label: 'Labels', icon: Tag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'priorities', label: 'Priority', icon: Flag, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { id: 'trackers', label: 'Trackers', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'categories', label: 'Categories', icon: LayoutGrid, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const renderGenericList = (items: ItemState[], type: 'status'|'label'|'priority'|'tracker'|'category', Icon: any, colorCls: string, bgCls: string) => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-bold text-white capitalize">{type} Configuration</h2>
         <button 
           onClick={() => { setModalInput(''); setActiveModal(type); }}
           className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition-all font-bold shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 text-sm focus:ring-2 focus:ring-indigo-500 outline-none hover:-translate-y-0.5"
         >
           <Plus className="h-4 w-4" /> Add {type}
         </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] shadow-inner overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

        {items.length === 0 ? (
           <div className="p-10 text-center text-white/40 font-bold flex flex-col items-center relative z-10">
             <Icon className="h-12 w-12 mb-3 text-white/10" />
             No {type}s configured.
           </div>
        ) : (
          <div className="divide-y divide-white/5 relative z-10">
            {items.map(item => (
               <div key={item.id} className="p-5 flex justify-between items-center group hover:bg-white/[0.02] transition-all">
                  <div className="flex items-center gap-4">
                     <div className={`p-2.5 rounded-xl ${bgCls} ${colorCls} shrink-0 ring-1 ring-white/5 shadow-inner`}><Icon className="h-5 w-5" /></div>
                     <span className="font-bold text-white text-[15px]">{item.name}</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-indigo-500/50" title="Edit"><Edit2 className="h-4 w-4" /></button>
                     <button className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-red-500/50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10 w-full">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)] shrink-0">
            <Settings className="h-6 w-6" />
          </div>
          <div>
             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-1">Project Settings</h1>
             <p className="text-sm text-white/50 font-medium tracking-wide">{projectName || 'Loading...'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         
         {/* Settings Navigation Sidebar */}
         <div className="w-full lg:w-64 shrink-0 space-y-2">
            <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-4 space-y-1 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>

               {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-sm relative z-10 outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                       activeTab === tab.id 
                       ? `bg-[#0a0a0a] shadow-[0_4px_16px_rgba(0,0,0,0.5)] border border-white/10 text-white ${tab.color.replace('text', 'text').replace('-500', '-400')} ` 
                       : 'text-white/50 hover:bg-white/[0.03] hover:text-white border border-transparent'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? tab.color : 'text-white/30'}`} />
                    {tab.label}
                    {activeTab === tab.id && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${tab.color.replace('text-', 'bg-')}`} />}
                  </button>
               ))}
            </div>
         </div>

         {/* Settings Content Area */}
         <div className="flex-1 bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-6 md:p-10 min-h-[500px] relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 h-full">
               {/* MEMBERS TAB CONTENT */}
               {activeTab === 'members' && (
                 <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                       <h2 className="text-xl font-bold text-white">Project Members</h2>
                       <div className="flex w-full sm:w-auto items-center gap-3">
                          <div className="relative w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                            <input 
                              type="text" 
                              placeholder="Search members..." 
                              className="w-full pl-11 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-bold text-sm text-white shadow-inner placeholder:text-white/20"
                              value={searchInput}
                              onChange={e => setSearchInput(e.target.value)}
                            />
                          </div>
                          <button onClick={() => setActiveModal('member')} className="shrink-0 bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition-all font-bold shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 text-sm outline-none focus:ring-2 focus:ring-indigo-500 hover:-translate-y-0.5">
                            <Plus className="h-4 w-4" /> Add Member
                          </button>
                       </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] shadow-inner overflow-hidden relative">
                       <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
                       <div className="overflow-x-auto relative z-10">
                         <table className="w-full text-left border-collapse min-w-[800px]">
                           <thead>
                             <tr className="bg-white/[0.02] border-b border-white/5">
                               <th className="py-4 px-6 text-xs font-black text-white/30 uppercase tracking-widest w-16">No.</th>
                               <th className="py-4 px-6 text-xs font-black text-white/30 uppercase tracking-widest">User</th>
                               <th className="py-4 px-6 text-xs font-black text-white/30 uppercase tracking-widest hidden md:table-cell">Contact</th>
                               <th className="py-4 px-6 text-xs font-black text-white/30 uppercase tracking-widest">Role</th>
                               <th className="py-4 px-6 text-xs font-black text-white/30 uppercase tracking-widest hidden lg:table-cell">Joined</th>
                               <th className="py-4 px-6 text-xs font-black text-white/30 uppercase tracking-widest text-right w-20"></th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                             {loading && members.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-white/30"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                             ) : members.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-white/30 font-bold">No members found.</td></tr>
                             ) : members.map((mem, i) => (
                                <tr key={mem.id} className="hover:bg-white/[0.02] transition-colors group">
                                   <td className="py-4 px-6 font-bold text-white/30">{i + 1}</td>
                                   <td className="py-4 px-6">
                                      <div className="flex items-center gap-4">
                                         <img src={`/upload/${mem.user.avarta}`} className="h-10 w-10 rounded-full object-cover ring-2 ring-[#121212] shadow-sm shrink-0 bg-white/5" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                                         <div>
                                            <p className="font-bold text-white text-[15px]">{mem.user.first_name} {mem.user.last_name}</p>
                                            <p className="font-bold text-white/40 text-xs">@{mem.user.dis_name || (mem.user as any).display_name}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-4 px-6 hidden md:table-cell">
                                      <div className="flex items-center gap-2 text-sm font-bold text-white/60">
                                        <Mail className="h-3.5 w-3.5 text-white/30" /> {mem.user.email}
                                      </div>
                                   </td>
                                   <td className="py-4 px-6">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest shadow-inner ${mem.user.role.id === 1 ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20' : mem.user.role.id === 2 ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20' : 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'}`}>
                                         <Shield className="h-3 w-3" /> {mem.user.role.name}
                                      </span>
                                   </td>
                                   <td className="py-4 px-6 hidden lg:table-cell text-sm font-bold text-white/60">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 text-white/30" /> {new Date(mem.created_on).toLocaleDateString()}
                                      </div>
                                   </td>
                                   <td className="py-4 px-6 text-right">
                                      <button className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 outline-none focus:ring-2 focus:ring-red-500/50" title="Remove Member">
                                         <Trash2 className="h-4 w-4" />
                                      </button>
                                   </td>
                                </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                    </div>
                 </div>
               )}

               {/* DYNAMIC SETTINGS TABS */}
               {activeTab === 'status' && renderGenericList(statuses, 'status', Loader2, 'text-indigo-400', 'bg-indigo-500/10')}
               {activeTab === 'labels' && renderGenericList(labels, 'label', Tag, 'text-emerald-400', 'bg-emerald-500/10')}
               {activeTab === 'priorities' && renderGenericList(priorities, 'priority', Flag, 'text-orange-400', 'bg-orange-500/10')}
               {activeTab === 'trackers' && renderGenericList(trackers, 'tracker', Target, 'text-purple-400', 'bg-purple-500/10')}
               {activeTab === 'categories' && renderGenericList(categories, 'category', LayoutGrid, 'text-pink-400', 'bg-pink-500/10')}

            </div>
         </div>
      </div>

      {/* Tailwind Generic Modal for ALL configuration actions */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col relative">
            
            <div className="px-7 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 capitalize">
                 {activeModal === 'member' ? (
                     <><Users className="h-5 w-5 text-indigo-400" /> Add Member</>
                 ) : (
                     <><Plus className="h-5 w-5 text-white/50" /> New {activeModal}</>
                 )}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-7 relative z-10 bg-[#0a0a0a]">
               {activeModal === 'member' ? (
                  <div className="space-y-5">
                     <p className="text-sm text-white/50 font-bold">Add a user to this project team.</p>
                     <div className="space-y-2 relative">
                       <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1">Select User</label>
                       <select 
                         value={selectedNewMember} onChange={e => setSelectedNewMember(e.target.value)}
                         className="w-full px-5 py-3.5 bg-[#121212] border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none appearance-none shadow-inner"
                       >
                         <option value="" className="bg-[#121212] text-white">Select a user...</option>
                         <option value="test" className="bg-[#121212] text-white">Demo User 1</option>
                       </select>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-2 relative">
                     <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1 capitalize">{activeModal} Name</label>
                     <input 
                       type="text" 
                       className="w-full px-5 py-3.5 bg-[#121212] border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner placeholder:text-white/20" 
                       placeholder={`e.g. ${activeModal === 'status' ? 'In Progress' : activeModal === 'priority' ? 'High' : 'Feature'}`} 
                       value={modalInput} 
                       onChange={e => setModalInput(e.target.value)} 
                       autoFocus
                       onKeyDown={e => e.key === 'Enter' && handleCreateItem()}
                     />
                  </div>
               )}
            </div>

            <div className="px-7 py-5 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3 rounded-b-[2rem]">
                <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5 transition-colors outline-none">
                  Cancel
                </button>
                <button 
                  onClick={activeModal === 'member' ? handleAddMember : handleCreateItem} 
                  disabled={isSaving} 
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 transition-all disabled:opacity-50 flex items-center gap-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} 
                  {activeModal === 'member' ? 'Add User' : 'Create'}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectSettingsPage;
