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
    <div className="flex min-h-screen items-center justify-center bg-[#070708] p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Tactical Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Circular scanning effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmax] h-[100vmax] border-[0.5px] border-indigo-500/5 rounded-full opacity-20 scale-[0.1] animate-[ping_8s_infinite] pointer-events-none"></div>
        
        <div className="absolute -top-[5%] -right-[10%] w-[45%] h-[45%] bg-indigo-900/20 rounded-full blur-[140px] animate-pulse transition-all duration-[12s]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-500 transition-all duration-[15s]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out-expo">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mb-8">
          <div className="h-16 w-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl shadow-indigo-500/10 group hover:scale-110 transition-transform cursor-pointer" onClick={() => router.push('/')}>
            <img src="/img/Logo NSM Tech.V2-Confirm.png" alt="Logo" className="w-9 h-9 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          
          <div className="px-10 pt-16 pb-6 text-center space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-3">
              <ShieldCheck className="h-7 w-7 text-indigo-400 animate-pulse" />
              <span>Vault <span className="text-indigo-400">Admin</span></span>
            </h2>
            <p className="text-[10px] font-black text-indigo-400/50 uppercase tracking-[0.4em]">Elevated Authorization Required</p>
          </div>

          <div className="px-10 pb-12">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Operator Identity
                </label>
                <div className="relative group">
                  <input
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter admin credential"
                    className="w-full h-14 bg-white/[0.03] border-white/[0.05] rounded-2xl border focus:border-indigo-500/30 focus:bg-indigo-500/5 outline-none px-6 text-sm font-bold text-white placeholder:text-white/10 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Security Protocol
                </label>
                <div className="relative group">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter secret key"
                    className="w-full h-14 bg-white/[0.03] border-white/[0.05] rounded-2xl border focus:border-indigo-500/30 focus:bg-indigo-500/5 outline-none px-6 text-sm font-bold text-white placeholder:text-white/10 transition-all duration-300 pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/20 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-wider animate-in fade-in zoom-in-95">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => {
                   const checkbox = document.getElementById('remember-me') as HTMLInputElement;
                   if (checkbox) {
                     checkbox.checked = !checkbox.checked;
                     setFormData(prev => ({ ...prev, remember: checkbox.checked }));
                   }
                }}>
                  <input
                    id="remember-me"
                    name="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded-md border-white/10 bg-white/5 accent-indigo-500 cursor-pointer transition-all focus:ring-0 checked:bg-indigo-500"
                  />
                  <label htmlFor="remember-me" className="text-[10px] font-black text-white/30 uppercase tracking-widest cursor-pointer group-hover:text-white/60 transition-colors">
                    Preserve Access Link
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-3 h-14 rounded-2xl shadow-2xl shadow-indigo-500/20 text-xs font-black uppercase tracking-[0.2em] text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                  {loading ? 'Validating Payload...' : 'Authorize Access'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center py-6 bg-white/[0.02] border-t border-white/5">
            <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">
              Authorized Personnel Restricted Environment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
