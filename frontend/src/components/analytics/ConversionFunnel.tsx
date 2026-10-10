'use client';

import React from 'react';
import { DashboardMetrics } from '@/types';
import { TrendingUp, Award, Target, CheckCircle2 } from 'lucide-react';

export interface ConversionFunnelProps {
  metrics: DashboardMetrics;
}

export function ConversionFunnel({ metrics }: ConversionFunnelProps) {
  const stages = [
    {
      name: 'Total Applied',
      count: metrics.applied,
      rate: '100%',
      subtext: 'Active pipeline volume',
      badgeBg: 'bg-indigo-600 text-white',
      barColor: 'bg-indigo-600',
      percentage: 100
    },
    {
      name: 'Online Assessments',
      count: metrics.oa + metrics.interviews + metrics.offers,
      rate: metrics.applied > 0 ? `${Math.round(((metrics.oa + metrics.interviews + metrics.offers) / metrics.applied) * 100)}%` : '0%',
      subtext: 'Passed resume screen',
      badgeBg: 'bg-purple-600 text-white',
      barColor: 'bg-purple-600',
      percentage: metrics.applied > 0 ? Math.min(100, Math.round(((metrics.oa + metrics.interviews + metrics.offers) / metrics.applied) * 100)) : 0
    },
    {
      name: 'Interviews Reached',
      count: metrics.interviews + metrics.offers,
      rate: `${metrics.interviewConversionRate}%`,
      subtext: 'Technical & design loops',
      badgeBg: 'bg-amber-600 text-white',
      barColor: 'bg-amber-500',
      percentage: Math.min(100, metrics.interviewConversionRate)
    },
    {
      name: 'Offers Extended',
      count: metrics.offers,
      rate: `${metrics.offerConversionRate}%`,
      subtext: 'Final compensation packages',
      badgeBg: 'bg-emerald-600 text-white',
      barColor: 'bg-emerald-600',
      percentage: Math.min(100, metrics.offerConversionRate)
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Application Conversion Funnel</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Stage progression and conversion ratios from initial submission to final offers.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold shadow-xs">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>{metrics.interviewToOfferRate}% Interview-to-Offer</span>
        </div>
      </div>

      {/* 4 Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages.map((stage, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-indigo-200 hover:bg-white transition-all card-hover flex flex-col justify-between space-y-4"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-800 tracking-tight">{stage.name}</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${stage.badgeBg}`}>
                {stage.rate}
              </span>
            </div>

            {/* Metric Value */}
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{stage.count}</div>
              <p className="text-xs text-slate-500 font-medium mt-1">{stage.subtext}</p>
            </div>

            {/* Progress Bar Indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${stage.barColor}`}
                  style={{ width: `${Math.max(5, stage.percentage)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
