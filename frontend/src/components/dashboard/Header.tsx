'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Plus,
  User as UserIcon,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/auth-context';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onQuickAdd?: () => void;
  onMobileMenuToggle?: () => void;
}

export function Header({ title, subtitle, onQuickAdd, onMobileMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 sm:px-8 py-4 flex items-center justify-between shadow-subtle">
      {/* Left: Mobile Toggle & Page Titles */}
      <div className="flex items-center gap-4">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-3.5">
        {onQuickAdd && (
          <Button
            size="sm"
            onClick={onQuickAdd}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-sm shadow-indigo-600/10 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2"
          >
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                <span className="text-sm font-bold text-slate-900">Notifications & Reminders</span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <p className="font-bold text-slate-900">Technical Interview Round</p>
                  <p className="text-slate-500">Google coding screen scheduled in 3 days</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <p className="font-bold text-slate-900">Amazon Offer Received</p>
                  <p className="text-slate-500">Review total compensation package details</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm shadow-indigo-600/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-sm font-semibold text-slate-800 hidden lg:inline">
              {user?.name || 'Account'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>

              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
