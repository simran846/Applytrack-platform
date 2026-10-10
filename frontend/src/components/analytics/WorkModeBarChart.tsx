'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { WorkMode } from '@/types';

export interface WorkModeBarChartProps {
  data: { mode: WorkMode; count: number }[];
}

const COLORS = ['#6366f1', '#3b82f6', '#f59e0b'];

export function WorkModeBarChart({ data }: WorkModeBarChartProps) {
  const chartData = data.map((d) => ({
    name: d.mode.charAt(0) + d.mode.slice(1).toLowerCase(),
    count: d.count
  }));

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-slate-400 text-sm">
        <p>No work mode data recorded yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
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
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
              fontSize: '13px',
              padding: '10px 14px'
            }}
            formatter={(value: any) => [`${value} Applications`, 'Volume']}
          />
          <Bar dataKey="count" name="Applications" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
