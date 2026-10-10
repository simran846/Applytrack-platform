'use client';

import React from 'react';
import { Application, ApplicationStatus } from '@/types';
import { getStatusConfig, getPriorityConfig, formatDate } from '@/lib/utils';
import {
  CalendarPlus,
  Eye,
  Edit2,
  Trash2,
  Building2,
  Clock,
  ArrowRightCircle,
  ExternalLink
} from 'lucide-react';

export interface KanbanBoardProps {
  applications: Application[];
  onViewDetails: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onScheduleInterview: (app: Application) => void;
  onQuickStatusChange: (appId: string, status: ApplicationStatus) => void;
}

const COLUMNS: { id: ApplicationStatus; title: string; headerClass: string }[] = [
  { id: 'WISHLIST', title: 'Wishlist', headerClass: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'APPLIED', title: 'Applied', headerClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'ONLINE_ASSESSMENT', title: 'OA Stage', headerClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'INTERVIEW', title: 'Interviewing', headerClass: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'OFFER', title: 'Offer Received', headerClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'REJECTED', title: 'Rejected', headerClass: 'bg-rose-50 text-rose-700 border-rose-200' }
];

export function KanbanBoard({
  applications,
  onViewDetails,
  onEdit,
  onDelete,
  onScheduleInterview,
  onQuickStatusChange
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
      {COLUMNS.map((col) => {
        const colApps = applications.filter((a) => a.status === col.id);

        return (
          <div
            key={col.id}
            className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-3 min-h-[500px] flex flex-col gap-3"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold ${col.headerClass}`}>
              <span>{col.title}</span>
              <span className="w-5 h-5 rounded-full bg-white text-slate-800 flex items-center justify-center text-[10px] font-extrabold shadow-subtle">
                {colApps.length}
              </span>
            </div>

            {/* Applications List in Column */}
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {colApps.length === 0 ? (
                <div className="h-32 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-[11px]">
                  No items
                </div>
              ) : (
                colApps.map((app) => {
                  const priorityCfg = getPriorityConfig(app.priority);

                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-subtle hover:border-indigo-300 transition-all card-hover space-y-2.5"
                    >
                      {/* Top row: Priority badge and quick actions */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${priorityCfg.badgeClass}`}>
                          {priorityCfg.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onScheduleInterview(app)}
                            title="Schedule Interview"
                            className="text-slate-400 hover:text-indigo-600 p-1"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onViewDetails(app)}
                            title="View Details"
                            className="text-slate-400 hover:text-slate-700 p-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEdit(app)}
                            title="Edit Application"
                            className="text-slate-400 hover:text-slate-700 p-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(app)}
                            title="Delete"
                            className="text-slate-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main info */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4
                            onClick={() => onViewDetails(app)}
                            className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate"
                          >
                            {app.companyName}
                          </h4>
                          {app.jobPostingUrl && (
                            <a
                              href={app.jobPostingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-indigo-600"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{app.jobTitle}</p>
                      </div>

                      {/* Compensation / Meta */}
                      {app.salaryOrStipend && (
                        <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-100/80">
                          {app.salaryOrStipend}
                        </div>
                      )}

                      {/* Dates and Quick Stage Mover */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(app.applicationDate)}
                        </span>

                        {/* Move Stage Selector */}
                        <select
                          value={app.status}
                          onChange={(e) => onQuickStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="WISHLIST">Wishlist</option>
                          <option value="APPLIED">Applied</option>
                          <option value="ONLINE_ASSESSMENT">OA</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="OFFER">Offer</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="WITHDRAWN">Withdrawn</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
