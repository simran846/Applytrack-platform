'use client';

import React from 'react';
import {
  Application,
  ApplicationStatus,
  PaginationMeta
} from '@/types';
import {
  getStatusConfig,
  getPriorityConfig,
  formatDate
} from '@/lib/utils';
import {
  Eye,
  Edit2,
  Trash2,
  CalendarPlus,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Globe,
  Building2,
  MapPin
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ApplicationsTableProps {
  applications: Application[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onViewDetails: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onScheduleInterview: (app: Application) => void;
  onQuickStatusChange: (appId: string, status: ApplicationStatus) => void;
}

export function ApplicationsTable({
  applications,
  pagination,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
  onScheduleInterview,
  onQuickStatusChange
}: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-subtle space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <Eye className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No applications match your search or filter</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try adjusting your search terms, status filters, or add a new internship application to track.
        </p>
      </div>
    );
  }

  const getWorkModeIcon = (mode: string) => {
    switch (mode) {
      case 'REMOTE':
        return <Globe className="w-3 h-3 text-indigo-500" />;
      case 'HYBRID':
        return <Building2 className="w-3 h-3 text-sky-500" />;
      case 'ONSITE':
        return <MapPin className="w-3 h-3 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 font-bold">Company & Role</th>
              <th className="py-3.5 px-4 font-bold">Status / Stage</th>
              <th className="py-3.5 px-4 font-bold">Work Mode</th>
              <th className="py-3.5 px-4 font-bold">Priority</th>
              <th className="py-3.5 px-4 font-bold">Compensation</th>
              <th className="py-3.5 px-4 font-bold">Key Dates</th>
              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => {
              const statusCfg = getStatusConfig(app.status);
              const priorityCfg = getPriorityConfig(app.priority);

              return (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors group">
                  {/* Company & Role */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-xs flex-shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50/40 transition-colors">
                        {app.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onViewDetails(app)}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left truncate"
                          >
                            {app.companyName}
                          </button>
                          {app.companyWebsite && (
                            <a
                              href={app.companyWebsite}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-indigo-600"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{app.jobTitle}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status Dropdown / Pill */}
                  <td className="py-3.5 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => onQuickStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${statusCfg.badgeClass}`}
                    >
                      <option value="WISHLIST">Wishlist</option>
                      <option value="APPLIED">Applied</option>
                      <option value="ONLINE_ASSESSMENT">Online Assessment</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFER">Offer</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                  </td>

                  {/* Work Mode */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      {getWorkModeIcon(app.workMode)}
                      <span className="capitalize">{app.workMode.toLowerCase()}</span>
                    </div>
                    {app.location && app.location !== 'Not Specified' && (
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{app.location}</p>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityCfg.badgeClass}`}>
                      {priorityCfg.label}
                    </span>
                  </td>

                  {/* Compensation */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {app.salaryOrStipend || <span className="text-slate-400">—</span>}
                  </td>

                  {/* Key Dates */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-[11px]">
                      <p className="text-slate-600">
                        Applied: <span className="font-medium text-slate-800">{formatDate(app.applicationDate)}</span>
                      </p>
                      {app.applicationDeadline && (
                        <p className="text-rose-600 font-semibold">
                          Due: {formatDate(app.applicationDeadline)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onScheduleInterview(app)}
                        title="Schedule Interview"
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <CalendarPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewDetails(app)}
                        title="View Details"
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(app)}
                        title="Edit Application"
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        title="Delete Application"
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(pagination.totalItems, (pagination.page - 1) * pagination.limit + 1)}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(pagination.totalItems, pagination.page * pagination.limit)}
          </span>{' '}
          of <span className="font-semibold text-slate-800">{pagination.totalItems}</span> applications
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => onPageChange(pagination.page - 1)}
            leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          >
            Previous
          </Button>
          <span className="text-xs font-semibold px-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(pagination.page + 1)}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
