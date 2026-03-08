'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { ShieldCheck, Eye, EyeOff, KeyRound, Loader2, Lock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">

      {/* Header section */}
      <Card className="border-white/5 bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="p-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Security Settings</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">Manage your account password and security preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Form */}
      <Card className="border-white/5 bg-card relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

        <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }}>
          <CardContent className="p-8 space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2 max-w-lg">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5" /> Current Password
                </Label>
                <div className="relative group">
                  <Input
                    type={showOldPass ? "text" : "password"}
                    name="old_pass"
                    value={formData.old_pass}
                    onChange={handleInputChange}
                    className="h-12 bg-background border-white/10 text-foreground pr-11"
                    placeholder="Enter current password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-indigo-400"
                  >
                    {showOldPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="h-px bg-white/5 max-w-lg" />

              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" /> New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPass ? "text" : "password"}
                      name="new_pass"
                      value={formData.new_pass}
                      onChange={handleInputChange}
                      className="h-12 bg-background border-white/10 text-foreground pr-11"
                      placeholder="Enter new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-indigo-400"
                    >
                      {showNewPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" /> Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfPass ? "text" : "password"}
                      name="renew_pass"
                      value={formData.renew_pass}
                      onChange={handleInputChange}
                      className="h-12 bg-background border-white/10 text-foreground pr-11"
                      placeholder="Confirm new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfPass(!showConfPass)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-indigo-400"
                    >
                      {showConfPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="link"
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm font-bold text-primary hover:text-primary/80 p-0 h-auto"
              >
                Forgot your password?
              </Button>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0 border-t border-white/5 bg-white/[0.01]">
            <Button
              type="submit"
              disabled={loading || !formData.old_pass || !formData.new_pass || !formData.renew_pass}
              className="min-w-[180px] bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="bg-[#121212] border-white/10 text-foreground rounded-2xl dark max-w-md">
          <DialogHeader className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary ring-1 ring-primary/20">
                <HelpCircle className="h-10 w-10" />
              </div>
              <DialogTitle className="text-2xl font-bold">Forgot Password?</DialogTitle>
            </div>
          </DialogHeader>

          <div className="py-6 text-center text-muted-foreground font-medium">
            Contact your system administrator to reset your password or receive a recovery link.
          </div>

          <DialogFooter className="px-6 pb-6 pt-0">
            <Button
              onClick={() => setShowForgotModal(false)}
              className="w-full h-12 bg-background border-white/10 hover:bg-white/5 text-foreground font-bold rounded-xl"
            >
              Understood
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangePasswordPage;
