'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { MonthlyTrendItem } from '@/types';

export interface MonthlyActivityChartProps {
  data: MonthlyTrendItem[];
}

export function MonthlyActivityChart({ data }: MonthlyActivityChartProps) {
  const totalSubmissions = data.reduce((acc, curr) => acc + curr.applications, 0);

  if (data.length === 0 || totalSubmissions === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-slate-400 text-sm">
        <p>No activity logged across the past 6 months</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 25, left: -10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="applicationsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="interviewsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 13, fill: '#475569', fontWeight: 500 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
            dy={8}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            dx={-4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
              fontSize: '13px',
              padding: '10px 14px'
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={36}
            iconType="circle"
            iconSize={9}
            formatter={(val) => (
              <span className="text-xs sm:text-sm text-slate-700 font-semibold mr-3">{val}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="applications"
            name="Applications"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#applicationsGrad)"
          />
          <Area
            type="monotone"
            dataKey="interviews"
            name="Interviews"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#interviewsGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
