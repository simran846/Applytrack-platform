'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Application, Interview } from '@/types';
import { getStatusConfig, getPriorityConfig, formatDate, formatDateTime } from '@/lib/utils';
import {
  Building2,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  User,
  Mail,
  Video,
  FileText,
  ExternalLink,
  Edit2,
  CalendarPlus,
  Trash2
} from 'lucide-react';

export interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onScheduleInterview: (app: Application) => void;
}

export function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onEdit,
  onDelete,
  onScheduleInterview
}: ApplicationDetailModalProps) {
  if (!application) return null;

  const statusCfg = getStatusConfig(application.status);
  const priorityCfg = getPriorityConfig(application.priority);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${application.companyName} — Application Overview`}
      description={`Added on ${formatDate(application.createdAt)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">{application.jobTitle}</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{application.companyName}</span>
              <span>•</span>
              <span className="capitalize">{application.workMode.toLowerCase()}</span>
              {application.location && (
                <>
                  <span>•</span>
                  <span>{application.location}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusCfg.badgeClass}`}>
              {statusCfg.label}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${priorityCfg.badgeClass}`}>
              {priorityCfg.label}
            </span>
          </div>
        </div>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-400 font-medium">Applied Date</p>
            <p className="font-bold text-slate-800 mt-0.5">{formatDate(application.applicationDate)}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-400 font-medium">Deadline / Due</p>
            <p className="font-bold text-rose-600 mt-0.5">{formatDate(application.applicationDeadline)}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-400 font-medium">Compensation</p>
            <p className="font-bold text-emerald-700 mt-0.5">{application.salaryOrStipend || 'Unspecified'}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <p className="text-slate-400 font-medium">Role Type</p>
            <p className="font-bold text-slate-800 mt-0.5">{application.employmentType || 'Internship'}</p>
          </div>
        </div>

        {/* Recruiter & External Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {(application.recruiterName || application.recruiterEmail) && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recruiter Contact</span>
              </p>
              {application.recruiterName && <p className="text-slate-900 font-medium">{application.recruiterName}</p>}
              {application.recruiterEmail && (
                <a
                  href={`mailto:${application.recruiterEmail}`}
                  className="text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  {application.recruiterEmail}
                </a>
              )}
            </div>
          )}

          {(application.jobPostingUrl || application.companyWebsite) && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>External Links</span>
              </p>
              <div className="flex flex-col gap-1">
                {application.jobPostingUrl && (
                  <a
                    href={application.jobPostingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 truncate"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span>View Job Posting</span>
                  </a>
                )}
                {application.companyWebsite && (
                  <a
                    href={application.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 truncate"
                  >
                    <Globe className="w-3 h-3 flex-shrink-0" />
                    <span>Company Website</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Personal Notes */}
        {application.notes && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <p className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Personal Notes & Strategy</span>
            </p>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{application.notes}</p>
          </div>
        )}

        {/* Scheduled Interviews Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Scheduled Interviews</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onScheduleInterview(application);
              }}
              leftIcon={<CalendarPlus className="w-3.5 h-3.5 text-indigo-600" />}
            >
              Add Interview
            </Button>
          </div>

          {application.interviews && application.interviews.length > 0 ? (
            <div className="space-y-2">
              {application.interviews.map((iv) => (
                <div
                  key={iv.id}
                  className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{iv.interviewRound}</span>
                      <span className="text-[10px] font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                        {iv.interviewType}
                      </span>
                    </div>
                    <p className="text-slate-500">{formatDateTime(iv.interviewDate)}</p>
                  </div>

                  {iv.meetingLink && (
                    <a
                      href={iv.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-xs hover:bg-indigo-100 transition-colors flex items-center gap-1"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join Call</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No interview rounds scheduled yet.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(application);
            }}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Application
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit Details
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
