import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full border',
    md: 'text-xs px-3 py-1 rounded-full border font-medium'
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium select-none', variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
