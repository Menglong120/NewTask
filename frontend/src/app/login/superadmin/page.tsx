'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

const SuperAdminLoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const res = await fetchApi('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.result) {
        router.push('/');
      } else {
        setError(res.msg || 'Invalid credentials');
      }
    } catch (err: any) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#696cff] to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#696cff]/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#696cff]/5 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 bg-white rounded-3xl shadow-2xl shadow-[#696cff]/20 flex items-center justify-center p-4 border border-gray-100 group hover:scale-110 transition-transform cursor-pointer" onClick={() => router.push('/')}>
            <img src="/img/Logo NSM Tech.V2-Confirm.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
          Superadmin <span className="text-[#696cff]">Access</span>
        </h2>
        <p className="mt-2 text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
          NSM Task Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-black/5 rounded-[2.5rem] border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Username
              </label>
              <div className="relative">
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter admin username"
                  className="appearance-none block w-full px-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#696cff]/30 focus:outline-none focus:ring-4 focus:ring-[#696cff]/5 transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter secret password"
                  className="appearance-none block w-full px-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#696cff]/30 focus:outline-none focus:ring-4 focus:ring-[#696cff]/5 transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#696cff] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#696cff] focus:ring-[#696cff] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                  Remember this device
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-[#696cff]/30 text-sm font-bold text-white bg-[#696cff] hover:bg-[#5f61e6] focus:outline-none focus:ring-4 focus:ring-[#696cff]/20 active:scale-95 transition-all disabled:opacity-70 disabled:grayscale"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
