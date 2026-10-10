'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { AddEditApplicationModal } from '@/components/applications/AddEditApplicationModal';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading your workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getPageMeta = () => {
    if (pathname.startsWith('/applications')) {
      return { title: 'My Applications', subtitle: 'Manage, filter, and track status transitions across hiring loops' };
    }
    if (pathname.startsWith('/interviews')) {
      return { title: 'Interview Calendar & Agenda', subtitle: 'Prepare for technical loops, system design, and behavioral rounds' };
    }
    if (pathname.startsWith('/analytics')) {
      return { title: 'Application Analytics', subtitle: 'Conversion funnels, velocity trends, and recruitment KPIs' };
    }
    if (pathname.startsWith('/settings')) {
      return { title: 'Account Settings', subtitle: 'Manage profile, security credentials, and workspace data export' };
    }
    return { title: 'Recruitment Overview', subtitle: 'Real-time pipeline performance and upcoming schedule' };
  };

  const meta = getPageMeta();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar (Fixed 256px width) */}
      <div className="hidden md:block flex-shrink-0 w-64">
        <Sidebar onQuickAdd={() => setIsQuickAddOpen(true)} />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-950 z-10 shadow-2xl">
            <Sidebar onQuickAdd={() => {
              setMobileMenuOpen(false);
              setIsQuickAddOpen(true);
            }} />
          </div>
        </div>
      )}

      {/* Flexible Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 w-full px-6 py-6 md:px-8 md:py-8 space-y-8">
          {children}
        </main>
      </div>

      {/* Global Quick Add Application Modal */}
      <AddEditApplicationModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSaved={() => {
          window.dispatchEvent(new CustomEvent('applytrack:refresh'));
        }}
      />
    </div>
  );
}
