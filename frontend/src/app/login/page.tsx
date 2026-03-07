'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

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
      // First try normal login
      let response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      let data = await response.json();

      // If normal login fails because user is superadmin (401), try superadmin login
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
        // If it's a validation error (400), show the specific error messages
        if (response.status === 400 && data.data) {
          const validationErrors = Object.values(data.data).join(' ');
          setError(validationErrors || data.msg);
        } else {
          setError(data.msg || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError('Connection failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f9] p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="relative mb-6 h-16 w-48">
            <Image 
              src="/img/Logo NSM Tech.V2-Confirm.png" 
              alt="NSM Tech Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome to NSM! 👋</h2>
          <p className="mt-2 text-sm text-gray-500">Please sign-in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#696cff] focus:outline-none focus:ring-1 focus:ring-[#696cff]"
                placeholder="Enter your username"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-[#696cff] focus:outline-none focus:ring-1 focus:ring-[#696cff]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#696cff] focus:ring-[#696cff]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember Me
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-[#696cff] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#5f61e6] focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
