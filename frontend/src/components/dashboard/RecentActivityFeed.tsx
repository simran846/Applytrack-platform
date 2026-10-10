import React from 'react';
import { ActivityLog } from '@/types';
import { formatDateTime } from '@/lib/utils';
import {
  PlusCircle,
  RefreshCw,
  Trash2,
  CalendarCheck2,
  Activity
} from 'lucide-react';

export interface RecentActivityFeedProps {
  activities: ActivityLog[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
        <h4 className="text-xs font-bold text-slate-700">No Activity Logged Yet</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">Actions, status changes, and interview updates will appear here.</p>
      </div>
    );
  }

  const getIcon = (actionType: string) => {
    switch (actionType) {
      case 'APPLICATION_CREATED':
        return <PlusCircle className="w-4 h-4 text-indigo-600" />;
      case 'STATUS_UPDATED':
        return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'INTERVIEW_SCHEDULED':
        return <CalendarCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'APPLICATION_DELETED':
        return <Trash2 className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((item) => (
        <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-subtle mt-0.5 flex-shrink-0">
            {getIcon(item.actionType)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 leading-snug">{item.description}</p>
            <p className="text-[10px] text-slate-400 mt-1">{formatDateTime(item.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
