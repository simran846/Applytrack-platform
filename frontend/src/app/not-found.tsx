import React from 'react';
import Link from 'next/link';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
        <Briefcase className="w-6 h-6" />
      </div>
      <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-3">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Return to your recruitment dashboard or landing page.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline">
            Landing Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
