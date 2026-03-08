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
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
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

    if (id) fetchData();
  }, [id]);

  const handleCategoryClick = (categoryId: number) => {
    localStorage.setItem('categoryID', categoryId.toString());
    router.push(`/issues/category/${categoryId}`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* Header */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-bold">{projectName || 'Project'}</span>
            </div>
            <CardTitle className="text-2xl font-bold">Issue Categories</CardTitle>
            <CardDescription className="text-muted-foreground">Organize your project issues into logical categories</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-5 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-1.5" /> Add Category
          </Button>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48 border-white/5 bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group border-white/5 bg-card hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden relative hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-primary/5"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

              <CardHeader className="p-6 pb-2 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <LayoutGrid className="h-6 w-6" />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 dark w-40">
                      <DropdownMenuItem className="gap-2 cursor-pointer font-semibold">
                        <Edit2 className="h-3.5 w-3.5" /> Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer font-semibold text-red-400 focus:text-red-400 focus:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" /> Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{category.name}</CardTitle>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] leading-relaxed">
                  {category.description || 'Define specific workflows and task types for this category area.'}
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 opacity-50" />
                    <span>Created {new Date(category.created_on).toLocaleDateString()}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}

          {categories.length === 0 && (
            <Card className="col-span-full border-dashed border-white/10 bg-transparent py-20">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                  <FolderOpen className="h-12 w-12 text-muted-foreground opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">No categories found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">There are no categories set up for this project yet.</p>
                </div>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-primary font-bold">
                  <Plus className="h-4 w-4 mr-1.5" /> Create first category
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCategoriesPage;
