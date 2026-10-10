'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  LayoutDashboard,
  FolderGit2,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export interface SidebarProps {
  onQuickAdd?: () => void;
}

export function Sidebar({ onQuickAdd }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', href: '/applications', icon: FolderGit2 },
    { name: 'Interview Calendar', href: '/interviews', icon: CalendarDays },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 sticky top-0 h-screen text-slate-300 select-none">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-1 py-1 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Apply<span className="text-indigo-400">Track</span>
          </span>
        </Link>

        {/* Quick Add Action Button */}
        {onQuickAdd && (
          <button
            onClick={onQuickAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        )}

        {/* Navigation items */}
        <nav className="space-y-1.5 pt-1">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Workspace</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-indigo-400' : 'text-slate-400')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile section */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-inner">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Candidate'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.targetRole || 'SWE Intern'}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
