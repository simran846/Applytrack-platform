import React from 'react';
import Link from 'next/link';
import { Interview } from '@/types';
import { Calendar, Video, ArrowRight, ExternalLink } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Button } from '../ui/Button';

export interface UpcomingInterviewsProps {
  interviews: Interview[];
  onScheduleClick?: () => void;
}

export function UpcomingInterviews({ interviews, onScheduleClick }: UpcomingInterviewsProps) {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
        <h4 className="text-xs font-bold text-slate-700">No Upcoming Interviews</h4>
        <p className="text-[11px] text-slate-500 mt-0.5 mb-4">You have no scheduled interview rounds on your calendar.</p>
        {onScheduleClick && (
          <Button size="sm" variant="outline" onClick={onScheduleClick}>
            Schedule Interview
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.map((item) => (
        <div
          key={item.id}
          className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-subtle hover:border-indigo-200 transition-all card-hover flex items-start justify-between gap-3"
        >
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">
                {item.application?.companyName || 'Target Company'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {item.interviewRound}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {item.application?.jobTitle || 'Software Engineer Intern'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-medium pt-0.5">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatDateTime(item.interviewDate)}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {item.meetingLink ? (
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
              >
                <Video className="w-3 h-3" />
                <span>Join</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            ) : (
              <span className="text-[10px] text-slate-400 italic">No link</span>
            )}
          </div>
        </div>
      ))}

      <div className="pt-2 text-right">
        <Link
          href="/interviews"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <span>View Full Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
