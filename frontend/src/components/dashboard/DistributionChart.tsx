'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { ApplicationStatus } from '@/types';

export interface DistributionChartProps {
  data: { status: ApplicationStatus; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  WISHLIST: '#94a3b8',
  APPLIED: '#3b82f6',
  ONLINE_ASSESSMENT: '#a855f7',
  INTERVIEW: '#f59e0b',
  OFFER: '#10b981',
  REJECTED: '#f43f5e',
  WITHDRAWN: '#64748b'
};

const STATUS_LABELS: Record<string, string> = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  ONLINE_ASSESSMENT: 'OA Stage',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn'
};

export function DistributionChart({ data }: DistributionChartProps) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_LABELS[d.status] || d.status,
      value: d.count,
      color: STATUS_COLORS[d.status] || '#6366f1'
    }));

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
        <p>No application data recorded yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={1} stroke="#ffffff" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              fontSize: '12px',
              fontWeight: 500
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(val) => <span className="text-xs text-slate-600 font-medium mr-2">{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
