'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { analyticsApi } from '@/lib/api';
import { DashboardOverviewData } from '@/types';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { WorkModeBarChart } from '@/components/analytics/WorkModeBarChart';
import { MonthlyActivityChart } from '@/components/dashboard/MonthlyActivityChart';
import { CardSkeleton } from '@/components/ui/Skeleton';
import {
  HelpCircle,
  BarChart3,
  Globe,
  RefreshCw,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await analyticsApi.getDetailed();
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading || !data) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded-lg w-72" />
          <div className="h-4 bg-slate-200 rounded-lg w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-96" />
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header & Introductory Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Recruiting Performance Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruiting Performance & Conversion Analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Real-time pipeline progression, interview efficiency ratios, and submission volume calculated from your live database.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-subtle transition-all cursor-pointer flex-shrink-0 self-start sm:self-center"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 2. Conversion Funnel (KPI Cards) */}
      <ConversionFunnel metrics={data.metrics} />

      {/* 3. Balanced Two-Column Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Monthly Application & Interview Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Application & Interview Velocity</h3>
                <p className="text-xs sm:text-sm text-slate-500">6-Month recruiting velocity and loop scheduling</p>
              </div>
            </div>
          </div>
          <MonthlyActivityChart data={data.monthlyTrend} />
        </div>

        {/* Right Chart: Work Mode Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Work Mode Distribution</h3>
                <p className="text-xs sm:text-sm text-slate-500">Remote vs. Hybrid vs. On-site opportunities</p>
              </div>
            </div>
          </div>
          <WorkModeBarChart data={data.workModeDistribution} />
        </div>
      </div>

      {/* 4. Conversion Formula Documentation Callout (Requirement #9) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Conversion Rate Calculations & Methodology
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Mathematical formulas used to evaluate your tech recruitment conversion funnels.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Interview Conversion Rate */}
          <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Interview Conversion Rate</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ratio of submitted applications that successfully progress to at least one live interview loop.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-indigo-600">
              (Interviews / (Total - Wishlist)) × 100
            </div>
          </div>

          {/* Card 2: Offer Conversion Rate */}
          <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Offer Conversion Rate</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Overall win-rate representing total formal offer letters received against active submissions.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-emerald-600">
              (Offers / (Total - Wishlist)) × 100
            </div>
          </div>

          {/* Card 3: Interview-to-Offer Efficiency */}
          <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Interview-to-Offer Efficiency</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Effectiveness during live interviews converting technical rounds into final compensation packages.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-amber-600">
              (Offers / Total Interviews) × 100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
