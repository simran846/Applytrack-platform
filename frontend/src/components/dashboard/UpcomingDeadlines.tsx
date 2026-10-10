import React from 'react';
import Link from 'next/link';
import { Application } from '@/types';
import { AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface UpcomingDeadlinesProps {
  deadlines: Application[];
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  if (!deadlines || deadlines.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
        <h4 className="text-xs font-bold text-slate-700">No Approaching Deadlines</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">All applications and OA timelines are clear.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deadlines.map((app) => (
        <div
          key={app.id}
          className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-subtle hover:border-indigo-200 transition-all card-hover flex items-center justify-between gap-3"
        >
          <div className="space-y-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{app.companyName}</h4>
            <p className="text-[11px] text-slate-500 truncate">{app.jobTitle}</p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>Due: {formatDate(app.applicationDeadline)}</span>
            </div>
          </div>

          {app.jobPostingUrl && (
            <a
              href={app.jobPostingUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ))}

      <div className="pt-2 text-right">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <span>Manage Deadlines</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
