'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { 
  Search, UserPlus, MoreVertical, Eye, KeyRound, Edit2, 
  Trash2, Filter, ChevronLeft, ChevronRight, CheckCircle2,
  X, ShieldAlert, Mail, User, Shield, Briefcase, Loader2
} from 'lucide-react';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  description: string;
  avarta: string;
  created_on: string;
  role: {
    id: number;
    name: string;
  };
}

interface ProjectData {
  id: number;
  name: string;
  members: { user: { id: string } }[];
}

interface Paginate {
  page: number;
  perpage: number;
  total: number;
  pages: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [paginate, setPaginate] = useState<Paginate | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<number>(3);
  const [roles, setRoles] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    search: '',
    role: '0',
    rowsPerPage: 5
  });

  const [searchInput, setSearchInput] = useState('');

  // Modals state
  const [activeModal, setActiveModal] = useState<'view' | 'edit' | 'password' | 'create' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Edit logic
  const [editRoleId, setEditRoleId] = useState<number>(0);
  
  // Password logic
  const [changePw, setChangePw] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Create form
  const [createForm, setCreateForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    roleId: 3
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchApi('/api/profile');
        if (res.result && res.data.length > 0) setCurrentUserRole(res.data[0].role.id);
      } catch (error) {}
    };
    const getProjects = async () => {
      try {
        const res = await fetchApi('/api/projects?search=&page=&perpage=');
        if (res.result) setProjects(res.data.datas);
      } catch (error) {}
    };
    const getRoles = async () => {
      try {
        const res = await fetchApi('/api/roles');
        if (res.result) setRoles(res.data);
      } catch (error) {}
    };

    getProfile();
    getProjects();
    getRoles();
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchApi(`/api/users?search=${filters.search}&role=${filters.role}&page=${page}&perpage=${filters.rowsPerPage}`);
      if (res.result) {
        setUsers(res.data.datas);
        setPaginate(res.data.paginate);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [filters.role, filters.rowsPerPage, filters.search]);

  const handleSearch = () => setFilters(prev => ({ ...prev, search: searchInput }));
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleSearch(); };

  const getUserProjects = (userId: string) => {
    const projectNames: string[] = [];
    projects.forEach((proj) => {
      if (proj.members?.some(m => m.user?.id === userId)) projectNames.push(proj.name);
    });
    if (projectNames.length === 0) return 'No Project';
    if (projectNames.length > 2) return projectNames.slice(0, 2).join(', ') + '...';
    return projectNames.join(', ');
  };

  const handleDeleteUser = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#333333",
      confirmButtonText: "Yes, delete it!",
      background: '#121212',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await fetchApi(`/api/user/${id}`, { method: 'DELETE' });
        fetchUsers(paginate?.page || 1);
        Swal.fire({ title: "Deleted!", text: "User successfully removed", icon: "success", timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } catch (error) {}
    }
  };

  const handleEditUserSave = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetchApi(`/api/user/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({ new_role_id: editRoleId })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Role updated successfully', position: 'top-end', toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        fetchUsers(paginate?.page || 1);
        setActiveModal(null);
      }
    } catch(err) {}
  };

  const handleChangePasswordSave = async () => {
    if (!selectedUser) return;
    const passwordtest = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordtest.test(changePw)) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Min 6 chars, 1 uppercase, 1 number.', position: 'top-end', toast: true, timer: 4000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }

    try {
      const res = await fetchApi(`/api/user/pass/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({ password: changePw })
      });
      if (res.result) {
        Swal.fire({ icon: 'success', title: 'Password changed successfully', position: 'top-end', toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        fetchUsers(paginate?.page || 1);
        setActiveModal(null);
        setChangePw('');
      }
    } catch(err) {}
  };

  const handleCreateAccount = async () => {
    Swal.fire({ icon: 'info', title: 'Create account feature', text: 'UI mirrored. Hook up to actual POST /api/user.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    setActiveModal(null);
  };

  const renderPaginationInfo = () => {
    if (!paginate) return null;
    const start = (paginate.page - 1) * paginate.perpage + 1;
    const end = Math.min(paginate.page * paginate.perpage, paginate.total);
    return (
      <span className="text-sm text-white/50 font-medium">
        Showing <span className="font-bold text-white">{paginate.total === 0 ? 0 : start}</span> to <span className="font-bold text-white">{end}</span> of <span className="font-bold text-white">{paginate.total}</span> users
      </span>
    );
  };

  const getRoleBadgeClasses = (roleId: number) => {
    switch (roleId) {
      case 1: return "bg-red-500/10 text-red-400 ring-red-500/20";
      case 2: return "bg-purple-500/10 text-purple-400 ring-purple-500/20";
      default: return "bg-blue-500/10 text-blue-400 ring-blue-500/20";
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header and Controls */}
      <div className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        {/* Decorative Background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">User Directory</h1>
            <p className="text-sm text-white/50 font-medium tracking-wide">Manage system access and roles</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto relative z-10">
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shadow-inner">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2 flex items-center gap-1"><Filter className="h-3 w-3" /> Rows</span>
            <select 
              className="bg-[#0a0a0a] border border-white/5 text-sm font-bold text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-1.5 cursor-pointer shadow-sm [&>option]:bg-[#121212]"
              value={filters.rowsPerPage}
              onChange={(e) => setFilters({...filters, rowsPerPage: Number(e.target.value)})}
            >
              {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shadow-inner">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2 flex items-center gap-1"><Shield className="h-3 w-3" /> Role</span>
            <select 
              className="bg-[#0a0a0a] border border-white/5 text-sm font-bold text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-1.5 cursor-pointer shadow-sm [&>option]:bg-[#121212]"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
            >
              <option value="0">All Members</option>
              <option value="2">Admin</option>
              <option value="3">Normal User</option>
            </select>
          </div>

          <div className="relative flex-grow lg:flex-grow-0 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 hover:bg-white/10 border border-transparent focus:bg-[#0a0a0a] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-white shadow-sm outline-none placeholder:text-white/30 rounded-xl"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyUp={handleKeyUp}
            />
          </div>

          <button 
            onClick={() => setActiveModal('create')}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-[0_0_15px_rgba(105,108,255,0.4)] text-sm hover:-translate-y-0.5 whitespace-nowrap lg:w-auto w-full border border-indigo-400/20"
          >
            <UserPlus className="h-5 w-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="py-5 px-6 text-xs font-black text-white/30 uppercase tracking-wider">Profile</th>
                <th className="py-5 px-6 text-xs font-black text-white/30 uppercase tracking-wider">Info</th>
                <th className="py-5 px-6 text-xs font-black text-white/30 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="py-5 px-6 text-xs font-black text-white/30 uppercase tracking-wider">Role</th>
                <th className="py-5 px-6 text-xs font-black text-white/30 uppercase tracking-wider hidden lg:table-cell">Projects</th>
                <th className="py-5 px-6 text-xs font-black text-white/30 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40">
                    <div className="flex justify-center mb-4"><Loader2 className="animate-spin h-8 w-8 text-indigo-400" /></div>
                    <span className="font-bold">Loading directory...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-white/40">
                    <CheckCircle2 className="h-16 w-16 mx-auto opacity-20 mb-4 text-white" />
                    <span className="font-bold text-lg text-white">No users found</span>
                    <p className="mt-1 font-medium">No users match your current filters or search query.</p>
                  </td>
                </tr>
              ) : users.map((user) => {
                const projectName = getUserProjects(user.id);
                const isSuperAdmin = user.role.id === 1;
                const isAdmin = user.role.id === 2;
                const isUser = user.role.id === 3;
                
                const disableDelete = (currentUserRole === 2 && (isSuperAdmin || isAdmin)) || (currentUserRole !== 2 && isSuperAdmin);
                const disableEdit = (currentUserRole === 2 && (isSuperAdmin || isAdmin)) || (currentUserRole !== 2 && isSuperAdmin);
                const disablePassword = (currentUserRole === 2 && (isSuperAdmin || isAdmin || isUser)) || (currentUserRole !== 2 && isSuperAdmin);

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="h-12 w-12 rounded-full ring-2 ring-[#0a0a0a] overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={`/upload/${user.avarta}`} alt={user.first_name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{user.first_name} {user.last_name}</p>
                      <p className="text-sm font-medium text-white/40">@{user.display_name}</p>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm font-medium text-white/60">
                        <Mail className="h-3.5 w-3.5 text-white/30" />
                        {user.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ring-1 ${getRoleBadgeClasses(user.role.id)} shadow-inner`}>
                        {user.role.id === 1 ? <ShieldAlert className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                        {user.role.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell max-w-[200px]">
                      <div className="flex items-center gap-2 text-sm font-bold text-white/50 truncate" title={projectName}>
                        <Briefcase className="h-3.5 w-3.5 text-white/20 flex-shrink-0" />
                        <span className="truncate">{projectName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedUser(user); setActiveModal('view'); }}
                          className="p-2 text-white/30 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 rounded-xl transition-all" title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {!disablePassword && (
                           <button 
                             onClick={() => { setSelectedUser(user); setActiveModal('password'); setChangePw(''); }}
                             className="p-2 text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 rounded-xl transition-all" title="Change password"
                           >
                             <KeyRound className="h-4 w-4" />
                           </button>
                        )}
                        {!disableEdit && (
                          <button 
                            onClick={() => { setSelectedUser(user); setEditRoleId(user.role.id); setActiveModal('edit'); }}
                            className="p-2 text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 rounded-xl transition-all" title="Edit role"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {!disableDelete && (
                          <button 
                            onClick={(e) => handleDeleteUser(user.id, e)}
                            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all" title="Delete account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02] relative z-10">
          {renderPaginationInfo()}
          
          {paginate && paginate.pages > 1 && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => fetchUsers(paginate.page - 1)} disabled={paginate.page <= 1}
                className="p-2 rounded-xl border border-white/10 text-white/60 bg-[#0a0a0a] hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-[#0a0a0a] shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-inner">
                {Array.from({length: Math.min(5, paginate.pages)}, (_, i) => {
                  let pageNum = i + 1;
                  if (paginate.pages > 5 && paginate.page > 3) {
                    pageNum = paginate.page - 2 + i;
                    if (pageNum > paginate.pages) pageNum = paginate.pages - (4 - i);
                  }
                  
                  const isActive = pageNum === paginate.page;
                  return (
                    <button 
                      key={pageNum} onClick={() => fetchUsers(pageNum)}
                      className={`px-4 py-2 text-sm font-bold border-r border-white/10 last:border-0 transition-all outline-none focus:bg-indigo-500/20 ${isActive ? 'bg-indigo-600/20 text-indigo-400' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => fetchUsers(paginate.page + 1)} disabled={paginate.page >= paginate.pages}
                className="p-2 rounded-xl border border-white/10 text-white/60 bg-[#0a0a0a] hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-[#0a0a0a] shadow-inner transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32"></div>
            
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                {activeModal === 'view' && <><Eye className="h-5 w-5 text-blue-400 bg-blue-500/20 p-1 rounded-md ring-1 ring-blue-500/30" /> User Details</>}
                {activeModal === 'edit' && <><Edit2 className="h-5 w-5 text-indigo-400 bg-indigo-500/20 p-1 rounded-md ring-1 ring-indigo-500/30" /> Edit Role</>}
                {activeModal === 'password' && <><KeyRound className="h-5 w-5 text-emerald-400 bg-emerald-500/20 p-1 rounded-md ring-1 ring-emerald-500/30" /> Change Password</>}
                {activeModal === 'create' && <><UserPlus className="h-5 w-5 text-indigo-400 bg-indigo-500/20 p-1 rounded-md ring-1 ring-indigo-500/30" /> Create Account</>}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 text-white/30 hover:text-white/80 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar relative z-10">
              
              {/* VIEW Modal */}
              {activeModal === 'view' && selectedUser && (
                <div className="flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full ring-4 ring-[#0a0a0a] overflow-hidden mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                     <img src={`/upload/${selectedUser.avarta}`} alt="Avatar" className="h-full w-full object-cover bg-white/5" onError={(e) => { (e.target as HTMLImageElement).src = '/img/default-avatar.png'; }} />
                  </div>
                  <h4 className="text-3xl font-black text-white leading-tight mb-1">{selectedUser.first_name} {selectedUser.last_name}</h4>
                  <p className="text-white/50 font-medium mb-8">@{selectedUser.display_name}</p>

                  <div className="w-full space-y-5 bg-[#0a0a0a] rounded-2xl p-6 border border-white/5 shadow-inner">
                    <div className="flex border-b border-white/5 pb-4">
                      <span className="w-1/3 text-xs font-black tracking-widest text-white/30 uppercase">Email</span>
                      <span className="w-2/3 text-sm font-bold text-white break-all">{selectedUser.email}</span>
                    </div>
                    <div className="flex border-b border-white/5 pb-4">
                      <span className="w-1/3 text-xs font-black tracking-widest text-white/30 uppercase">Role</span>
                      <span className={`w-2/3 text-sm font-bold ${selectedUser.role.id === 1 ? 'text-red-400' : 'text-blue-400'}`}>{selectedUser.role.name}</span>
                    </div>
                    <div className="flex border-b border-white/5 pb-4">
                      <span className="w-1/3 text-xs font-black tracking-widest text-white/30 uppercase">Joined</span>
                      <span className="w-2/3 text-sm font-bold text-white">{new Date(selectedUser.created_on).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" })}</span>
                    </div>
                    <div className="flex border-b border-white/5 pb-4">
                      <span className="w-1/3 text-xs font-black tracking-widest text-white/30 uppercase">Project(s)</span>
                      <span className="w-2/3 text-sm font-bold text-white/70">{getUserProjects(selectedUser.id)}</span>
                    </div>
                    <div className="flex pt-1">
                      <span className="w-1/3 text-xs font-black tracking-widest text-white/30 uppercase">Info</span>
                      <span className="w-2/3 text-sm font-medium text-white/60 leading-relaxed">{selectedUser.description || "No specific description available."}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT ROLE Modal */}
              {activeModal === 'edit' && selectedUser && (
                <div className="space-y-6">
                   <div className="bg-indigo-500/10 p-5 rounded-[2rem] border border-indigo-500/20 flex items-center gap-5 mb-8 shadow-inner">
                     <div className="h-14 w-14 rounded-full overflow-hidden bg-[#0a0a0a] ring-2 ring-indigo-500/50 shadow-lg">
                        <img src={`/upload/${selectedUser.avarta}`} className="h-full w-full object-cover" />
                     </div>
                     <div>
                       <p className="font-bold text-white text-lg">{selectedUser.first_name} {selectedUser.last_name}</p>
                       <p className="text-sm text-indigo-400 font-medium">{selectedUser.email}</p>
                     </div>
                   </div>

                   <div className="space-y-3 relative">
                     <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-2">Assign Role</label>
                     <select 
                       value={editRoleId} onChange={e => setEditRoleId(Number(e.target.value))}
                       className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none appearance-none shadow-inner [&>option]:bg-[#121212]"
                     >
                       {roles.map(r => r.id !== 1 && <option key={r.id} value={r.id}>{r.name}</option>)}
                     </select>
                   </div>
                </div>
              )}

              {/* PASSWORD Modal */}
              {activeModal === 'password' && selectedUser && (
                <div className="space-y-8">
                   <div className="text-center mb-6">
                     <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                       <KeyRound className="h-10 w-10" />
                     </div>
                     <p className="text-white/60 font-medium px-4">Create a new password for <span className="font-bold text-white">@{selectedUser.display_name}</span></p>
                   </div>
                   
                   <div className="space-y-3 relative group">
                     <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-2">New Password</label>
                     <div className="relative">
                       <input 
                         type={showPw ? 'text' : 'password'} value={changePw} onChange={e => setChangePw(e.target.value)}
                         className="w-full pl-5 pr-12 py-4 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-white outline-none shadow-inner placeholder:text-white/20"
                         placeholder="Enter strong password"
                       />
                       <button 
                         type="button" onClick={() => setShowPw(!showPw)} 
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-emerald-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
                       >
                         {showPw ? <Eye className="h-5 w-5" /> : <Eye className="h-5 w-5 opacity-40" />}
                       </button>
                     </div>
                     <p className="text-xs text-white/30 font-medium pl-2">Must be at least 6 characters, containing uppercase and numbers.</p>
                   </div>
                </div>
              )}

              {/* CREATE ACCOUNT Modal */}
              {activeModal === 'create' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-white/30 uppercase pl-1">First Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner font-medium text-white focus:bg-[#121212]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-white/30 uppercase pl-1">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner font-medium text-white focus:bg-[#121212]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/30 uppercase pl-1">Username</label>
                    <input type="text" className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner font-medium text-white focus:bg-[#121212] placeholder:text-white/20 border-dashed" placeholder="@username" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/30 uppercase pl-1">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner font-medium text-white focus:bg-[#121212]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/30 uppercase pl-1">Password</label>
                    <input type="password" className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner font-medium text-white focus:bg-[#121212]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/30 uppercase pl-1">Role</label>
                    <select className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner appearance-none font-bold text-white focus:bg-[#121212] [&>option]:bg-[#121212]">
                      {roles.map(r => r.id !== 1 && <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer (Action Buttons) */}
            {activeModal !== 'view' && (
              <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3 mt-auto relative z-10">
                <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-white/20">
                  Cancel
                </button>
                {activeModal === 'edit' && (
                  <button onClick={handleEditUserSave} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_0_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 transition-all outline-none focus:ring-2 focus:ring-indigo-500">
                    Update Role
                  </button>
                )}
                {activeModal === 'password' && (
                  <button onClick={handleChangePasswordSave} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/20 transition-all outline-none focus:ring-2 focus:ring-emerald-500">
                    Save Password
                  </button>
                )}
                {activeModal === 'create' && (
                  <button onClick={handleCreateAccount} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_0_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 transition-all flex items-center gap-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    <UserPlus className="h-4 w-4" /> Create User
                  </button>
                )}
              </div>
            )}
            
            {activeModal === 'view' && (
               <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex justify-center relative z-10">
                 <button onClick={() => setActiveModal(null)} className="w-full bg-[#0a0a0a] border border-white/10 px-5 py-3 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all shadow-inner outline-none focus:ring-2 focus:ring-white/20">
                   Close View
                 </button>
               </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
