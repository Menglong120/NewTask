'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { ShieldCheck, Eye, EyeOff, KeyRound, Loader2, Lock, HelpCircle } from 'lucide-react';

const ChangePasswordPage = () => {
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    old_pass: '',
    new_pass: '',
    renew_pass: ''
  });

  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async () => {
    if (formData.new_pass !== formData.renew_pass) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Passwords don't match!", toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordRegex.test(formData.new_pass)) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: "Password must be at least 6 characters, containing at least 1 uppercase letter and 1 number.", toast: true, position: 'top-end', timer: 4000, showConfirmButton: false, background: '#121212', color: '#fff' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetchApi('/api/profile/changepass', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if (res.result) {
        Swal.fire({
            icon: "success",
            title: "Password changed successfully!",
            position: "top-end",
            toast: true,
            timer: 3000,
            showConfirmButton: false,
            background: '#121212',
            color: '#fff'
        });
        setFormData({ old_pass: '', new_pass: '', renew_pass: '' });
      } else if (res.msg === 'Invalid Password') {
        Swal.fire({ icon: 'error', title: 'Error', text: "The old password you entered is incorrect.", toast: true, position: 'top-end', timer: 3000, showConfirmButton: false, background: '#121212', color: '#fff' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex justify-between items-center bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10 w-full">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 ring-1 ring-white/10 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(105,108,255,0.3)] shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-1">Change Password</h1>
            <p className="text-sm text-white/50 font-medium tracking-wide">Ensure your account uses a long, random password to stay secure.</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 p-8 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

        <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }} className="space-y-6 relative z-10">
          
          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2 max-w-lg">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 pl-1">
                <KeyRound className="h-3 w-3" /> Current Password
              </label>
              <div className="relative group">
                <input 
                  type={showOldPass ? "text" : "password"} 
                  name="old_pass"
                  value={formData.old_pass}
                  onChange={handleInputChange}
                  className="w-full pl-5 pr-12 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner placeholder:text-white/20" 
                  placeholder="Enter current password" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowOldPass(!showOldPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-indigo-400 transition-colors p-1"
                >
                  {showOldPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="border-t border-white/5 my-8 max-w-lg"></div>

            {/* New Password */}
            <div className="space-y-2 max-w-lg pb-1">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 pl-1">
                <Lock className="h-3 w-3" /> New Password
              </label>
              <div className="relative">
                <input 
                  type={showNewPass ? "text" : "password"} 
                  name="new_pass"
                  value={formData.new_pass}
                  onChange={handleInputChange}
                  className="w-full pl-5 pr-12 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner placeholder:text-white/20" 
                  placeholder="Enter new password" 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-indigo-400 transition-colors p-1"
                >
                  {showNewPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2 max-w-lg">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2 pl-1">
                <Lock className="h-3 w-3" /> Confirm Password
              </label>
              <div className="relative">
                <input 
                  type={showConfPass ? "text" : "password"} 
                  name="renew_pass"
                  value={formData.renew_pass}
                  onChange={handleInputChange}
                  className="w-full pl-5 pr-12 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:bg-[#121212] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white outline-none shadow-inner placeholder:text-white/20" 
                  placeholder="Confirm new password" 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfPass(!showConfPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-indigo-400 transition-colors p-1"
                >
                  {showConfPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-block mt-3 px-1">
              Forgot password?
            </button>
          </div>
          
          <div className="pt-8">
            <button 
              type="submit" 
              disabled={loading || !formData.old_pass || !formData.new_pass || !formData.renew_pass} 
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all font-bold shadow-[0_0_15px_rgba(105,108,255,0.4)] border border-indigo-400/20 disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:shadow-none min-w-[200px] outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Updating Security...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-[#0a0a0a] flex flex-col items-center justify-center text-center relative border-b border-white/5">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mt-16 -mr-16"></div>
               <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center shadow-inner text-indigo-400 mb-5 ring-1 ring-indigo-500/20">
                 <HelpCircle className="h-10 w-10" />
               </div>
               <h3 className="text-2xl font-bold text-white">Forgot Password</h3>
            </div>
            <div className="p-8 text-center bg-[#121212]">
              <p className="text-white/60 font-medium">Please contact your system administrator to request a secure password reset link.</p>
            </div>
            <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex justify-center gap-3">
              <button 
                onClick={() => setShowForgotModal(false)}
                className="w-full bg-[#0a0a0a] border border-white/10 px-5 py-3 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-white/20 shadow-inner"
              >
                Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordPage;
