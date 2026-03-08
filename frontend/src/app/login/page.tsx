'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm relative z-10">
        <CardHeader className="flex flex-col items-center pb-2 pt-8 px-8 gap-3">
          <div className="relative h-14 w-44">
            <Image
              src="/img/Logo NSM Tech.V2-Confirm.png"
              alt="NSM Tech Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to NSM! 👋</h1>
            <p className="text-sm text-muted-foreground">Please sign-in to your account</p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-11 border-gray-200 focus-visible:ring-primary/30 focus-visible:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-11 border-gray-200 focus-visible:ring-primary/30 focus-visible:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded-sm border-gray-300 accent-primary cursor-pointer"
              />
              <Label htmlFor="remember-me" className="text-sm font-medium text-gray-600 cursor-pointer">
                Remember Me
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
