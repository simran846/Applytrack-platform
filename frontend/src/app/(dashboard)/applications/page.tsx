'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Application, ApplicationStatus, PaginationMeta, WorkMode, Priority } from '@/types';
import { applicationsApi } from '@/lib/api';
import { ApplicationsFilterBar } from '@/components/applications/ApplicationsFilterBar';
import { ApplicationsTable } from '@/components/applications/ApplicationsTable';
import { KanbanBoard } from '@/components/applications/KanbanBoard';
import { AddEditApplicationModal } from '@/components/applications/AddEditApplicationModal';
import { ApplicationDetailModal } from '@/components/applications/ApplicationDetailModal';
import { ScheduleInterviewModal } from '@/components/interviews/ScheduleInterviewModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Plus } from 'lucide-react';

export default function ApplicationsPage() {
  const { success, error: toastError } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleTargetApp, setScheduleTargetApp] = useState<Application | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const res = await applicationsApi.list({
          page,
          limit: viewMode === 'kanban' ? 50 : 10,
          search: search.trim() || undefined,
          status: statusFilter ? (statusFilter as ApplicationStatus) : undefined,
          workMode: workModeFilter ? (workModeFilter as WorkMode) : undefined,
          priority: priorityFilter ? (priorityFilter as Priority) : undefined,
          sortBy,
          sortOrder
        });

        setApplications(res.data.data);
        setPagination(res.data.pagination);
      } catch (err: any) {
        toastError('Failed to load', 'Could not retrieve applications from server.');
      } finally {
        setIsLoading(false);
      }
    },
    [search, statusFilter, workModeFilter, priorityFilter, sortBy, sortOrder, viewMode, toastError]
  );

  useEffect(() => {
    fetchApplications(1);

    const handleRefresh = () => fetchApplications(1);
    window.addEventListener('applytrack:refresh', handleRefresh);
    return () => window.removeEventListener('applytrack:refresh', handleRefresh);
  }, [fetchApplications]);

  const handleQuickStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(appId, newStatus);
      success('Status Updated', `Application moved to ${newStatus}`);
      fetchApplications(pagination.page);
    } catch (err: any) {
      toastError('Update Error', 'Could not update status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingApp) return;
    try {
      setIsDeleting(true);
      await applicationsApi.delete(deletingApp.id);
      success('Deleted', `Removed application for ${deletingApp.companyName}`);
      setIsDeleteOpen(false);
      setDeletingApp(null);
      fetchApplications(pagination.page);
    } catch (err: any) {
      toastError('Delete Error', 'Could not delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setWorkModeFilter('');
    setPriorityFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const hasActiveFilters = Boolean(
    search || statusFilter || workModeFilter || priorityFilter || sortBy !== 'createdAt' || sortOrder !== 'desc'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Applications Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record company details, stage milestones, compensation, and recruiter notes.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingApp(null);
            setIsAddEditOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm shadow-indigo-600/20"
        >
          Add Application
        </Button>
      </div>

      {/* Filter Bar */}
      <ApplicationsFilterBar
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        workModeFilter={workModeFilter}
        onWorkModeFilterChange={setWorkModeFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        onExport={() => {
          // Trigger download
          window.location.href = '#';
        }}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content: Table or Kanban */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle">
          <TableSkeleton rows={8} />
        </div>
      ) : viewMode === 'table' ? (
        <ApplicationsTable
          applications={applications}
          pagination={pagination}
          onPageChange={(p) => fetchApplications(p)}
          onViewDetails={(app) => {
            setSelectedApp(app);
            setIsDetailOpen(true);
          }}
          onEdit={(app) => {
            setEditingApp(app);
            setIsAddEditOpen(true);
          }}
          onDelete={(app) => {
            setDeletingApp(app);
            setIsDeleteOpen(true);
          }}
          onScheduleInterview={(app) => {
            setScheduleTargetApp(app);
            setIsScheduleOpen(true);
          }}
          onQuickStatusChange={handleQuickStatusChange}
        />
      ) : (
        <KanbanBoard
          applications={applications}
          onViewDetails={(app) => {
            setSelectedApp(app);
            setIsDetailOpen(true);
          }}
          onEdit={(app) => {
            setEditingApp(app);
            setIsAddEditOpen(true);
          }}
          onDelete={(app) => {
            setDeletingApp(app);
            setIsDeleteOpen(true);
          }}
          onScheduleInterview={(app) => {
            setScheduleTargetApp(app);
            setIsScheduleOpen(true);
          }}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}

      {/* Modals */}
      <AddEditApplicationModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingApp(null);
        }}
        applicationToEdit={editingApp}
        onSaved={() => fetchApplications(pagination.page)}
      />

      <ApplicationDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedApp(null);
        }}
        application={selectedApp}
        onEdit={(app) => {
          setEditingApp(app);
          setIsAddEditOpen(true);
        }}
        onDelete={(app) => {
          setDeletingApp(app);
          setIsDeleteOpen(true);
        }}
        onScheduleInterview={(app) => {
          setScheduleTargetApp(app);
          setIsScheduleOpen(true);
        }}
      />

      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setScheduleTargetApp(null);
        }}
        applications={applications}
        selectedApplication={scheduleTargetApp}
        onSaved={() => fetchApplications(pagination.page)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingApp(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deletingApp?.companyName} application?`}
        message="This will permanently remove the application and all attached interview logs and reminders."
        isLoading={isDeleting}
      />
    </div>
  );
}
