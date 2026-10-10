'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { PasswordForm } from '@/components/settings/PasswordForm';
import { DataExportSection } from '@/components/settings/DataExportSection';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Account & Workspace Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal profile, credentials, and data exports.
        </p>
      </div>

      {/* Profile Form */}
      <ProfileForm user={user} />

      {/* Password Update Form */}
      <PasswordForm />

      {/* Data Export & Backup */}
      <DataExportSection />
    </div>
  );
}
