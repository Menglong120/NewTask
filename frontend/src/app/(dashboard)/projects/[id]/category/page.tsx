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
  FolderOpen
} from 'lucide-react';

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
          fetchApi(`/api/projects`), // To find project name
          fetchApi(`/api/categories/${id}`)
        ]);

        if (projectRes.result) {
          const project = projectRes.data.datas.find((p: any) => p.id === Number(id));
          if (project) setProjectName(project.name);
        }

        if (categoryRes.result) {
          setCategories(categoryRes.data);
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
    // Optionally set in localStorage to remain compatible with legacy functions if needed
    localStorage.setItem('categoryID', categoryId.toString());
    router.push(`/issues/category/${categoryId}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden gap-4">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-widest pl-1">
            <span className="hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => router.push('/projects')}>Projects</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70 font-bold">{projectName}</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Issue Categories</h1>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all font-bold shadow-[0_4px_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 w-full md:w-auto relative z-10 outline-none focus:ring-2 focus:ring-indigo-500 hover:-translate-y-0.5">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/5 animate-pulse rounded-[1.5rem] border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              onClick={() => handleCategoryClick(category.id)}
              className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mt-16 -mr-16"></div>
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transform transition-transform ring-1 ring-indigo-500/20 shadow-inner">
                  <LayoutGrid className="h-6 w-6" />
                </div>
                <button className="text-white/30 hover:text-white/70 transition-colors outline-none" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors relative z-10">
                {category.name}
              </h3>
              <p className="text-[15px] font-medium text-white/50 mt-2 line-clamp-2 relative z-10 h-11">
                {category.description || 'No description provided.'}
              </p>
              <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-widest relative z-10">
                <span>Created {new Date(category.created_on).toLocaleDateString()}</span>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-white/30 bg-[#121212]/80 backdrop-blur-xl border border-dashed border-white/10 rounded-[2rem] relative overflow-hidden shadow-inner">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <FolderOpen className="h-16 w-16 opacity-30 mb-5 relative z-10 text-indigo-400" />
              <p className="text-xl font-bold text-white relative z-10">No categories found for this project</p>
              <button className="mt-4 text-indigo-400 text-sm font-bold flex items-center gap-1.5 hover:text-indigo-300 transition-colors relative z-10 bg-indigo-500/10 px-4 py-2 rounded-lg">
                <Plus className="h-4 w-4" />
                Create your first category
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCategoriesPage;
