'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Interview, Application } from '@/types';
import { interviewsApi, applicationsApi } from '@/lib/api';
import { CalendarView } from '@/components/interviews/CalendarView';
import { AgendaView } from '@/components/interviews/AgendaView';
import { ScheduleInterviewModal } from '@/components/interviews/ScheduleInterviewModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Calendar, ListFilter, Plus, CalendarDays } from 'lucide-react';

export default function InterviewsPage() {
  const { success, error: toastError } = useToast();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'agenda' | 'calendar'>('agenda');

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingInterview, setDeletingInterview] = useState<Interview | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInterviewsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [ivRes, appRes] = await Promise.all([
        interviewsApi.list(),
        applicationsApi.list({ limit: 100 })
      ]);
      setInterviews(ivRes.data.data);
      setApplications(appRes.data.data);
    } catch (err: any) {
      toastError('Error', 'Failed to retrieve scheduled interviews.');
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchInterviewsData();
  }, [fetchInterviewsData]);

  const handleConfirmDelete = async () => {
    if (!deletingInterview) return;
    try {
      setIsDeleting(true);
      await interviewsApi.delete(deletingInterview.id);
      success('Deleted', 'Interview round deleted');
      setIsDeleteOpen(false);
      setDeletingInterview(null);
      fetchInterviewsData();
    } catch (err: any) {
      toastError('Delete Error', 'Could not delete interview');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Interview Scheduling & Prep</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize upcoming technical rounds, system design screens, and post-interview debrief notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'agenda'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setEditingInterview(null);
              setIsScheduleOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'agenda' ? (
        <AgendaView
          interviews={interviews}
          onSelectInterview={(iv) => {
            setEditingInterview(iv);
            setIsScheduleOpen(true);
          }}
          onEdit={(iv) => {
            setEditingInterview(iv);
            setIsScheduleOpen(true);
          }}
          onDelete={(iv) => {
            setDeletingInterview(iv);
            setIsDeleteOpen(true);
          }}
          onScheduleNew={() => {
            setEditingInterview(null);
            setIsScheduleOpen(true);
          }}
        />
      ) : (
        <CalendarView
          interviews={interviews}
          onSelectInterview={(iv) => {
            setEditingInterview(iv);
            setIsScheduleOpen(true);
          }}
          onScheduleNew={() => {
            setEditingInterview(null);
            setIsScheduleOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setEditingInterview(null);
        }}
        applications={applications}
        interviewToEdit={editingInterview}
        onSaved={fetchInterviewsData}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingInterview(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Scheduled Interview?"
        message="This will remove this interview round and its associated prep notes from your agenda."
        isLoading={isDeleting}
      />
    </div>
  );
}
