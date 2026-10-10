'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { analyticsApi } from '@/lib/api';
import { DashboardOverviewData } from '@/types';
import { StatCards } from '@/components/dashboard/StatCards';
import { MonthlyActivityChart } from '@/components/dashboard/MonthlyActivityChart';
import { DistributionChart } from '@/components/dashboard/DistributionChart';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ScheduleInterviewModal } from '@/components/interviews/ScheduleInterviewModal';
import { applicationsApi } from '@/lib/api';
import { Application } from '@/types';
import {
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  AlertCircle,
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [overviewRes, appsRes] = await Promise.all([
        analyticsApi.getOverview(),
        applicationsApi.list({ limit: 50 })
      ]);
      setData(overviewRes.data.data);
      setApplications(appsRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleGlobalRefresh = () => {
      fetchDashboardData();
    };

    window.addEventListener('applytrack:refresh', handleGlobalRefresh);
    return () => {
      window.removeEventListener('applytrack:refresh', handleGlobalRefresh);
    };
  }, [fetchDashboardData]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 h-80" />
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Stat Cards Row */}
      <StatCards metrics={data.metrics} />

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Application & Interview Velocity</h3>
                <p className="text-xs text-slate-500">Monthly submissions and scheduled interview loops</p>
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <MonthlyActivityChart data={data.monthlyTrend} />
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pipeline Breakdown</h3>
              <p className="text-xs text-slate-500">Active status distribution</p>
            </div>
          </div>
          <DistributionChart data={data.statusDistribution} />
        </div>
      </div>

      {/* 3. Three Columns: Upcoming Interviews, Deadlines, Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Upcoming Interviews */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Interviews</h3>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {data.upcomingInterviews.length}
            </span>
          </div>
          <UpcomingInterviews
            interviews={data.upcomingInterviews}
            onScheduleClick={() => setIsScheduleOpen(true)}
          />
        </div>

        {/* Col 2: Upcoming Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Actionable Deadlines</h3>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {data.upcomingDeadlines.length}
            </span>
          </div>
          <UpcomingDeadlines deadlines={data.upcomingDeadlines} />
        </div>

        {/* Col 3: Audit Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Live Log</span>
          </div>
          <RecentActivityFeed activities={data.recentActivities} />
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        applications={applications}
        onSaved={fetchDashboardData}
      />
    </div>
  );
}
