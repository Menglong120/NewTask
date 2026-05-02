'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { ShieldCheck, Eye, EyeOff, KeyRound, Loader2, Lock, HelpCircle, X, Check, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PasswordDialog } from './dialog/dialog';

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
      Swal.fire({ icon: 'error', title: 'Mismatch', text: "Verification passwords do not match.", toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordRegex.test(formData.new_pass)) {
      Swal.fire({ icon: 'error', title: 'Complexity Weak', text: "Password must be at least 6 characters, including 1 uppercase letter and 1 number.", toast: true, position: 'top-end', timer: 4000, showConfirmButton: false });
      return;
    }

    try {
      setLoading(true);
      const res = await fetchApi('/api/profile/changepass', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if (res.result) {
        Swal.fire({ icon: "success", title: "Key updated successfully.", position: "top-end", toast: true, timer: 3000, showConfirmButton: false });
        setFormData({ old_pass: '', new_pass: '', renew_pass: '' });
      } else if (res.msg === 'Invalid Password') {
        Swal.fire({ icon: 'error', title: 'Validation error', text: "The current reference password provided is incorrect.", toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      }
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background border px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
             <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
             <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>Security</span>
              <X className="h-3 w-3 opacity-30" />
              <span className="text-foreground">Authentication Control</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Security Protocol</h1>
          </div>
        </div>
        <Badge variant="outline" className="h-8 px-3 font-semibold text-xs gap-2 border">
            <Lock className="h-3.5 w-3.5 text-primary" /> Active Encryption
        </Badge>
      </div>

      {/* Main Form */}
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="py-4 border-b bg-muted/20">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Rotation Interface</CardTitle>
          <CardDescription className="text-xs font-medium py-1 italic">Update your account authentication credentials regularly.</CardDescription>
        </CardHeader>

        <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }}>
          <CardContent className="p-8 space-y-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  Reference Password (Current)
                </Label>
                <div className="relative group max-w-lg">
                  <Input
                    type={showOldPass ? "text" : "password"}
                    name="old_pass"
                    value={formData.old_pass}
                    onChange={handleInputChange}
                    className="h-12 font-semibold pl-11 pr-12"
                    placeholder="Enter existing password"
                    required
                  />
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-primary hover:bg-transparent"
                  >
                    {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="h-px bg-border max-w-lg" />

              <div className="space-y-6 max-w-lg">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    New Security Key
                  </Label>
                  <div className="relative group">
                    <Input
                      type={showNewPass ? "text" : "password"}
                      name="new_pass"
                      value={formData.new_pass}
                      onChange={handleInputChange}
                      className="h-12 font-semibold pl-11 pr-12"
                      placeholder="Enter new complex key"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-primary hover:bg-transparent"
                    >
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    Verify Security Key
                  </Label>
                  <div className="relative group">
                    <Input
                      type={showConfPass ? "text" : "password"}
                      name="renew_pass"
                      value={formData.renew_pass}
                      onChange={handleInputChange}
                      className="h-12 font-semibold pl-11 pr-12"
                      placeholder="Confirm new complex key"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:text-primary transition-colors" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfPass(!showConfPass)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-primary hover:bg-transparent"
                    >
                      {showConfPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

               <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-start gap-4">
               <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
               <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">Verification required</p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/60 font-medium italic">Rotating your security key will invalidate all active sessions immediately except for the current terminal.</p>
               </div>
            </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0 flex flex-col sm:flex-row items-center justify-between gap-6">
             <Button
                variant="link"
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-bold opacity-60 hover:opacity-100 p-0 h-auto underline transition-opacity"
              >
                Request help from administrator?
              </Button>

            <Button
              type="submit"
              disabled={loading || !formData.old_pass || !formData.new_pass || !formData.renew_pass}
              className="min-w-[200px] font-bold h-12 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Rotate Security Key
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <PasswordDialog
        showForgotModal={showForgotModal}
        setShowForgotModal={setShowForgotModal}
      />

    </div>
  );
};

export default ChangePasswordPage;
