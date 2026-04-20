'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import {
  LayoutGrid,
  Plus,
  MoreVertical,
  Settings,
  Trash2,
  ChevronRight,
  FolderOpen,
  Loader2,
  Edit2,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: number;
  name: string;
  description: string;
  created_on: string;
}

const ProjectCategoriesPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, categoryRes] = await Promise.all([
        fetchApi(`/api/projects`),
        fetchApi(`/api/categories/${id}`)
      ]);

      if (projectRes.result) {
        const project = projectRes.data.datas.find((p: any) => p.id === Number(id));
        if (project) setProjectName(project.name);
      }

      if (categoryRes.result) {
        setCategories(categoryRes.data?.categories || categoryRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleOpenCreate = () => {
    setFormName('');
    setFormDescription('');
    setActiveModal('create');
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormName(category.name);
    setFormDescription(category.description);
    setActiveModal('edit');
  };

  const handleSubmit = async () => {
    if (!formName) return;
    try {
      setSubmitting(true);
      const url = activeModal === 'create' ? `/api/category/${id}` : `/api/category-update/${selectedCategory?.id}`;
      const method = activeModal === 'create' ? 'POST' : 'PUT';

      const res = await fetchApi(url, {
        method,
        body: JSON.stringify({ name: formName, description: formDescription })
      });

      if (res.result) {
        setActiveModal(null);
        fetchData();
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetchApi(`/api/category/${categoryId}`, { method: 'DELETE' });
      if (res.result) fetchData();
    } catch (error) { }
  };

  const handleCategoryClick = (categoryId: number) => {
    localStorage.setItem('categoryID', categoryId.toString());
    router.push(`/issues/category/${categoryId}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground/60">{projectName || 'Current Project'}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Categories</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground normal-case">Issue Categories</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${id}/settings`)} className="gap-2 h-9 border">
            <Settings className="h-4 w-4" /> Configure
          </Button>
          <Button onClick={handleOpenCreate} size="sm" className="gap-2 h-9 shadow-sm">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="h-48 border shadow-sm animate-pulse bg-muted/20" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/10 py-24 rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-background border shadow-sm">
                <FolderOpen className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">No categories found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">Group your project issues into categories to keep work organized.</p>
              </div>
              <Button onClick={handleOpenCreate} size="sm" variant="outline" className="gap-2 mt-2">
                <Plus className="h-4 w-4" /> Initial category
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group flex flex-col border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader className="p-5 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <LayoutGrid className="h-4 w-4" />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenEdit(category); }} className="gap-2">
                          <Edit2 className="h-3.5 w-3.5" /> Modify
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }} className="text-destructive focus:text-destructive gap-2">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg font-bold truncate">{category.name}</CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-6">
                    {category.description || 'No description provided for this cluster.'}
                  </p>

                  <div className="pt-4 border-t flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 opacity-60" />
                      {new Date(category.created_on).toLocaleDateString()}
                    </div>
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <LayoutGrid className="h-5 w-5" />
              </div>
              {activeModal === 'create' ? 'Add New Category' : 'Edit Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Development, Operations..."
                className="h-10 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Provide details about this cluster..."
                className="min-h-[120px] font-medium resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : activeModal === 'create' ? 'Create Cluster' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectCategoriesPage;