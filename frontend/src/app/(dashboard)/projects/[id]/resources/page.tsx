'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import {
  Plus, Edit2, Trash2, FolderOpen, FileText, Download,
  UploadCloud, Save, Folder, AppWindow, Loader2, X, FileEdit, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-white/5 h-64 rounded-xl border border-white/5"></div>
});

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
        Swal.fire({ icon: "success", title: "Note saved!", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      }
    } catch (error) { } finally {
      setIsSaving(false);
    }
  };

  const handleCreateResource = async () => {
    if (!modalInputText.trim()) return Swal.fire({ icon: "error", title: "Title is required", toast: true, position: "top-end", timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
    setIsSaving(true);
    try {
      const res = await fetchApi(`/api/projects/resource/${id}`, { method: 'POST', body: JSON.stringify({ title: modalInputText }) });
      if (res.result) {
        fetchData();
        setModalInputText('');
        setActiveModal(null);
        Swal.fire({ icon: "success", title: "Resource created", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      }
    } catch (err) { } finally { setIsSaving(false); }
  };

  const handleEditResourceSave = async () => {
    if (!modalInputText.trim() || !selectedResource) return;
    setIsSaving(true);
    try {
      const res = await fetchApi(`/api/projects/resource/${selectedResource.id}`, { method: 'PUT', body: JSON.stringify({ title: modalInputText }) });
      if (res.result) {
        fetchData();
        setActiveModal(null);
        Swal.fire({ icon: "success", title: "Renamed successful", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      }
    } catch (err) { } finally { setIsSaving(false); }
  };

  const handleDeleteResource = async (resId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Delete resource?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
      background: '#121212',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await fetchApi(`/api/projects/resource/${resId}`, { method: 'DELETE' });
        fetchData();
        if (selectedResource && selectedResource.id === resId) setSelectedResource(null);
        Swal.fire({ title: "Deleted", icon: "success", timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } catch (err) { }
    }
  };

  const handleUploadFile = async () => {
    if (!fileInput || !selectedResource) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resource_file", fileInput);
    try {
      const res = await fetchApi(`/api/projects/resources/file/${selectedResource.id}`, { method: 'POST', body: formData, headers: {} });
      if (res.result) {
        Swal.fire({ icon: "success", title: "File uploaded", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        setActiveModal(null);
        setFileInput(null);
        fetchFiles(selectedResource.id);
      }
    } catch (err) { } finally { setIsUploading(false); }
  };

  const handleEditFile = async () => {
    if (!fileInput || !editFileId) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("new_file", fileInput);
    try {
      const res = await fetchApi(`/api/projects/resources/file/${editFileId}`, { method: 'PUT', body: formData, headers: {} });
      if (res.result) {
        Swal.fire({ icon: "success", title: "File updated", position: "top-end", toast: true, timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
        setActiveModal(null);
        setFileInput(null);
        if (selectedResource) fetchFiles(selectedResource.id);
      }
    } catch (err) { } finally { setIsUploading(false); }
  };

  const handleDeleteFile = async (fId: number) => {
    const result = await Swal.fire({
      title: "Delete file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete",
      background: '#121212',
      color: '#fff'
    });
    if (result.isConfirmed) {
      try {
        await fetchApi(`/api/projects/resources/file/${fId}`, { method: 'DELETE' });
        if (selectedResource) fetchFiles(selectedResource.id);
        Swal.fire({ title: "Deleted", icon: "success", timer: 2000, showConfirmButton: false, background: '#121212', color: '#fff' });
      } catch (err) { }
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500">

      {/* Header */}
      <Card className="border-white/5 bg-card overflow-hidden relative shrink-0">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => window.location.href = '/projects'}>Projects</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{projectName || 'Project'}</span>
              </div>
              <CardTitle className="text-2xl font-bold">Project Hub & Resources</CardTitle>
            </div>
          </div>
          <Button onClick={() => { setActiveModal('create'); setModalInputText(''); }} className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
            <Plus className="h-5 w-5 mr-2" /> New Resource
          </Button>
        </CardHeader>
      </Card>

      {loading && resources.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Synchronizing resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <Card className="flex-1 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center p-12">
          <div className="p-6 rounded-full bg-white/5 mb-6 ring-1 ring-white/10">
            <FolderOpen className="w-16 h-16 text-muted-foreground opacity-20" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Build your Knowledge Base</h3>
          <p className="text-muted-foreground max-w-sm mb-8">Shared notebooks, files, and core project documentation all in one place.</p>
          <Button onClick={() => { setActiveModal('create'); setModalInputText(''); }} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-xl shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" /> Start First Resource
          </Button>
        </Card>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

          {/* Resources Sidebar */}
          <Card className="w-full lg:w-80 flex flex-col border-white/5 bg-card overflow-hidden shrink-0">
            <CardHeader className="p-5 border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AppWindow className="h-4 w-4 text-primary" /> Project Notebooks
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectResource(res)}
                    className={cn(
                      "p-3.5 rounded-xl cursor-pointer transition-all border group relative flex items-center justify-between",
                      selectedResource?.id === res.id
                        ? "bg-primary/10 border-primary/20 text-primary shadow-inner shadow-primary/5"
                        : "bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3 w-[180px]">
                      <FileText className={cn("h-4 w-4 shrink-0", selectedResource?.id === res.id ? "text-primary" : "opacity-30")} />
                      <span className="text-sm font-bold truncate">{res.title}</span>
                    </div>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={(e) => { e.stopPropagation(); setSelectedResource(res); setModalInputText(res.title); setActiveModal('edit'); }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                        onClick={(e) => handleDeleteResource(res.id, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Document Editor Area */}
          <Card className="flex-1 border-white/5 bg-card flex flex-col overflow-hidden relative">
            {selectedResource ? (
              <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
                  <input
                    type="text"
                    className="text-xl font-bold text-foreground bg-transparent border-none outline-none w-full placeholder-white/10 pr-4 focus:ring-0"
                    placeholder="Untitled Document"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <Button
                    onClick={handleSaveNote} disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 shrink-0 h-10 px-6"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Document
                  </Button>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-0 quill-modern-container relative">
                    <ReactQuill
                      theme="snow"
                      value={note}
                      onChange={setNote}
                      className="h-full border-none"
                      modules={{ toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image', 'code-block'], ['clean']] }}
                    />
                  </div>

                  {/* Files area at bottom of scroll area */}
                  <div className="border-t border-white/5 bg-white/[0.01] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Folder className="h-5 w-5 text-primary" /> Attached Files ({files.length})
                      </h4>
                      <Button
                        variant="link"
                        onClick={() => { setFileInput(null); setActiveModal('upload'); }}
                        className="text-primary hover:text-primary/80 font-bold flex items-center gap-1.5 p-0 h-auto"
                      >
                        <Plus className="h-4 w-4" /> Upload New
                      </Button>
                    </div>

                    {files.length === 0 ? (
                      <Card className="p-6 border-dashed border-white/10 bg-transparent flex items-center justify-center text-muted-foreground text-sm font-medium">
                        Drop files here or use the upload button to attach documentation.
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {files.map(f => (
                          <Card key={f.id} className="border-white/10 bg-[#0a0a0a] group hover:border-primary/30 transition-all shadow-inner">
                            <div className="p-4 space-y-3">
                              <a href={`/storage/${f.file_name}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-foreground/80 flex items-center gap-3 truncate hover:text-primary transition-colors">
                                <FileText className="h-5 w-5 text-primary shrink-0" />
                                <span className="truncate">{f.file_name_show}</span>
                              </a>
                              <div className="flex items-center justify-end gap-1 pt-3 border-t border-white/5">
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-400">
                                  <a href={`/storage/${f.file_name}`} download={f.file_name}><Download className="h-4 w-4" /></a>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-sky-400" onClick={() => { setEditFileId(f.id); setEditFileNameShow(f.file_name_show); setFileInput(null); setActiveModal('updateFile'); }}>
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => handleDeleteFile(f.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="p-6 rounded-full bg-white/5 border border-white/10">
                  <FileText className="h-16 w-16 text-muted-foreground opacity-20" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">No Document Active</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">Select a notebook from the library to start editing or viewing documentation.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Resource Management Dialogs */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {activeModal === 'create' && <><Plus className="h-5 w-5 text-primary" /> Create Resource</>}
              {activeModal === 'edit' && <><Edit2 className="h-5 w-5 text-primary" /> Rename Document</>}
              {activeModal === 'upload' && <><UploadCloud className="h-5 w-5 text-primary" /> Upload Asset</>}
              {activeModal === 'updateFile' && <><FileEdit className="h-5 w-5 text-primary" /> Replace Asset</>}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {(activeModal === 'create' || activeModal === 'edit') && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notebook Title</Label>
                <Input
                  className="h-11 bg-background border-white/10 text-foreground font-bold"
                  placeholder="e.g. Specification V1.2"
                  value={modalInputText}
                  onChange={e => setModalInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (activeModal === 'create' ? handleCreateResource() : handleEditResourceSave())}
                  autoFocus
                />
              </div>
            )}

            {(activeModal === 'upload' || activeModal === 'updateFile') && (
              <div className="space-y-4">
                {activeModal === 'updateFile' && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary truncate">
                    Replacing: {editFileNameShow}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pick Attachment</Label>
                  <Input
                    type="file"
                    onChange={e => setFileInput(e.target.files?.[0] || null)}
                    className="h-12 bg-background border-white/10 text-foreground file:bg-primary file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-3 file:font-bold file:text-xs cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setActiveModal(null)} className="text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (activeModal === 'create') handleCreateResource();
                else if (activeModal === 'edit') handleEditResourceSave();
                else if (activeModal === 'upload') handleUploadFile();
                else handleEditFile();
              }}
              disabled={isSaving || isUploading || ((activeModal === 'upload' || activeModal === 'updateFile') && !fileInput)}
              className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6"
            >
              {(isSaving || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {activeModal === 'upload' || activeModal === 'updateFile' ? 'Ship File' : 'Start Notebook'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{
        __html: `
        .quill-modern-container .ql-toolbar {
          border: none !important;
          border-bottom: 2px solid rgba(255,255,255,0.05) !important;
          padding: 16px 32px !important;
          background: rgba(18, 18, 18, 0.4) !important;
          backdrop-filter: blur(12px) !important;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .quill-modern-container .ql-container {
          border: none !important;
          font-family: inherit !important;
        }
        .quill-modern-container .ql-editor {
          padding: 40px !important;
          min-height: 480px;
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 16px !important;
          line-height: 1.8 !important;
        }
        .quill-modern-container .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.2) !important;
          left: 40px !important;
          font-style: normal !important;
        }
        .quill-modern-container .ql-stroke { stroke: rgba(255,255,255,0.5) !important; }
        .quill-modern-container .ql-fill { fill: rgba(255,255,255,0.5) !important; }
        .quill-modern-container .ql-picker { color: rgba(255,255,255,0.5) !important; }
        .quill-modern-container .ql-picker-options {
           background: #1a1a1a !important;
           border: 1px solid rgba(255,255,255,0.1) !important;
           border-radius: 8px !important;
           color: white !important;
        }
        .quill-modern-container .ql-toolbar button:hover .ql-stroke { stroke: #696cff !important; }
        .quill-modern-container .ql-toolbar button:hover .ql-fill { fill: #696cff !important; }
        .quill-modern-container .ql-toolbar button.ql-active .ql-stroke { stroke: #696cff !important; }
        .quill-modern-container .ql-toolbar button.ql-active .ql-fill { fill: #696cff !important; }
      `}} />
    </div>
  );
};

export default ProjectResourcesPage;
