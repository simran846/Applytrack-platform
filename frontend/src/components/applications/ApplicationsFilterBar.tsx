'use client';

import React from 'react';
import {
  Search,
  LayoutList,
  Kanban,
  Download,
  Filter,
  ArrowUpDown,
  X
} from 'lucide-react';
import { ApplicationStatus, Priority, WorkMode } from '@/types';
import { Button } from '../ui/Button';

export interface ApplicationsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'kanban';
  onViewModeChange: (mode: 'table' | 'kanban') => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  workModeFilter: string;
  onWorkModeFilterChange: (mode: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderToggle: () => void;
  onExport: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ApplicationsFilterBar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  workModeFilter,
  onWorkModeFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  onExport,
  onClearFilters,
  hasActiveFilters
}: ApplicationsFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-4 space-y-4">
      {/* Top Row: Search & View Mode Switch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company, role, location..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        {/* View Mode & Export actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV / JSON
          </Button>
        </div>
      </div>

      {/* Bottom Row: Filters & Sorters */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          Filters:
        </span>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="WISHLIST">Wishlist</option>
          <option value="APPLIED">Applied</option>
          <option value="ONLINE_ASSESSMENT">Online Assessment</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>

        {/* WorkMode Filter */}
        <select
          value={workModeFilter}
          onChange={(e) => onWorkModeFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Work Modes</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">On-site</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="TOP_CHOICE">Top Choice</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Sort By Select */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[11px] text-slate-400 mr-1">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt">Date Added</option>
            <option value="applicationDate">Application Date</option>
            <option value="applicationDeadline">Deadline</option>
            <option value="companyName">Company Name</option>
          </select>

          <button
            onClick={onSortOrderToggle}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
