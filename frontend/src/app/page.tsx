'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, LayoutDashboard, Target, Users, Zap, CheckCircle2, ShieldCheck, AreaChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f9] text-gray-900 font-sans selection:bg-primary/30 selection:text-primary">

      {/* Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-32">
              <Image
                src="/img/Logo NSM Tech.V2-Confirm.png"
                alt="NSM Tech Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-gray-700 hover:text-primary font-bold">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 px-6">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6 text-center">
        {/* Abstract Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-primary/20 to-purple-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px] -z-10" />

        <div className="max-w-4xl mx-auto z-10 relative">
          <Badge variant="outline" className="mb-6 px-3 py-1.5 border-primary/20 text-primary bg-white shadow-sm font-bold gap-2 rounded-full animate-in slide-in-from-bottom-5 fade-in duration-500">
            <Zap className="h-4 w-4" fill="currentColor" />
            <span>The new standard for team productivity</span>
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1] animate-in slide-in-from-bottom-8 fade-in duration-700">
            Manage your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">projects</span> with extreme clarity.
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-10 fade-in duration-1000">
            Empower your team with our comprehensive task management system. Track progress, manage resources, and collaborate seamlessly in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-150">
            <Button asChild size="lg" className="h-14 px-8 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 w-full sm:w-auto group">
              <Link href="/login" className="flex items-center gap-2">
                Start Managing Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 bg-white text-gray-700 border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm w-full sm:w-auto">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-white p-4 shadow-2xl border border-gray-100/50 backdrop-blur-xl animate-in zoom-in-95 duration-1000 delay-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-[2.5rem] -z-10" />
          <div className="rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 aspect-[16/9] relative flex items-center justify-center">
            {/* Abstract Representation of Dashboard */}
            <div className="absolute inset-0 bg-[#f8f9fa] flex">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-200 bg-white p-6 hidden md:block">
                <div className="h-8 w-32 bg-gray-200 rounded-lg mb-8" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-full bg-gray-50 rounded-xl" />)}
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
                    <div className="h-4 w-64 bg-gray-100 rounded-md" />
                  </div>
                  <div className="h-10 w-32 bg-primary/20 rounded-xl" />
                </div>
                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
                      <div className="h-10 w-10 bg-indigo-50 rounded-xl" />
                      <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                    </div>
                  ))}
                </div>
                {/* Graph & List */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 h-64 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="h-full w-full bg-gray-50 rounded-xl" />
                  </div>
                  <div className="col-span-1 border border-gray-100 bg-white rounded-2xl shadow-sm p-5 space-y-4">
                    <div className="h-6 w-32 bg-gray-100 rounded-lg mb-4" />
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-12 w-full bg-gray-50 rounded-xl" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Everything you need to ship faster</h2>
            <p className="text-gray-500 text-lg">Powerful features wrapped in a beautiful, intuitive interface designed to keep your team focused and aligned.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#f8f9fc] p-8 rounded-3xl border border-gray-100 hover:border-primary/30 transition-colors group">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intuitive Dashboard</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Get a bird's-eye view of all your projects, recent activities, and pending approvals in a sleek, glassmorphic interface.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f8f9fc] p-8 rounded-3xl border border-gray-100 hover:border-purple-500/30 transition-colors group">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Issue Tracking</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Create, assign, and track issues seamlessly. Configure custom statuses, priorities, and workflow categories.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f8f9fc] p-8 rounded-3xl border border-gray-100 hover:border-emerald-500/30 transition-colors group">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AreaChart className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deep Analytics</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Visualize project progress, issue distribution, and team performance with interactive, real-time charts.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#f8f9fc] p-8 rounded-3xl border border-gray-100 hover:border-blue-500/30 transition-colors group">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Management</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Manage user identities globally. Assign specific members to projects and control access securely.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#f8f9fc] p-8 rounded-3xl border border-gray-100 hover:border-orange-500/30 transition-colors group">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Differentiated experiences for Superadmins, Admins, and Standard Users. Absolute control over system integrity.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#f8f9fc] p-8 rounded-3xl border border-gray-100 hover:border-pink-500/30 transition-colors group">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Approval Workflows</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Built-in notification center and request management for streamlined administrative approvals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-40" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-30" />

          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to transform your workflow?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join your team on NSM Task Management System today and start delivering projects faster than ever.</p>

            <Button asChild size="lg" className="h-16 px-10 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/30 ring-4 ring-primary/20">
              <Link href="/login">Log In to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-20">
              <Image
                src="/img/Logo NSM Tech.V2-Confirm.png"
                alt="NSM Tech Logo"
                fill
                className="object-contain grayscale opacity-50"
                priority
              />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">© {new Date().getFullYear()} NSM Tech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
