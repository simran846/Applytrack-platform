import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ApplicationStatus, Priority, WorkMode } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return '—';
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '—';
  }
}

export function getStatusConfig(status: ApplicationStatus): {
  label: string;
  badgeClass: string;
  bgClass: string;
  dotColor: string;
} {
  switch (status) {
    case 'WISHLIST':
      return {
        label: 'Wishlist',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        bgClass: 'bg-slate-50 border-slate-200',
        dotColor: 'bg-slate-400'
      };
    case 'APPLIED':
      return {
        label: 'Applied',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        bgClass: 'bg-blue-50/50 border-blue-200',
        dotColor: 'bg-blue-500'
      };
    case 'ONLINE_ASSESSMENT':
      return {
        label: 'Online Assessment',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        bgClass: 'bg-purple-50/50 border-purple-200',
        dotColor: 'bg-purple-500'
      };
    case 'INTERVIEW':
      return {
        label: 'Interview',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        bgClass: 'bg-amber-50/50 border-amber-200',
        dotColor: 'bg-amber-500'
      };
    case 'OFFER':
      return {
        label: 'Offer',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
        bgClass: 'bg-emerald-50/50 border-emerald-200',
        dotColor: 'bg-emerald-500'
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        bgClass: 'bg-rose-50/50 border-rose-200',
        dotColor: 'bg-rose-500'
      };
    case 'WITHDRAWN':
      return {
        label: 'Withdrawn',
        badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
        bgClass: 'bg-gray-50 border-gray-200',
        dotColor: 'bg-gray-400'
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        bgClass: 'bg-gray-50 border-gray-200',
        dotColor: 'bg-gray-400'
      };
  }
}

export function getPriorityConfig(priority: Priority): {
  label: string;
  badgeClass: string;
} {
  switch (priority) {
    case 'TOP_CHOICE':
      return { label: 'Top Choice', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold' };
    case 'HIGH':
      return { label: 'High', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'MEDIUM':
      return { label: 'Medium', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' };
    case 'LOW':
      return { label: 'Low', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
}

export function getWorkModeConfig(mode: WorkMode): {
  label: string;
  iconName: string;
} {
  switch (mode) {
    case 'REMOTE':
      return { label: 'Remote', iconName: 'Globe' };
    case 'HYBRID':
      return { label: 'Hybrid', iconName: 'Building2' };
    case 'ONSITE':
      return { label: 'On-site', iconName: 'MapPin' };
  }
}
