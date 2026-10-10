'use client';

import React from 'react';
import { Interview } from '@/types';
import { formatDateTime } from '@/lib/utils';
import {
  Calendar,
  Video,
  Clock,
  Building2,
  FileText,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface AgendaViewProps {
  interviews: Interview[];
  onSelectInterview: (interview: Interview) => void;
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
  onScheduleNew: () => void;
}

export function AgendaView({
  interviews,
  onSelectInterview,
  onEdit,
  onDelete,
  onScheduleNew
}: AgendaViewProps) {
  if (interviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-subtle space-y-3">
        <Calendar className="w-12 h-12 text-slate-400 mx-auto opacity-70" />
        <h3 className="text-sm font-bold text-slate-900">No interviews scheduled yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Keep your phone screens, coding loops, and behavioral rounds organized in one centralized agenda.
        </p>
        <div className="pt-2">
          <Button size="sm" onClick={onScheduleNew}>
            Schedule First Interview
          </Button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcoming = interviews.filter((iv) => new Date(iv.interviewDate) >= now);
  const past = interviews.filter((iv) => new Date(iv.interviewDate) < now);

  const renderInterviewCard = (iv: Interview, isUpcoming: boolean) => (
    <div
      key={iv.id}
      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:border-indigo-300 transition-all card-hover space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900">
              {iv.application?.companyName || 'Target Company'}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {iv.interviewRound}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {iv.interviewType}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {iv.application?.jobTitle || 'Software Engineer Intern'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {iv.meetingLink && (
            <a
              href={iv.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Call</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          )}
          <button
            onClick={() => onEdit(iv)}
            title="Edit"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(iv)}
            title="Delete"
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <p className="text-slate-400 font-medium">Scheduled Time</p>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatDateTime(iv.interviewDate)}</span>
          </div>
        </div>

        {iv.location && (
          <div className="space-y-1">
            <p className="text-slate-400 font-medium">Platform / Location</p>
            <p className="font-semibold text-slate-800">{iv.location}</p>
          </div>
        )}
      </div>

      {iv.preparationNotes && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
          <p className="font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preparation Notes</span>
          </p>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{iv.preparationNotes}</p>
        </div>
      )}

      {iv.feedback && (
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
          <p className="font-bold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Debrief & Feedback</span>
          </p>
          <p className="text-emerald-900 leading-relaxed">{iv.feedback}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Upcoming Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Upcoming Interviews ({upcoming.length})
          </h3>
          <Button size="sm" onClick={onScheduleNew}>
            Schedule New Round
          </Button>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-white p-6 rounded-2xl border border-slate-200 text-center">
            No upcoming interviews scheduled on your calendar.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {upcoming.map((iv) => renderInterviewCard(iv, true))}
          </div>
        )}
      </div>

      {/* Past Section */}
      {past.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Past Interview Rounds ({past.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 opacity-80">
            {past.map((iv) => renderInterviewCard(iv, false))}
          </div>
        </div>
      )}
    </div>
  );
}
