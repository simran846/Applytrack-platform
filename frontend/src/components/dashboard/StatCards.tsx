import React from 'react';
import { DashboardMetrics } from '@/types';
import {
  Layers,
  Send,
  CalendarCheck2,
  Trophy,
  XCircle,
  TrendingUp
} from 'lucide-react';

export interface StatCardsProps {
  metrics: DashboardMetrics;
}

export function StatCards({ metrics }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Applications',
      value: metrics.total,
      subtext: `${metrics.wishlist} in wishlist`,
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: null
    },
    {
      title: 'Active / Applied',
      value: metrics.applied,
      subtext: `${metrics.oa} in assessment stage`,
      icon: Send,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: null
    },
    {
      title: 'Interviews Reached',
      value: metrics.interviews,
      subtext: `${metrics.interviewConversionRate}% of applied`,
      icon: CalendarCheck2,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: {
        text: `${metrics.interviewConversionRate}% conversion`,
        bg: 'bg-amber-50 text-amber-800 border-amber-200'
      }
    },
    {
      title: 'Offers Secured',
      value: metrics.offers,
      subtext: `${metrics.offerConversionRate}% overall win rate`,
      icon: Trophy,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: {
        text: `${metrics.offerConversionRate}% offer rate`,
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
      }
    },
    {
      title: 'Rejected / Archived',
      value: metrics.rejected,
      subtext: `${metrics.withdrawn} withdrawn`,
      icon: XCircle,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-indigo-200 transition-all card-hover flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</div>
              <p className="text-xs text-slate-500 font-medium mt-1">{card.subtext}</p>
            </div>

            {card.badge && (
              <div className="pt-2 border-t border-slate-100">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${card.badge.bg}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  {card.badge.text}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
