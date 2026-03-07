'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { 
  Plus, Edit2, Trash2, FolderOpen, FileText, Download, 
  UploadCloud, Save, Folder, AppWindow, Loader2, X, FileEdit
} from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="animate-pulse bg-[#121212] h-64 rounded-xl"></div> });

interface Resource {
  id: number;
  title: string;
  note: string;
}

interface ResourceFile {
  id: number;
  file_name: string;
  file_name_show: string;
}

const ProjectResourcesPage = () => {
  const { id } = useParams();
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [files, setFiles] = useState<ResourceFile[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'upload' | 'updateFile' | null>(null);
  const [modalInputText, setModalInputText] = useState('');
  
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [editFileId, setEditFileId] = useState<number>(0);
  const [editFileNameShow, setEditFileNameShow] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, resRes] = await Promise.all([
        fetchApi('/api/projects'),
        fetchApi(`/api/projects/resources/${id}?search&perpage=&page=`)
      ]);

      if (projectRes.result) {
        const project = projectRes.data.datas.find((p: any) => p.id === Number(id));
        if (project) setProjectName(project.name);
      }

      if (resRes.result) {
        setResources(resRes.data.datas || resRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const handleSelectResource = async (resource: Resource) => {
    setSelectedResource(resource);
    setTitle(resource.title);
    setNote(resource.note);
    fetchFiles(resource.id);
  };

  const fetchFiles = async (resId: number) => {
    try {
      const fileRes = await fetchApi(`/api/projects/resources/files/${resId}?search&page&perpage`);
      if (fileRes.result && fileRes.data.file.datas && fileRes.data.file.datas[0]?.id !== null) {
        setFiles(fileRes.data.file.datas);
      } else {
        setFiles([]);
      }
    } catch (error) {
      setFiles([]);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedResource) return;
    if (!title.trim()) {
        Swal.fire({ icon: "error", title: "Missing title", toast: true, position: "top-end", timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        return;
    }
    try {
      setIsSaving(true);
      const res = await fetchApi(`/api/projects/resource/${selectedResource.id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, note })
      });
      if (res.result) {
        fetchData();
        Swal.fire({ icon: "success", title: "Saved successfully!", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      }
    } catch (error) {} finally {
      setIsSaving(false);
    }
  };

  const handleCreateResource = async () => {
      if(!modalInputText.trim()) return Swal.fire({ icon: "error", title: "Invalid title", toast: true, position: "top-end", timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      setIsSaving(true);
      try {
          const res = await fetchApi(`/api/projects/resource/${id}`, { method: 'POST', body: JSON.stringify({ title: modalInputText }) });
          if(res.result){
              fetchData();
              setModalInputText('');
              setActiveModal(null);
              Swal.fire({ icon: "success", title: "Created Successfully", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
          }
      } catch (err) {} finally { setIsSaving(false); }
  };

  const handleEditResourceSave = async () => {
    if(!modalInputText.trim() || !selectedResource) return;
    setIsSaving(true);
    try {
        const res = await fetchApi(`/api/projects/resource/${selectedResource.id}`, { method: 'PUT', body: JSON.stringify({ title: modalInputText }) });
        if(res.result){
            fetchData();
            setActiveModal(null);
            Swal.fire({ icon: "success", title: "Renamed Successfully", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        }
    } catch (err) {} finally { setIsSaving(false); }
  };

  const handleDeleteResource = async (resId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this resource note!",
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
            await fetchApi(`/api/projects/resource/${resId}`, { method: 'DELETE' });
            fetchData();
            if(selectedResource && selectedResource.id === resId) setSelectedResource(null);
            Swal.fire({ title: "Deleted!", icon: "success", timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        } catch(err){}
    }
  };

  const handleUploadFile = async () => {
    if(!fileInput || !selectedResource) return Swal.fire({ icon: "error", title: "Please choose a file", toast: true, position: "top-end", timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resource_file", fileInput);
    try {
        const res = await fetchApi(`/api/projects/resources/file/${selectedResource.id}`, { method: 'POST', body: formData, headers: {} });
        if(res.result){
            Swal.fire({ icon: "success", title: "File uploaded!", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
             setActiveModal(null);
             setFileInput(null);
             fetchFiles(selectedResource.id);
        }
    } catch (err) {} finally { setIsUploading(false); }
  };

  const handleEditFile = async () => {
    if(!fileInput || !editFileId) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("new_file", fileInput);
    try {
        const res = await fetchApi(`/api/projects/resources/file/${editFileId}`, { method: 'PUT', body: formData, headers: {} });
        if(res.result){
             Swal.fire({ icon: "success", title: "File updated!", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
             setActiveModal(null);
             setFileInput(null);
             if(selectedResource) fetchFiles(selectedResource.id);
        }
    } catch (err){} finally { setIsUploading(false); }
  };

  const handleDeleteFile = async (fId: number) => {
    const result = await Swal.fire({
      title: "Delete file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#333333",
      confirmButtonText: "Yes, delete",
      background: '#121212',
      color: '#fff'
    });
    if(result.isConfirmed){
        try {
            await fetchApi(`/api/projects/resources/file/${fId}`, { method: 'DELETE' });
            if(selectedResource) fetchFiles(selectedResource.id);
            Swal.fire({ title: "Deleted!", icon: "success", timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
        } catch(err){}
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-60px)] flex flex-col animate-in fade-in duration-500 space-y-6">
      
      {/* Header */}
      <div className="shrink-0 flex justify-between items-center bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10 w-full">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)] shrink-0">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-1">Knowledge Base</h1>
            <p className="text-sm text-white/50 font-medium tracking-wide">Project Resources & Documentation</p>
          </div>
        </div>
        <button 
          onClick={() => { setActiveModal('create'); setModalInputText(''); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all font-bold shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 outline-none focus:ring-2 focus:ring-indigo-500 hover:-translate-y-0.5 relative z-10"
        >
          <Plus className="h-5 w-5" />
          New Resource
        </button>
      </div>

      {loading && resources.length === 0 ? (
        <div className="flex-1 flex justify-center items-center">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center bg-[#121212]/80 backdrop-blur-xl border border-dashed border-white/10 rounded-[2rem] p-12 text-center relative overflow-hidden shadow-inner">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
             
             <div className="w-64 mb-6 relative z-10 p-6 bg-white/5 rounded-full ring-1 ring-white/10 flex items-center justify-center shadow-inner">
               <FolderOpen className="w-full h-full text-indigo-400 opacity-50" />
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Build your Knowledge Base</h3>
             <p className="text-white/40 max-w-sm mb-6 font-medium relative z-10">Create shared notebooks, upload files, and document important project details.</p>
             <button onClick={() => { setActiveModal('create'); setModalInputText(''); }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-500 font-bold shadow-[0_4px_15px_rgba(105,108,255,0.4)] flex items-center gap-2 transition-all hover:-translate-y-0.5 outline-none focus:ring-2 focus:ring-indigo-500 relative z-10">
               <Plus className="h-5 w-5" /> Get Started
             </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
            
            {/* Left Pane - List */}
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mt-16 -mr-16"></div>

                <div className="p-6 border-b border-white/5 bg-white/[0.02] relative z-10">
                    <h2 className="font-bold text-white flex items-center gap-2 text-lg"><AppWindow className="h-5 w-5 text-indigo-400" /> {projectName}</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10">
                    {resources.map((res) => (
                        <div 
                          key={res.id} 
                          onClick={() => handleSelectResource(res)}
                          className={`p-4 rounded-xl cursor-pointer transition-all flex justify-between items-center group relative shadow-inner ${selectedResource?.id === res.id ? 'bg-[#0a0a0a] text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(105,108,255,0.1)]' : 'bg-white/[0.02] text-white/70 border border-white/5 hover:border-white/10 hover:bg-[#0a0a0a]'}`}
                        >
                           <div className="flex items-center gap-3 overflow-hidden">
                               <FileText className={`h-4 w-4 shrink-0 ${selectedResource?.id === res.id ? 'text-indigo-400' : 'text-white/30'}`} />
                               <span className="font-bold truncate text-[15px]">{res.title}</span>
                           </div>
                           
                           {/* Inline Action Buttons */}
                           <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-[#121212]/90 backdrop-blur-md rounded-lg p-1 shadow-sm absolute right-3 ring-1 ring-white/5">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setSelectedResource(res); setModalInputText(res.title); setActiveModal('edit'); }}
                                 className="p-1.5 text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors" title="Rename"
                               >
                                 <Edit2 className="h-3.5 w-3.5" />
                               </button>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setSelectedResource(res); setFileInput(null); setActiveModal('upload'); }}
                                 className="p-1.5 text-white/30 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors" title="Upload File"
                               >
                                 <UploadCloud className="h-3.5 w-3.5" />
                               </button>
                               <button 
                                 onClick={(e) => handleDeleteResource(res.id, e)}
                                 className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Delete"
                               >
                                 <Trash2 className="h-3.5 w-3.5" />
                               </button>
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Pane - Editor */}
            <div className="flex-1 bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col overflow-hidden relative">
                {selectedResource ? (
                    <div className="flex flex-col h-full relative z-10 w-full h-full bg-[#0a0a0a]/50">
                        {/* Editor Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#121212]/80 backdrop-blur-sm z-10">
                            <input 
                              type="text" 
                              className="text-2xl font-bold text-white bg-transparent border-none outline-none w-full placeholder-white/20 mr-4 focus:ring-0 px-0"
                              placeholder="Untitled Document" 
                              value={title} 
                              onChange={e => setTitle(e.target.value)} 
                            />
                            <button 
                              onClick={handleSaveNote} disabled={isSaving}
                              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 transition-all disabled:opacity-50 shrink-0 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                               {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                               Save Note
                            </button>
                        </div>
                        
                        {/* Quill Editor */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar quill-modern-container relative">
                            <ReactQuill 
                                theme="snow" 
                                value={note} 
                                onChange={setNote}
                                className="h-full border-none"
                                modules={{ toolbar: [ [{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image', 'code-block'], ['clean'] ] }}
                            />
                        </div>

                        {/* Files Section */}
                        <div className="shrink-0 border-t border-white/5 bg-[#121212]/80 backdrop-blur-sm px-8 py-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                  <Folder className="h-5 w-5 text-indigo-400" /> Attached Files ({files.length})
                                </h4>
                                <button 
                                  onClick={() => { setFileInput(null); setActiveModal('upload'); }}
                                  className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 focus:outline-none"
                                >
                                  <Plus className="h-4 w-4" /> Add File
                                </button>
                            </div>
                            
                            {files.length === 0 ? (
                                <p className="text-sm text-white/30 font-bold bg-[#0a0a0a] p-4 rounded-xl border border-white/5 shadow-inner">No files attached to this resource.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {files.map(f => (
                                        <div key={f.id} className="bg-[#0a0a0a] border border-white/5 rounded-[1rem] p-4 flex flex-col gap-3 group hover:border-indigo-500/30 transition-all shadow-inner">
                                            <a href={`/storage/${f.file_name}`} target="_blank" rel="noreferrer" className="text-[15px] font-bold text-white/80 flex items-center gap-3 truncate hover:text-indigo-400 transition-colors" title={f.file_name_show}>
                                                <FileText className="h-5 w-5 text-indigo-400 shrink-0" />
                                                <span className="truncate">{f.file_name_show}</span>
                                            </a>
                                            <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/5">
                                                <a href={`/storage/${f.file_name}`} download={f.file_name} className="p-2 text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Download">
                                                    <Download className="h-4 w-4" />
                                                </a>
                                                <button onClick={() => { setEditFileId(f.id); setEditFileNameShow(f.file_name_show); setFileInput(null); setActiveModal('updateFile'); }} className="p-2 text-white/30 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Update File">
                                                    <FileEdit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDeleteFile(f.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/30 bg-[#0a0a0a] relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        <FolderOpen className="h-16 w-16 mb-5 opacity-20 relative z-10" />
                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">Select a Resource</h3>
                        <p className="font-medium text-white/50 relative z-10">Choose a resource from the left pane to view or edit.</p>
                    </div>
                )}
            </div>
            
        </div>
      )}

      {/* Tailwind Modals handling Create, Edit, Upload, Update File */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col relative">
            
            <div className="px-7 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {activeModal === 'create' && <><Plus className="h-5 w-5 text-indigo-400" /> Create Resource</>}
                {activeModal === 'edit' && <><Edit2 className="h-5 w-5 text-indigo-400" /> Rename Resource</>}
                {activeModal === 'upload' && <><UploadCloud className="h-5 w-5 text-indigo-400" /> Upload File</>}
                {activeModal === 'updateFile' && <><FileEdit className="h-5 w-5 text-indigo-400" /> Update File</>}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-7 relative z-10 bg-[#0a0a0a]">
               {(activeModal === 'create' || activeModal === 'edit') && (
                 <div className="space-y-2 relative">
                   <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1">Resource Title</label>
                   <input 
                     type="text" 
                     className="w-full px-5 py-3.5 bg-[#121212] border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner placeholder:text-white/20" 
                     placeholder="e.g. Server Credentials, API Docs..." 
                     value={modalInputText} 
                     onChange={e => setModalInputText(e.target.value)} 
                     autoFocus
                     onKeyDown={e => e.key === 'Enter' && (activeModal === 'create' ? handleCreateResource() : handleEditResourceSave())}
                   />
                 </div>
               )}

               {(activeModal === 'upload' || activeModal === 'updateFile') && (
                 <div className="space-y-5">
                   {activeModal === 'updateFile' && (
                     <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl text-sm font-bold border border-blue-500/20 shadow-inner">
                       Updating: <span className="underline">{editFileNameShow}</span>
                     </div>
                   )}
                   <div className="space-y-2 relative">
                     <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1">Select File</label>
                     <input 
                       type="file" ref={fileInputRef} onChange={e => setFileInput(e.target.files?.[0] || null)}
                       className="w-full px-5 py-4 bg-[#121212] border border-white/10 rounded-xl transition-all font-bold text-white outline-none file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 file:ring-1 file:ring-indigo-500/20 cursor-pointer shadow-inner file:uppercase file:tracking-widest" 
                     />
                   </div>
                 </div>
               )}
            </div>

            <div className="px-7 py-5 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3 rounded-b-[2rem]">
                <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5 transition-colors outline-none focus:ring-2 focus:ring-white/20">
                  Cancel
                </button>
                {activeModal === 'create' && (
                  <button onClick={handleCreateResource} disabled={isSaving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 transition-all disabled:opacity-50 flex items-center gap-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Create
                  </button>
                )}
                {activeModal === 'edit' && (
                  <button onClick={handleEditResourceSave} disabled={isSaving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 transition-all disabled:opacity-50 flex items-center gap-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Save
                  </button>
                )}
                {(activeModal === 'upload' || activeModal === 'updateFile') && (
                  <button 
                    onClick={activeModal === 'upload' ? handleUploadFile : handleEditFile} 
                    disabled={isUploading || !fileInput} 
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 transition-all disabled:opacity-50 flex items-center gap-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Upload
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Internal Custom Quill Styles for Tailwind Integration (Dark Mode) */}
      <style dangerouslySetInnerHTML={{__html: `
        .quill-modern-container .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          padding: 16px 24px !important;
          border-radius: 0 !important;
          background: rgba(18, 18, 18, 0.8) !important;
          backdrop-filter: blur(8px) !important;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .quill-modern-container .ql-container {
          border: none !important;
          font-family: inherit !important;
          font-size: 1rem !important;
          background: rgba(10, 10, 10, 0.5) !important;
        }
        .quill-modern-container .ql-editor {
          padding: 32px 40px !important;
          min-height: 400px;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        .quill-modern-container .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.3) !important;
          font-style: normal !important;
          font-weight: 500 !important;
        }
        /* Toolbar Buttons Dark Mode Overrides */
        .quill-modern-container .ql-toolbar button {
          border-radius: 6px !important;
          transition: all 0.2s !important;
        }
        .quill-modern-container .ql-toolbar button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .quill-modern-container .ql-toolbar button.ql-active {
          background: rgba(105, 108, 255, 0.15) !important;
        }
        .quill-modern-container .ql-toolbar button.ql-active .ql-stroke, 
        .quill-modern-container .ql-toolbar button.ql-active .ql-fill {
           stroke: #696cff !important;
           fill: #696cff !important;
        }
        .quill-modern-container .ql-toolbar .ql-stroke {
           stroke: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-modern-container .ql-toolbar .ql-fill {
           fill: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-modern-container .ql-picker {
           color: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-modern-container .ql-picker-options {
           background: #121212 !important;
           border: 1px solid rgba(255,255,255,0.1) !important;
           color: white !important;
           border-radius: 8px !important;
           box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
      `}} />
    </div>
  );
};

export default ProjectResourcesPage;
