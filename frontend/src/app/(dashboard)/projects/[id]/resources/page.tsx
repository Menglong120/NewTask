'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import {
  Plus, Edit2, Trash2, FolderOpen, FileText, Download,
  UploadCloud, Save, Folder, AppWindow, Loader2, X, FileEdit, ChevronRight,
  File, NotebookTabs, History
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
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-64 rounded-xl border"></div>
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
  const router = useRouter();

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
      Swal.fire({ icon: "error", title: "Target title is missing.", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
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
        Swal.fire({ icon: "success", title: "Note saved successfully.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
      }
    } catch (error) { } finally {
      setIsSaving(false);
    }
  };

  const handleCreateResource = async () => {
    if (!modalInputText.trim()) return Swal.fire({ icon: "error", title: "Title is required", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    setIsSaving(true);
    try {
      const res = await fetchApi(`/api/projects/resource/${id}`, { method: 'POST', body: JSON.stringify({ title: modalInputText }) });
      if (res.result) {
        fetchData();
        setModalInputText('');
        setActiveModal(null);
        Swal.fire({ icon: "success", title: "Resource created.", position: "top-end", toast: true, timer: 2000, showConfirmButton: false });
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
        Swal.fire({ icon: "success", title: "Resource renamed.", position: "top-end", toast: true, timer: 2000, showConfirmButton: false });
      }
    } catch (err) { } finally { setIsSaving(false); }
  };

  const handleDeleteResource = async (resId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Delete resource?",
      text: "Permanent action. All associated notes and file links will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await fetchApi(`/api/projects/resource/${resId}`, { method: 'DELETE' });
        fetchData();
        if (selectedResource && selectedResource.id === resId) setSelectedResource(null);
        Swal.fire({ title: "Deleted", icon: "success", timer: 2000, showConfirmButton: false });
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
        Swal.fire({ icon: "success", title: "File uploaded.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
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
        Swal.fire({ icon: "success", title: "File replaced.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
        setActiveModal(null);
        setFileInput(null);
        if (selectedResource) fetchFiles(selectedResource.id);
      }
    } catch (err) { } finally { setIsUploading(false); }
  };

  const handleDeleteFile = async (fId: number) => {
    const result = await Swal.fire({
      title: "Remove file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove",
    });
    if (result.isConfirmed) {
      try {
        await fetchApi(`/api/projects/resources/file/${fId}`, { method: 'DELETE' });
        if (selectedResource) fetchFiles(selectedResource.id);
        Swal.fire({ title: "Removed", icon: "success", timer: 2000, showConfirmButton: false });
      } catch (err) { }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-[1600px] mx-auto gap-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <NotebookTabs className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{projectName || 'Project Resources'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Project Resources</h1>
          </div>
        </div>
        <Button onClick={() => { setActiveModal('create'); setModalInputText(''); }} className="font-semibold px-6 shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Add Resource Item
        </Button>
      </div>

      {loading && resources.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing project library...</p>
        </div>
      ) : resources.length === 0 ? (
        <Card className="flex-1 border-dashed bg-muted/20 flex flex-col items-center justify-center text-center p-12">
          <div className="p-6 rounded-full bg-background mb-6 border shadow-sm">
            <FolderOpen className="w-12 h-12 text-muted-foreground opacity-30" />
          </div>
          <h3 className="text-xl font-bold mb-2">Build your Knowledge Base</h3>
          <p className="text-muted-foreground max-w-sm mb-8 text-sm">Centralize notes, specifications, and files for consistent team collaboration.</p>
          <Button onClick={() => { setActiveModal('create'); setModalInputText(''); }} size="lg" className="px-8 shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> Create First Resource
          </Button>
        </Card>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

          {/* Sidebar */}
          <Card className="w-full lg:w-80 flex flex-col shrink-0 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2">
              <AppWindow className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resources</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-1">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectResource(res)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all border group flex items-center justify-between",
                      selectedResource?.id === res.id
                        ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
                        : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className={cn("h-4 w-4 shrink-0", selectedResource?.id === res.id ? "text-primary" : "opacity-40")} />
                      <span className="text-sm font-semibold truncate">{res.title}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={(e) => { e.stopPropagation(); setSelectedResource(res); setModalInputText(res.title); setActiveModal('edit'); }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
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

          {/* Editor Area */}
          <Card className="flex-1 flex flex-col overflow-hidden shadow-sm">
            {selectedResource ? (
              <>
                <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/10 shrink-0 gap-4">
                  <Input
                    className="text-xl font-bold border-none shadow-none focus-visible:ring-0 h-10 px-0 bg-transparent flex-1"
                    placeholder="Document Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <Button
                    onClick={handleSaveNote} disabled={isSaving}
                    className="font-bold shadow-sm h-9 px-4 shrink-0"
                  >
                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Save className="h-3.5 w-3.5 mr-2" />}
                    Save changes
                  </Button>
                </div>

                <ScrollArea className="flex-1">
                  <div className="quill-modern-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={note}
                      onChange={setNote}
                      className="border-none"
                      modules={{ toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image', 'code-block'], ['clean']] }}
                    />
                  </div>

                  <div className="border-t bg-muted/5 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                        <Folder className="h-4 w-4 text-primary" /> Attached Assets ({files.length})
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setFileInput(null); setActiveModal('upload'); }}
                        className="h-8 font-semibold shadow-none"
                      >
                        <Plus className="h-3.5 w-3.5 mr-2" /> Upload File
                      </Button>
                    </div>

                    {files.length === 0 ? (
                      <div className="p-8 border-dashed border-2 rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm font-medium bg-background/50">
                        <UploadCloud className="h-8 w-8 mb-2 opacity-20" />
                        No files attached to this resource.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {files.map(f => (
                          <div key={f.id} className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-all shadow-sm group">
                            <div className="flex items-center gap-3 mb-4 min-w-0">
                              <div className="p-2 bg-primary/5 rounded-lg">
                                <File className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-bold truncate pr-2">{f.file_name_show}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1.5 pt-3 border-t">
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <a href={`/storage/${f.file_name}`} download={f.file_name}><Download className="h-4 w-4" /></a>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => { setEditFileId(f.id); setEditFileNameShow(f.file_name_show); setFileInput(null); setActiveModal('updateFile'); }}>
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteFile(f.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="p-6 rounded-full bg-muted/50 border">
                  <FileText className="h-12 w-12 text-muted-foreground opacity-30" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Select a resource</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">Choose an item from the library to start editing documentation.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Modals */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               <div className="p-2 bg-primary/10 rounded-lg text-primary mr-2">
                  {activeModal === 'create' && <Plus className="h-5 w-5" />}
                  {activeModal === 'edit' && <Edit2 className="h-5 w-5" />}
                  {(activeModal === 'upload' || activeModal === 'updateFile') && <UploadCloud className="h-5 w-5" />}
               </div>
               {activeModal === 'create' && "New Resource"}
               {activeModal === 'edit' && "Rename Resource"}
               {activeModal === 'upload' && "Upload Asset"}
               {activeModal === 'updateFile' && "Replace Asset Content"}
            </DialogTitle>
          </DialogHeader>
 
          <div className="py-4 space-y-4">
            {(activeModal === 'create' || activeModal === 'edit') && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resource Title</Label>
                <Input
                  className="h-10 font-semibold"
                  placeholder="e.g. Technical Specifications V1"
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
                  <div className="p-3 bg-muted rounded-lg border text-xs font-semibold text-muted-foreground italic flex items-center gap-2">
                    <History className="h-3.5 w-3.5" /> Replaces: {editFileNameShow}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select File</Label>
                  <Input
                    type="file"
                    onChange={e => setFileInput(e.target.files?.[0] || null)}
                    className="h-10 cursor-pointer text-xs pt-1.5"
                  />
                  <p className="text-[10px] text-muted-foreground/60 italic px-1 pt-1">Standard file formats supported.</p>
                </div>
              </div>
            )}
          </div>
 
          <DialogFooter className="gap-2">
            <DialogClose asChild>
               <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (activeModal === 'create') handleCreateResource();
                else if (activeModal === 'edit') handleEditResourceSave();
                else if (activeModal === 'upload') handleUploadFile();
                else handleEditFile();
              }}
              disabled={isSaving || isUploading || ((activeModal === 'upload' || activeModal === 'updateFile') && !fileInput)}
              className="px-8 font-bold"
            >
              {(isSaving || isUploading) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {activeModal === 'upload' || activeModal === 'updateFile' ? 'Upload file' : 'Save resource'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{
        __html: `
        .quill-modern-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          padding: 12px 24px !important;
          background: var(--muted) / 0.1 !important;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .quill-modern-wrapper .ql-container {
          border: none !important;
          font-family: inherit !important;
        }
        .quill-modern-wrapper .ql-editor {
          padding: 32px !important;
          min-height: 400px;
          color: var(--foreground) !important;
          font-size: 15px !important;
          line-height: 1.7 !important;
        }
        .quill-modern-wrapper .ql-editor.ql-blank::before {
          color: var(--muted-foreground) !important;
          left: 32px !important;
          font-style: italic !important;
          opacity: 0.5;
        }
        .quill-modern-wrapper .ql-stroke { stroke: currentColor !important; opacity: 0.7; }
        .quill-modern-wrapper .ql-fill { fill: currentColor !important; opacity: 0.7; }
        .quill-modern-wrapper .ql-picker { color: currentColor !important; opacity: 0.7; }
        .quill-modern-wrapper .ql-picker-options {
           background: var(--popover) !important;
           border: 1px solid var(--border) !important;
           border-radius: 8px !important;
           box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .quill-modern-wrapper button:hover .ql-stroke { stroke: var(--primary) !important; opacity: 1; }
        .quill-modern-wrapper button:hover .ql-fill { fill: var(--primary) !important; opacity: 1; }
        .quill-modern-wrapper button.ql-active .ql-stroke { stroke: var(--primary) !important; opacity: 1; }
      `}} />
    </div>
  );
};

export default ProjectResourcesPage;
