'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = { dis_name: username, password, rememberMe: 1 };

    try {
      let response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      let data = await response.json();

      if (response.status === 401 && data.msg === 'Login Failed.') {
        response = await fetch(`${API_BASE_URL}/api/superadmin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        data = await response.json();
      }

      if (response.ok) {
        router.push('/');
      } else {
        if (response.status === 400 && data.data) {
          const validationErrors = Object.values(data.data).join(' ');
          setError(validationErrors || data.msg);
        } else {
          setError(data.msg || 'Invalid credentials');
        }
      }
    } catch {
      setError('Connection failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b] p-4 relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse transition-all duration-[10s]" />
        <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700 transition-all duration-[12s]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-blue-600/15 rounded-full blur-[110px] animate-pulse delay-1000 transition-all duration-[8s]" />
        
        {/* Fine grid overlay for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-1000 ease-out-expo">
        <Card className="border-white/5 bg-black/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden rounded-[2rem]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <CardHeader className="flex flex-col items-center pb-2 pt-12 px-10 gap-6">
            <div className="relative h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center p-3 border border-white/10 shadow-inner group hover:scale-105 transition-transform duration-500">
               <Image
                src="/img/Logo NSM Tech.V2-Confirm.png"
                alt="NSM Tech Logo"
                fill
                className="object-contain p-2.5 drop-shadow-2xl"
                priority
              />
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                Nexus <span className="text-primary italic">Portal</span>
              </h1>
              <div className="h-0.5 w-12 bg-primary/40 mx-auto rounded-full"></div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] pt-1">Authorize Session</p>
            </div>
          </CardHeader>

          <CardContent className="px-10 pb-12 pt-6">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs font-bold text-destructive flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping"></div>
                  {error}
                </div>
              )}

              <div className="space-y-2.5">
                <Label htmlFor="username" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                  Identity Key
                </Label>
                <div className="relative group">
                  <Input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username or Email"
                    className="h-12 bg-white/5 border-white/5 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all duration-300 text-white placeholder:text-white/20 font-medium px-5"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                  Security Code
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-12 bg-white/5 border-white/5 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all duration-300 text-white placeholder:text-white/20 font-medium px-5 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => {
                   const checkbox = document.getElementById('remember-me') as HTMLInputElement;
                   if (checkbox) checkbox.checked = !checkbox.checked;
                }}>
                  <div className="relative h-4 w-4 flex items-center justify-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="peer h-4 w-4 rounded-md border-white/10 bg-white/5 accent-primary cursor-pointer transition-all focus:ring-0 checked:bg-primary"
                    />
                  </div>
                  <Label htmlFor="remember-me" className="text-[11px] font-bold text-white/40 uppercase tracking-wider cursor-pointer group-hover:text-white/60 transition-colors">
                    Preserve Link
                  </Label>
                </div>
                
                <button type="button" className="text-[11px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-wider">
                  Forgot?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 group relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Synchronizing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Initialize Access</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          
          <div className="px-10 py-6 bg-white/[0.02] border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
              © 2026 NSM Tech. Secure Management Environment.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
